// src/modules/repository/guards/repository.status.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ENUM_STATUS } from '@prisma/client';
import { REPOSITORIES_ACTIVE_META_KEY } from '../constants/repositories.constant';
import { ENUM_REPOSITORIES_STATUS_CODE_ERROR } from '../constants/repositories.status-code.constant';

@Injectable()
export class RepositoryStatusGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredStatuses: ENUM_STATUS[] =
            this.reflector.getAllAndOverride<ENUM_STATUS[]>(
                REPOSITORIES_ACTIVE_META_KEY,
                [context.getHandler(), context.getClass()]
            );

        if (!requiredStatuses) {
            return true;
        }

        const { __repositories } = context.switchToHttp().getRequest();

        if (!requiredStatuses.includes(__repositories.status)) {
            throw new BadRequestException({
                statusCode:
                    ENUM_REPOSITORIES_STATUS_CODE_ERROR.REPOSITORIES_STATUS_ERROR,
                message: 'repository.error.statusInvalid',
            });
        }

        return true;
    }
}

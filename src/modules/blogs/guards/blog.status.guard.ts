// src/modules/repository/guards/repository.status.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ENUM_STATUS } from '@prisma/client';
import { BLOG_ACTIVE_META_KEY } from '../constants/blog.constant';
import { ENUM_BLOG_STATUS_CODE_ERROR } from '../constants/blog.status-code.constant';

@Injectable()
export class BlogStatusGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredStatuses: ENUM_STATUS[] =
            this.reflector.getAllAndOverride<ENUM_STATUS[]>(
                BLOG_ACTIVE_META_KEY,
                [context.getHandler(), context.getClass()]
            );

        if (!requiredStatuses) {
            return true;
        }

        const { __blog } = context.switchToHttp().getRequest();

        if (!requiredStatuses.includes(__blog.status)) {
            throw new BadRequestException({
                statusCode:
                    ENUM_BLOG_STATUS_CODE_ERROR.BLOG_STATUS_INVALID_ERROR,
                message: 'blog.error.statusInvalid',
            });
        }

        return true;
    }
}

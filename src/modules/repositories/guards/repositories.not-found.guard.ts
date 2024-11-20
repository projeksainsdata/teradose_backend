// src/modules/repository/guards/repository.not-found.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { ENUM_REPOSITORIES_STATUS_CODE_ERROR } from '../constants/repositories.status-code.constant';

@Injectable()
export class RepositoryNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __repositories } = context.switchToHttp().getRequest();

        if (!__repositories) {
            throw new NotFoundException({
                statusCode:
                    ENUM_REPOSITORIES_STATUS_CODE_ERROR.REPOSITORIES_NOT_FOUND_ERROR,
                message: 'repository.error.notFound',
            });
        }

        return true;
    }
}

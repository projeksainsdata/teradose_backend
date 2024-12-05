// src/modules/repository/guards/repository.categories-exist.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { ENUM_BLOG_STATUS_CODE_ERROR } from '../constants/blog.status-code.constant';
import { ENUM_AUTH_ACCESS_FOR } from 'src/common/auth/constants/auth.enum.constant';

@Injectable()
export class BlogOwnerGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __blog } = context.switchToHttp().getRequest();
        const { user } = context.switchToHttp().getRequest();
        console.log('user', user.id);
        console.log('roles', user.roles.accessFor);
        console.log('__blog', __blog.user_id);
        if (!__blog) {
            throw new NotFoundException({
                statusCode: ENUM_BLOG_STATUS_CODE_ERROR.BLOG_NOT_FOUND_ERROR,
                message: 'blog.error.notFound',
            });
        }
        // is admin return true
        if (user.roles.accessFor === ENUM_AUTH_ACCESS_FOR.SUPER_ADMIN) {
            return true;
        }

        if (__blog.user_id !== user.id) {
            throw new ForbiddenException({
                statusCode: ENUM_BLOG_STATUS_CODE_ERROR.BLOG_OWNER_ERROR,
                message: 'blog.error.notOwner',
            });
        }

        return true;
    }
}

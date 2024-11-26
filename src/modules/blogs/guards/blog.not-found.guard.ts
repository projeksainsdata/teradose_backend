// src/modules/blog/guards/repository.not-found.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { ENUM_BLOG_STATUS_CODE_ERROR } from '../constants/blog.status-code.constant';

@Injectable()
export class BlogNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __blog } = context.switchToHttp().getRequest();

        if (!__blog) {
            throw new NotFoundException({
                statusCode: ENUM_BLOG_STATUS_CODE_ERROR.BLOG_NOT_FOUND_ERROR,
                message: 'blog.error.notFound',
            });
        }

        return true;
    }
}

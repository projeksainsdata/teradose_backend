// src/modules/repository/guards/repository.categories-exist.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { ENUM_BLOG_STATUS_CODE_ERROR } from '../constants/blog.status-code.constant';
import { CategoriesServices } from 'src/modules/categories/services/categories.service';
import { Reflector } from '@nestjs/core';
import { BLOG_ACTIVE_META_KEY } from '../constants/blog.constant';

@Injectable()
export class BlogCategoriesExistGuard implements CanActivate {
    constructor(
        private readonly categoriesService: CategoriesServices,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { body } = request;
        const requiredFor: boolean = this.reflector.getAllAndOverride<boolean>(
            BLOG_ACTIVE_META_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!requiredFor && !body.category) {
            return true;
        }

        const category = await this.categoriesService.findOneById(
            body.category
        );

        if (!category) {
            throw new NotFoundException({
                statusCode:
                    ENUM_BLOG_STATUS_CODE_ERROR.BLOG_CATEGORIES_NOT_FOUND_ERROR,
                message: 'blog.error.categoriesNotFound',
            });
        }

        return true;
    }
}

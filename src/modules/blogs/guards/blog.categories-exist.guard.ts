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

@Injectable()
export class BlogCategoriesExistGuard implements CanActivate {
    constructor(private readonly categoriesService: CategoriesServices) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { body } = request;

        if (!body.category) {
            throw new BadRequestException({
                statusCode:
                    ENUM_BLOG_STATUS_CODE_ERROR.BLOG_CATEGORIES_EXIST_ERROR,
                message: 'blog.error.categoriesRequired',
            });
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

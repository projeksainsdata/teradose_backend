// src/modules/repository/decorators/repository.categories.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { BlogCategoriesExistGuard } from '../guards/blog.categories-exist.guard';
import { BLOG_ACTIVE_META_KEY } from '../constants/blog.constant';

export function BlogCategoriesExist(options: boolean = true): MethodDecorator {
    return applyDecorators(
        UseGuards(BlogCategoriesExistGuard),
        SetMetadata(BLOG_ACTIVE_META_KEY, options)
    );
}

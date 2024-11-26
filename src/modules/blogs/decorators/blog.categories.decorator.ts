// src/modules/repository/decorators/repository.categories.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { BlogCategoriesExistGuard } from '../guards/blog.categories-exist.guard';

export function BlogCategoriesExist(): MethodDecorator {
    return applyDecorators(UseGuards(BlogCategoriesExistGuard));
}

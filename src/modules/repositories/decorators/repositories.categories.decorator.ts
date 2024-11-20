// src/modules/repository/decorators/repository.categories.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RepositoryCategoriesExistGuard } from '../guards/repositories.categories-exist.guard';

export function RepositoryCategoriesExist(): MethodDecorator {
    return applyDecorators(UseGuards(RepositoryCategoriesExistGuard));
}

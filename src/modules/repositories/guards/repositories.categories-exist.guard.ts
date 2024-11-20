// src/modules/repository/guards/repository.categories-exist.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { ENUM_REPOSITORIES_STATUS_CODE_ERROR } from '../constants/repositories.status-code.constant';
import { CategoriesServices } from 'src/modules/categories/services/categories.service';

@Injectable()
export class RepositoryCategoriesExistGuard implements CanActivate {
    constructor(private readonly categoriesService: CategoriesServices) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { body } = request;

        if (!body.category) {
            throw new BadRequestException({
                statusCode:
                    ENUM_REPOSITORIES_STATUS_CODE_ERROR.REPOSITORY_CATEGORIES_NOT_FOUND_ERROR,
                message: 'repository.error.categoriesRequired',
            });
        }

        const category = await this.categoriesService.findOneById(
            body.category
        );

        if (!category) {
            throw new NotFoundException({
                statusCode:
                    ENUM_REPOSITORIES_STATUS_CODE_ERROR.REPOSITORY_CATEGORIES_NOT_FOUND_ERROR,
                message: 'repository.error.categoriesNotFound',
            });
        }

        return true;
    }
}

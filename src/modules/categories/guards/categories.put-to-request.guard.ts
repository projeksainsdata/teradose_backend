import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CategoriesServices } from '../services/categories.service';
import { categories } from '@prisma/client';

@Injectable()
export class CategoriesPutToRequestGuard implements CanActivate {
    constructor(private readonly categoriesService: CategoriesServices) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { categories } = params;
        const check: categories =
            await this.categoriesService.findOneById(categories);
        request.__categories = check;

        return true;
    }
}

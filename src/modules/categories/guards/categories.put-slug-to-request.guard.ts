import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CategoriesServices } from '../services/categories.service';
import { categories } from '@prisma/client';

@Injectable()
export class CategoriesPutSlugToRequestGuard implements CanActivate {
    constructor(private readonly categoriesService: CategoriesServices) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { slug } = params;
        const check: categories = await this.categoriesService.findOne({
            slug,
        });
        request.__categories = check;

        return true;
    }
}

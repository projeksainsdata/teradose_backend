import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { CATEGORY_META_KEY } from 'src/modules/categories/constants/categories.meta.constant';
import { CategoriesNotFoundGuard } from 'src/modules/categories/guards/categories.not-found.guard';
import { CategoriesPutToRequestGuard } from 'src/modules/categories/guards/categories.put-to-request.guard';
import { CategoriesPutSlugToRequestGuard } from '../guards/categories.put-slug-to-request.guard';

export function CategoriesGetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(CategoriesPutToRequestGuard, CategoriesNotFoundGuard)
    );
}
export function CategoriesSlugGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(CategoriesPutSlugToRequestGuard, CategoriesNotFoundGuard)
    );
}

export function CategoriesUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(CategoriesPutToRequestGuard, CategoriesNotFoundGuard),
        SetMetadata(CATEGORY_META_KEY, [true])
    );
}

export function CategoriesDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(CategoriesPutToRequestGuard, CategoriesNotFoundGuard),
        SetMetadata(CATEGORY_META_KEY, [true])
    );
}

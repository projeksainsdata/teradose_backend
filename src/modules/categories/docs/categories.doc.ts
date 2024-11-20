import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import { Doc, DocPaging } from 'src/common/doc/decorators/doc.decorator';
import { CategoryGetSerialization } from '../serializations/categories.get.serialization';
import { CategoriesListSerialization } from '../serializations/categories.list.serialization';
import {
    CategoriesDocParamsGet,
    CategoriesDocParamsSlug,
    CATEGORY_DOC_QUERY_SEARCH,
    CATEGORY_DOC_QUERY_TYPE,
} from '../constants/categories.doc.constant';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export function CategoriesUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('category.update', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
                params: CategoriesDocParamsGet,
            },
            response: { serialization: ResponseIdSerialization },
        })
    );
}
export function CategoryDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('category.delete', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: CategoriesDocParamsGet,
            },
            response: { serialization: ResponseIdSerialization },
        })
    );
}

export function CategoryGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<CategoryGetSerialization>('category.get', {
            request: {
                params: CategoriesDocParamsGet,
            },
            response: {
                serialization: CategoryGetSerialization,
            },
        })
    );
}

export function CategoryGetSlugDoc(): MethodDecorator {
    return applyDecorators(
        Doc<CategoryGetSerialization>('category.get', {
            request: {
                params: CategoriesDocParamsSlug,
            },
            response: {
                serialization: CategoryGetSerialization,
            },
        })
    );
}

export function CategoryListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<CategoriesListSerialization>('category.list', {
            request: {
                queries: [
                    ...CATEGORY_DOC_QUERY_TYPE,
                    ...CATEGORY_DOC_QUERY_SEARCH,
                ],
            },
            response: {
                serialization: CategoryGetSerialization,
            },
        })
    );
}

export function CategoriesCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('categories.create', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.CREATED,
                serialization: ResponseIdSerialization,
            },
        })
    );
}

// src/modules/Blog/docs/blog.public.doc.ts
import { applyDecorators } from '@nestjs/common';
import { Doc, DocPaging } from 'src/common/doc/decorators/doc.decorator';
import {
    BlogDocParamsGet,
    BlogDocQueryCategoryName,
    BlogDocQueryStatus,
    BlogDocQueryCategory,
    BlogDocParamsSlug,
} from '../constants/blog.doc.constant';
import { BlogListSerialization } from '../serializations/blog.list.serialization';
import { BlogGetSerialization } from '../serializations/blog.get.serialization';

export function BlogPublicListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<BlogListSerialization>('Blog.public.list', {
            request: {
                queries: [...BlogDocQueryCategoryName],
            },
            response: {
                serialization: BlogListSerialization,
            },
        })
    );
}

export function BlogPublicGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<BlogGetSerialization>('Blog.public.get', {
            request: {
                params: BlogDocParamsGet,
            },
            response: {
                serialization: BlogGetSerialization,
            },
        })
    );
}

export function BlogSlugPublicGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<BlogGetSerialization>('Blog.public.get', {
            request: {
                params: BlogDocParamsSlug,
            },
            response: {
                serialization: BlogGetSerialization,
            },
        })
    );
}

export function BlogPublicCategoryDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<BlogListSerialization>('Blog.public.category', {
            request: {
                params: BlogDocQueryCategory,
                queries: [...BlogDocQueryStatus, ...BlogDocQueryCategoryName],
            },
            response: {
                serialization: BlogListSerialization,
            },
        })
    );
}

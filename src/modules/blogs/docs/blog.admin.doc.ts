// src/modules/Blog/docs/Blog.admin.doc.ts
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { Doc, DocPaging } from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import {
    BlogDocQueryCategoryName,
    BlogDocParamsGet,
    BlogDocParamsSlug,
    BlogDocQueryStatus,
} from '../constants/blog.doc.constant';
import { BlogListSerialization } from '../serializations/blog.list.serialization';
import { BlogGetSerialization } from '../serializations/blog.get.serialization';

export function BlogListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<BlogListSerialization>('Blog.list', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                queries: [...BlogDocQueryStatus, ...BlogDocQueryCategoryName],
            },
            response: {
                serialization: BlogListSerialization,
            },
        })
    );
}

export function BlogGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<BlogGetSerialization>('Blog.get', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: BlogDocParamsGet,
            },
            response: { serialization: BlogGetSerialization },
        })
    );
}

export function BlogCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('Blog.create', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            response: {
                serialization: ResponseIdSerialization,
            },
        })
    );
}

export function BlogUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('Blog.update', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: BlogDocParamsGet,
            },
            response: { serialization: ResponseIdSerialization },
        })
    );
}

export function BlogDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('Blog.delete', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: BlogDocParamsGet,
            },
        })
    );
}

export function BlogUpdateStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('Blog.updateStatus', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: BlogDocParamsGet,
            },
        })
    );
}

export function BlogUpdateSlugDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('Blog.updateSlug', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: BlogDocParamsSlug,
            },
        })
    );
}

export function BlogGetCategoryDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('Blog.getCategory', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                queries: BlogDocQueryCategoryName,
            },
        })
    );
}

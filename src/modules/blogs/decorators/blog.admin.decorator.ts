// src/modules/Blog/decorators/Blog.admin.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { BLOG_ACTIVE_META_KEY } from '../constants/blog.constant';
import { BlogPutToRequestGuard } from '../guards/blog.put-to-request.guard';
import { BlogNotFoundGuard } from '../guards/blog.not-found.guard';
import { BlogStatusGuard } from '../guards/blog.status.guard';

export function BlogGetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(BlogPutToRequestGuard, BlogNotFoundGuard)
    );
}

export function BlogUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            BlogPutToRequestGuard,
            BlogNotFoundGuard,
            BlogStatusGuard
        ),
        SetMetadata(BLOG_ACTIVE_META_KEY, ['DRAFT'])
    );
}

export function BlogDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            BlogPutToRequestGuard,
            BlogNotFoundGuard,
            BlogStatusGuard
        ),
        SetMetadata(BLOG_ACTIVE_META_KEY, ['DRAFT'])
    );
}

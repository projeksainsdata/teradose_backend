// src/modules/blogs/controllers/blog.public.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Blogs } from '@prisma/client';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { BlogsService } from '../services/blog.service';
import { GetBlog } from '../decorators/blog.decorator';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    BlogRequestCategoryDto,
    BlogRequestIdDto,
    BlogRequestSlugDto,
} from '../dtos/blog.request.dto';
import {
    BLOG_DEFAULT_AVAILABLE_ORDER_BY,
    BLOG_DEFAULT_ORDER_BY,
    BLOG_DEFAULT_ORDER_DIRECTION,
    BLOG_DEFAULT_PER_PAGE,
    BLOG_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/blog.list.constant';
import {
    PaginationQuery,
    PaginationQueryJoinSearch,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { BlogListSerialization } from '../serializations/blog.list.serialization';
import { BlogGetSerialization } from '../serializations/blog.get.serialization';
import {
    BlogPublicCategoryDoc,
    BlogPublicGetDoc,
    BlogPublicListDoc,
    BlogSlugPublicGetDoc,
} from '../docs/blog.public.doc';
import { BlogGetGuard } from '../decorators/blog.admin.decorator';

@ApiTags('modules.public.blog')
@Controller({
    version: '1',
    path: '/blogs',
})
export class BlogsPublicController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly blogService: BlogsService
    ) {}

    @BlogPublicListDoc()
    @ResponsePaging('blog.list', {
        serialization: BlogListSerialization,
    })
    @Get('/')
    async list(
        @PaginationQuery(
            BLOG_DEFAULT_PER_PAGE,
            BLOG_DEFAULT_ORDER_BY,
            BLOG_DEFAULT_ORDER_DIRECTION,
            BLOG_DEFAULT_AVAILABLE_SEARCH,
            BLOG_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryJoinSearch([
            {
                field: 'name',
                table: 'categories',
                searchField: 'categoryName',
            },
        ])
        joinSearch: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...joinSearch._joins,
            status: 'PUBLISHED', // Only show published blogs
        };

        const blogs = await this.blogService.findAll(find, {
            skip: _offset,
            take: _limit,
            orderBy: _order,
            select: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
                id: true,
                slug: true,
                createdAt: true,
                description: true,
                thumbnail: true,
                title: true,
            },
        });

        const total = await this.blogService.getTotal(find);
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: blogs,
        };
    }

    @BlogPublicGetDoc()
    @Response('blog.get', { serialization: BlogGetSerialization })
    @BlogGetGuard()
    @RequestParamGuard(BlogRequestIdDto)
    @Get('/:blogs')
    async get(@GetBlog() blog: Blogs): Promise<IResponse> {
        // join categories and user
        const dataJoin = await this.blogService.findOneById(blog.id, {
            include: {
                categories: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        jobTitle: true,
                    },
                },
            },
            where: { id: blog.id },
        });
        return { data: dataJoin };
    }

    @BlogPublicCategoryDoc()
    @Response('blog.category', { serialization: BlogListSerialization })
    @RequestParamGuard(BlogRequestCategoryDto)
    @Get('/category/:categoryId')
    async getByCategory(
        @Param('categoryId') categoryId: string,
        @PaginationQuery(
            BLOG_DEFAULT_PER_PAGE,
            BLOG_DEFAULT_ORDER_BY,
            BLOG_DEFAULT_ORDER_DIRECTION,
            BLOG_DEFAULT_AVAILABLE_SEARCH,
            BLOG_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            categories: {
                some: {
                    id: categoryId,
                },
            },
            status: 'PUBLISHED',
        };

        const blogs = await this.blogService.findAll(find, {
            skip: _offset,
            take: _limit,
            orderBy: _order,
            select: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
                id: true,
                slug: true,
                createdAt: true,
                description: true,
                thumbnail: true,
                title: true,
            },
        });

        const total = await this.blogService.getTotal(find);
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: blogs,
        };
    }

    @BlogSlugPublicGetDoc()
    @Response('blog.get.slug', { serialization: BlogGetSerialization })
    @RequestParamGuard(BlogRequestSlugDto)
    @Get('/slug/:slug')
    async getBySlug(@Param('slug') slug: string) {
        const joinData = await this.blogService.findOneBySlug(slug, {
            include: {
                categories: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        jobTitle: true,
                    },
                },
            },
        });

        return {
            data: joinData,
        };
    }
}

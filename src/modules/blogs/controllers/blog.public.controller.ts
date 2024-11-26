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
import { BlogRequestDto } from '../dtos/blog.request.dto';
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
} from '../docs/blog.public.doc';

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
            include: {
                categories: true,
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
    @RequestParamGuard(BlogRequestDto)
    @Get('/:blogs')
    async get(@GetBlog() blog: Blogs): Promise<IResponse> {
        return {
            data: blog,
        };
    }

    @BlogPublicCategoryDoc()
    @Response('blog.category')
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
            include: {
                categories: true,
            },
        });

        const total = await this.blogService.getTotal(find);
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: blogs,
        };
    }
}
// src/modules/blog/controllers/blog.admin.controller.ts
import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Blogs, ENUM_STATUS } from '@prisma/client';
import {
    AuthJwtAuthorAccessProtected,
    AuthJwtPayload,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { BlogsService } from '../services/blog.service';
import { BlogCreateDto } from '../dtos/blog.create.dto';
import { BlogRequestIdDto } from '../dtos/blog.request.dto';
import { BlogUpdateDto } from '../dtos/blog.update.dto';
import { GetBlog } from '../decorators/blog.decorator';
import {
    BlogListDoc,
    BlogGetDoc,
    BlogCreateDoc,
    BlogUpdateDoc,
    BlogDeleteDoc,
    BlogUpdateStatusDoc,
} from '../docs/blog.admin.doc';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    PaginationQuery,
    PaginationQueryFilterInEnum,
    PaginationQueryJoinSearch,
} from 'src/common/pagination/decorators/pagination.decorator';
import {
    BLOG_DEFAULT_AVAILABLE_ORDER_BY,
    BLOG_DEFAULT_ORDER_BY,
    BLOG_DEFAULT_ORDER_DIRECTION,
    BLOG_DEFAULT_PER_PAGE,
    BLOG_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/blog.list.constant';
import {
    ENUM_BLOG_STATUS,
    ENUM_BLOG_STATUS_LIST,
    ENUM_BLOG_STATUS_TYPE,
} from '../constants/blog.enum.constant';
import { BlogListSerialization } from '../serializations/blog.list.serialization';
import { BlogGetSerialization } from '../serializations/blog.get.serialization';
import { ENUM_BLOG_STATUS_CODE_ERROR } from '../constants/blog.status-code.constant';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { BlogCategoriesExist } from '../decorators/blog.categories.decorator';
import {
    BlogDeleteGuard,
    BlogGetGuard,
    BlogUpdateGuard,
} from '../decorators/blog.admin.decorator';
import { BlogUpdateStatusDto } from '../dtos/blog.update-status.dto';

@ApiTags('modules.admin.blog')
@Controller({
    version: '1',
    path: '/blogs',
})
export class BlogAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly blogService: BlogsService,
        private readonly helperStringService: HelperStringService
    ) {}

    @BlogListDoc()
    @ResponsePaging('blog.list', {
        serialization: BlogListSerialization,
    })
    @AuthJwtAuthorAccessProtected()
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
        joinSearch: Record<string, any>,
        @PaginationQueryFilterInEnum(
            'status',
            ENUM_BLOG_STATUS_TYPE,
            ENUM_BLOG_STATUS_LIST
        )
        status: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...joinSearch._joins,
            ...status,
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
                status: true,
            },
        });

        const total = await this.blogService.getTotal(find);
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: blogs,
        };
    }

    @BlogGetDoc()
    @Response('blog.get', { serialization: BlogGetSerialization })
    @AuthJwtAuthorAccessProtected()
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

    @BlogCreateDoc()
    @Response('blog.create')
    @AuthJwtAuthorAccessProtected()
    @BlogCategoriesExist()
    @Post('/')
    async create(
        @Body() dto: BlogCreateDto,
        @AuthJwtPayload('id') user_id: string
    ): Promise<IResponse> {
        const isExist = await this.blogService.existBytitle(dto.title);
        if (isExist) {
            throw new ConflictException({
                statusCode: ENUM_BLOG_STATUS_CODE_ERROR.BLOG_EXIST_ERROR,
                message: 'blogs.error.exist',
            });
        }
        // Generate slug from title
        dto.slug = this.helperStringService.convertToSlug(dto.title);
        dto.user_id = user_id;
        try {
            const created = await this.blogService.create(dto);
            return { data: { id: created.id } };
        } catch (error: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }

    @BlogUpdateDoc()
    @Response('blog.update', {
        serialization: BlogGetSerialization,
    })
    @AuthJwtAuthorAccessProtected()
    @BlogCategoriesExist(false)
    @BlogUpdateGuard()
    @RequestParamGuard(BlogRequestIdDto)
    @Put('/:blogs')
    async update(
        @GetBlog() blog: Blogs,
        @Body() dto: BlogUpdateDto
    ): Promise<IResponse> {
        try {
            const updated = await this.blogService.update(blog.id, dto);
            return { data: { id: updated.id } };
        } catch (error: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }

    @BlogUpdateStatusDoc()
    @Response('blog.updateStatus', {
        serialization: BlogGetSerialization,
    })
    @AuthJwtAuthorAccessProtected()
    @BlogGetGuard()
    @RequestParamGuard(BlogRequestIdDto)
    @Patch('/:blogs/status')
    async updateStatus(
        @GetBlog() blog: Blogs,
        @Body() status: BlogUpdateStatusDto
    ): Promise<IResponse> {
        try {
            await this.blogService.updateStatus(blog.id, status.status);
            return { data: { id: blog.id } };
        } catch (error: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }

    @BlogDeleteDoc()
    @Response('blog.delete')
    @AuthJwtAuthorAccessProtected()
    @BlogDeleteGuard()
    @RequestParamGuard(BlogRequestIdDto)
    @Delete('/:blogs')
    async delete(@GetBlog() blog: Blogs): Promise<void> {
        await this.blogService.delete(blog.id);
        return;
    }
}

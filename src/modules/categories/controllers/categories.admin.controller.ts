import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { categories } from '@prisma/client';
import {
    AuthJwtAdminAccessProtected,
    AuthJwtAuthorAccessProtected,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import {
    PaginationQuery,
    PaginationQueryBoolean,
    PaginationQueryFilterInEnum,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
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
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

import { GetCategories } from 'src/modules/categories/decorators/categories.decorator';
import {
    CategoryGetDoc,
    CategoryListDoc,
    CategoriesUpdateDoc,
    CategoryDeleteDoc,
    CategoriesCreateDoc,
} from 'src/modules/categories/docs/categories.doc';
import { CategoriesServices } from '../services/categories.service';
import { CategoriesListSerialization } from '../serializations/categories.list.serialization';
import {
    CATOGORY_DEFAULT_PER_PAGE,
    CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
    CATEGORY_DEFAULT_AVAILABLE_SEARCH,
    CATEGORY_DEFAULT_ORDER_BY,
    CATEGORY_DEFAULT_ORDER_DIRECTION,
} from '../constants/categories.list.constant';
import { CategoryGetSerialization } from '../serializations/categories.get.serialization';
import { CategoriesRequestDto } from '../dtos/categories.request.dto';
import {
    CategoriesDeleteGuard,
    CategoriesGetGuard,
    CategoriesUpdateGuard,
} from '../decorators/categories.admin.decorator';
import { CategoriesUpdateDto } from '../dtos/categories.update.dto';
import { CategoriesCreateDto } from '../dtos/categories.create.dto';
import { ENUM_CATEGORIES_STATUS_CODE_ERROR } from '../constants/categoties.status-code.constant';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import {
    CATEGORY_TYPE_LIST,
    ENUM_CATEGORY_TYPE,
} from '../constants/categories.enum.constant';

@ApiTags('modules.admin.categories')
@Controller({
    version: '1',
    path: '/categories',
})
export class CategoriesAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly categoriesService: CategoriesServices,
        private readonly helperstringService: HelperStringService
    ) {}

    @CategoryListDoc()
    @ResponsePaging('categories.list', {
        serialization: CategoriesListSerialization,
    })
    @AuthJwtAuthorAccessProtected()
    @Get('/')
    async list(
        @PaginationQuery(
            CATOGORY_DEFAULT_PER_PAGE,
            CATEGORY_DEFAULT_ORDER_BY,
            CATEGORY_DEFAULT_ORDER_DIRECTION,
            CATEGORY_DEFAULT_AVAILABLE_SEARCH,
            CATEGORY_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInEnum(
            'type',
            CATEGORY_TYPE_LIST,
            ENUM_CATEGORY_TYPE
        )
        type: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...type,
        };
        const categoriesList: categories[] =
            await this.categoriesService.findAll(find, {
                orderBy: _order,
                skip: _offset,
                take: _limit,
            });

        const total: number = await this.categoriesService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: categoriesList,
        };
    }

    @CategoryGetDoc()
    @Response('categories.get', {
        serialization: CategoryGetSerialization,
    })
    @CategoriesGetGuard()
    @AuthJwtAuthorAccessProtected()
    @RequestParamGuard(CategoriesRequestDto)
    @Get('/:categories')
    async get(
        @GetCategories(false) categories: categories
    ): Promise<IResponse> {
        return { data: categories };
    }

    @CategoriesCreateDoc()
    @Response('categories.create', {
        serialization: ResponseIdSerialization,
    })
    @AuthJwtAuthorAccessProtected()
    @Post('/')
    async create(
        @Body()
        { name, type, description }: CategoriesCreateDto
    ): Promise<IResponse> {
        const exist: boolean = await this.categoriesService.existByName(name);
        if (exist) {
            throw new ConflictException({
                statusCode:
                    ENUM_CATEGORIES_STATUS_CODE_ERROR.CATEGORIES_EXIST_ERROR,
                message: 'categories.error.exist',
            });
        }
        const slug = await this.helperstringService.convertToSlug(name);
        try {
            const create = await this.categoriesService.create({
                name,
                description,
                type,
                slug,
            });

            return {
                data: { id: create.id },
            };
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }
    }

    @CategoriesUpdateDoc()
    @Response('categories.update', {
        serialization: ResponseIdSerialization,
    })
    @CategoriesUpdateGuard()
    @RequestParamGuard(CategoriesRequestDto)
    @AuthJwtAuthorAccessProtected()
    @Put('/:categories')
    async update(
        @GetCategories() categories: categories,
        @Body() body: CategoriesUpdateDto
    ): Promise<IResponse> {
        try {
            await this.categoriesService.update(categories.id, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return {
            data: { id: categories.id },
        };
    }

    @CategoryDeleteDoc()
    @Response('categories.delete')
    @CategoriesDeleteGuard()
    @RequestParamGuard(CategoriesRequestDto)
    @AuthJwtAuthorAccessProtected()
    @Delete('/:categories')
    async delete(@GetCategories() categories: categories): Promise<void> {
        try {
            await this.categoriesService.delete(categories.id);
        } catch (error: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }

        return;
    }
}

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { categories } from '@prisma/client';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
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

import { GetCategories } from 'src/modules/categories/decorators/categories.decorator';
import {
    CategoryGetDoc,
    CategoryListDoc,
} from 'src/modules/categories/docs/categories.doc';
import { CategoriesServices } from '../services/categories.service';
import { CategoriesListSerialization } from '../serializations/categories.list.serialization';
import {
    CATOGORY_DEFAULT_PER_PAGE,
    CATEGORY_DEFAULT_ORDER_BY,
    CATEGORY_DEFAULT_ORDER_DIRECTION,
    CATEGORY_DEFAULT_AVAILABLE_SEARCH,
    CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
} from '../constants/categories.list.constant';
import { CategoryGetSerialization } from '../serializations/categories.get.serialization';
import { CategoriesRequestDto } from '../dtos/categories.request.dto';
import { CategoriesGetGuard } from '../decorators/categories.admin.decorator';

@ApiTags('modules.public.categories')
@Controller({
    version: '1',
    path: '/categories',
})
export class CategoriesPublicController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly categoriesService: CategoriesServices
    ) {}

    @CategoryListDoc()
    @ResponsePaging('categories.list', {
        serialization: CategoriesListSerialization,
    })
    @Get('/')
    async list(
        @PaginationQuery(
            CATOGORY_DEFAULT_PER_PAGE,
            CATEGORY_DEFAULT_ORDER_BY,
            CATEGORY_DEFAULT_ORDER_DIRECTION,
            CATEGORY_DEFAULT_AVAILABLE_SEARCH,
            CATEGORY_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
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
    @RequestParamGuard(CategoriesRequestDto)
    @Get('/:categories')
    async get(
        @GetCategories(false) categories: categories
    ): Promise<IResponse> {
        return { data: categories };
    }
}
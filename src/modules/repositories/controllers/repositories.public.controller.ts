// src/modules/repository/controllers/repositories.public.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Repositories } from '@prisma/client';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { RepositoriesService } from '../services/repositories.service';
import { GetRepository } from '../decorators/repositories.decorator';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { RepositoryRequestDto } from '../dtos/repositories.request.dto';
import {
    REPOSITORIES_DEFAULT_AVAILABLE_ORDER_BY,
    REPOSITORIES_DEFAULT_ORDER_BY,
    REPOSITORIES_DEFAULT_ORDER_DIRECTION,
    REPOSITORIES_DEFAULT_PER_PAGE,
    REPOSITORY_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/repositories.list.constant';
import {
    PaginationQuery,
    PaginationQueryJoinSearch,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { RepositoryListSerialization } from '../serializations/repositories.list.serialization';

import { RepositoryGetSerialization } from '../serializations/repositories.get.serialization';
import {
    RepositoryPublicCategoryDoc,
    RepositoryPublicGetDoc,
    RepositoryPublicListDoc,
} from '../docs/repositories.public.doc';

@ApiTags('modules.public.repository')
@Controller({
    version: '1',
    path: '/repositories',
})
export class RepositoriesPublicController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly repositoryService: RepositoriesService
    ) {}

    @RepositoryPublicListDoc()
    @ResponsePaging('repository.list', {
        serialization: RepositoryListSerialization,
    })
    @Get('/')
    async list(
        @PaginationQuery(
            REPOSITORIES_DEFAULT_PER_PAGE,
            REPOSITORIES_DEFAULT_ORDER_BY,
            REPOSITORIES_DEFAULT_ORDER_DIRECTION,
            REPOSITORY_DEFAULT_AVAILABLE_SEARCH,
            REPOSITORIES_DEFAULT_AVAILABLE_ORDER_BY
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
            status: 'PUBLISHED', // Only show published repositories
        };

        const repositories = await this.repositoryService.findAll(find, {
            skip: _offset,
            take: _limit,
            orderBy: _order,
            include: {
                categories: true,
            },
        });

        const total = await this.repositoryService.getTotal(find);
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: repositories,
        };
    }

    @RepositoryPublicGetDoc()
    @Response('repository.get', { serialization: RepositoryGetSerialization })
    @RequestParamGuard(RepositoryRequestDto)
    @Get('/:repositories')
    async get(@GetRepository() repository: Repositories): Promise<IResponse> {
        return {
            data: repository,
        };
    }
    @RepositoryPublicCategoryDoc()
    @Response('repository.category')
    @Get('/category/:categoryId')
    async getByCategory(
        @Param('categoryId') categoryId: string,
        @PaginationQuery(
            REPOSITORIES_DEFAULT_PER_PAGE,
            REPOSITORIES_DEFAULT_ORDER_BY,
            REPOSITORIES_DEFAULT_ORDER_DIRECTION,
            REPOSITORY_DEFAULT_AVAILABLE_SEARCH,
            REPOSITORIES_DEFAULT_AVAILABLE_ORDER_BY
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

        const repositories = await this.repositoryService.findAll(find, {
            skip: _offset,
            take: _limit,
            orderBy: _order,
            include: {
                categories: true,
            },
        });

        const total = await this.repositoryService.getTotal(find);
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: repositories,
        };
    }
}

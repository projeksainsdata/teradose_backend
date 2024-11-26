// src/modules/repository/controllers/repository.admin.controller.ts
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
import { Repositories, ENUM_STATUS } from '@prisma/client';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
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
import { RepositoriesService } from '../services/repositories.service';
import { RepositoryCreateDto } from '../dtos/repositories.create.dto';
import { RepositoryRequestDto } from '../dtos/repositories.request.dto';
import { RepositoryUpdateDto } from '../dtos/repositories.update.dto';
import { GetRepository } from '../decorators/repositories.decorator';
import {
    RepositoryListDoc,
    RepositoryGetDoc,
    RepositoryCreateDoc,
    RepositoryUpdateDoc,
    RepositoryDeleteDoc,
    RepositoryUpdateStatusDoc,
} from '../docs/repositories.admin.doc';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    PaginationQuery,
    PaginationQueryFilterInEnum,
    PaginationQueryJoinSearch,
} from 'src/common/pagination/decorators/pagination.decorator';
import {
    REPOSITORIES_DEFAULT_AVAILABLE_ORDER_BY,
    REPOSITORIES_DEFAULT_ORDER_BY,
    REPOSITORIES_DEFAULT_ORDER_DIRECTION,
    REPOSITORIES_DEFAULT_PER_PAGE,
    REPOSITORY_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/repositories.list.constant';
import {
    ENUM_REPOSITORIES_STATUS,
    ENUM_REPOSITORIES_STATUS_LIST,
} from '../constants/repositories.enum.constant';
import { RepositoryListSerialization } from '../serializations/repositories.list.serialization';
import { RepositoryGetSerialization } from '../serializations/repositories.get.serialization';
import { ENUM_REPOSITORIES_STATUS_CODE_ERROR } from '../constants/repositories.status-code.constant';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { RepositoryCategoriesExist } from '../decorators/repositories.categories.decorator';
import { RepositoryGetGuard } from '../decorators/repositories.admin.decorator';
import { RepositoryUpdateStatusDto } from '../dtos/repositories.update-status.dto';

@ApiTags('modules.admin.repository')
@Controller({
    version: '1',
    path: '/repositories',
})
export class RepositoryAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly repositoryService: RepositoriesService,
        private readonly helperStringService: HelperStringService
    ) {}

    @RepositoryListDoc()
    @ResponsePaging('repository.list', {
        serialization: RepositoryListSerialization,
    })
    @AuthJwtAdminAccessProtected()
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
        joinSearch: Record<string, any>,
        @PaginationQueryFilterInEnum(
            'status',
            ENUM_REPOSITORIES_STATUS,
            ENUM_REPOSITORIES_STATUS_LIST
        )
        status: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...joinSearch._joins,
            ...status,
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

    @RepositoryGetDoc()
    @Response('repository.get', { serialization: RepositoryGetSerialization })
    @AuthJwtAdminAccessProtected()
    @RepositoryGetGuard()
    @RequestParamGuard(RepositoryRequestDto)
    @Get('/:repositories')
    async get(@GetRepository() repository: Repositories): Promise<IResponse> {
        return { data: repository };
    }

    @RepositoryCreateDoc()
    @Response('repository.create')
    @AuthJwtAdminAccessProtected()
    @RepositoryCategoriesExist()
    @Post('/')
    async create(@Body() dto: RepositoryCreateDto): Promise<IResponse> {
        const isExist = await this.repositoryService.existBytitle(dto.title);
        if (isExist) {
            throw new ConflictException({
                statusCode:
                    ENUM_REPOSITORIES_STATUS_CODE_ERROR.REPOSITORIES_EXIST_ERROR,
                message: 'repositories.error.exist',
            });
        }

        // Generate slug from title
        dto.slug = this.helperStringService.convertToSlug(dto.title);
        try {
            const created = await this.repositoryService.create(dto);
            return { data: { id: created.id } };
        } catch (error: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }

    @RepositoryUpdateDoc()
    @Response('repository.update', {
        serialization: RepositoryGetSerialization,
    })
    @AuthJwtAdminAccessProtected()
    @RepositoryGetGuard()
    @RequestParamGuard(RepositoryRequestDto)
    @Put('/:repositories')
    async update(
        @GetRepository() repository: Repositories,
        @Body() dto: RepositoryUpdateDto
    ): Promise<IResponse> {
        try {
            const updated = await this.repositoryService.update(
                repository.id,
                dto
            );
            return { data: { id: updated.id } };
        } catch (error: any) {
            console.log(error);
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }

    @RepositoryUpdateStatusDoc()
    @Response('repository.updateStatus', {
        serialization: RepositoryGetSerialization,
    })
    @AuthJwtAdminAccessProtected()
    @RepositoryGetGuard()
    @RequestParamGuard(RepositoryRequestDto)
    @Patch('/:repositories/status')
    async updateStatus(
        @GetRepository() repository: Repositories,
        @Body() status: RepositoryUpdateStatusDto
    ): Promise<IResponse> {
        try {
            await this.repositoryService.updateStatus(
                repository.id,
                status.status
            );
            return { data: { id: repository.id } };
        } catch (error: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }

    @RepositoryDeleteDoc()
    @Response('repository.delete')
    @AuthJwtAdminAccessProtected()
    @RepositoryGetGuard()
    @RequestParamGuard(RepositoryRequestDto)
    @Delete('/:repositories')
    async delete(@GetRepository() repository: Repositories): Promise<void> {
        await this.repositoryService.delete(repository.id);
        return;
    }
}

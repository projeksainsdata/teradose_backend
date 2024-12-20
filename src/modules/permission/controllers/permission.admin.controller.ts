import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Patch,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
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
import { ENUM_PERMISSION_GROUP } from 'src/modules/permission/constants/permission.enum.constant';
import {
    PERMISSION_DEFAULT_AVAILABLE_ORDER_BY,
    PERMISSION_DEFAULT_AVAILABLE_SEARCH,
    PERMISSION_DEFAULT_GROUP,
    PERMISSION_DEFAULT_IS_ACTIVE,
    PERMISSION_DEFAULT_ORDER_BY,
    PERMISSION_DEFAULT_ORDER_DIRECTION,
    PERMISSION_DEFAULT_PER_PAGE,
} from 'src/modules/permission/constants/permission.list.constant';
import {
    PermissionGetGuard,
    PermissionUpdateActiveGuard,
    PermissionUpdateGuard,
    PermissionUpdateInactiveGuard,
} from 'src/modules/permission/decorators/permission.admin.decorator';
import { GetPermission } from 'src/modules/permission/decorators/permission.decorator';
import {
    PermissionActiveDoc,
    PermissionGetDoc,
    PermissionGroupDoc,
    PermissionInactiveDoc,
    PermissionListDoc,
    PermissionUpdateDoc,
} from 'src/modules/permission/docs/permission.admin.doc';
import { PermissionUpdateDescriptionDto } from 'src/modules/permission/dtos/permission.update-description.dto';
import { PermissionRequestDto } from 'src/modules/permission/dtos/permissions.request.dto';
import { IPermissionGroup } from 'src/modules/permission/interfaces/permission.interface';
import { PermissionGetSerialization } from 'src/modules/permission/serializations/permission.get.serialization';
import { PermissionGroupsSerialization } from 'src/modules/permission/serializations/permission.group.serialization';
import { PermissionListSerialization } from 'src/modules/permission/serializations/permission.list.serialization';
import { PermissionService } from 'src/modules/permission/services/permission.service';

@ApiTags('modules.admin.permission')
@Controller({
    version: '1',
    path: '/permissions',
})
export class PermissionAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly permissionService: PermissionService
    ) {}

    @PermissionListDoc()
    @ResponsePaging('permission.list', {
        serialization: PermissionListSerialization,
    })
    @AuthJwtAdminAccessProtected()
    @Get('/')
    async list(
        @PaginationQuery(
            PERMISSION_DEFAULT_PER_PAGE,
            PERMISSION_DEFAULT_ORDER_BY,
            PERMISSION_DEFAULT_ORDER_DIRECTION,
            PERMISSION_DEFAULT_AVAILABLE_SEARCH,
            PERMISSION_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryBoolean('isActive')
        isActive: Record<string, any>,
        @PaginationQueryFilterInEnum(
            'group',
            PERMISSION_DEFAULT_GROUP,
            ENUM_PERMISSION_GROUP
        )
        group: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ...isActive,
            ..._search,
            ...group,
        };

        const permissions: Permission[] = await this.permissionService.findAll(
            find,
            {
                orderBy: _order,
                skip: _offset,
                take: _limit,
            }
        );

        const total: number = await this.permissionService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: permissions,
        };
    }

    @PermissionGroupDoc()
    @Response('permission.group', {
        serialization: PermissionGroupsSerialization,
    })
    @AuthJwtAdminAccessProtected()
    @Get('/group')
    async group(
        @PaginationQueryFilterInEnum(
            'groups',
            PERMISSION_DEFAULT_GROUP,
            ENUM_PERMISSION_GROUP
        )
        groups: Record<string, any>
    ): Promise<IResponse> {
        const permissions: Permission[] =
            await this.permissionService.findAllByGroup(groups);

        const permissionGroups: IPermissionGroup[] =
            await this.permissionService.groupingByGroups(permissions);

        return { data: { groups: permissionGroups } };
    }

    @PermissionGetDoc()
    @Response('permission.get', {
        serialization: PermissionGetSerialization,
    })
    @PermissionGetGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthJwtAdminAccessProtected()
    @Get('/:permission')
    async get(@GetPermission(true) permission: Permission): Promise<IResponse> {
        return { data: permission };
    }

    @PermissionUpdateDoc()
    @Response('permission.update', {
        serialization: ResponseIdSerialization,
    })
    @PermissionUpdateGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthJwtAdminAccessProtected()
    @Put('/:permission')
    async update(
        @GetPermission() permission: Permission,
        @Body() body: PermissionUpdateDescriptionDto
    ): Promise<IResponse> {
        try {
            await this.permissionService.updateDescription(permission.id, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return {
            data: { id: permission.id },
        };
    }

    @PermissionInactiveDoc()
    @Response('permission.inactive')
    @PermissionUpdateInactiveGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthJwtAdminAccessProtected()
    @Patch('/:permission/inactive')
    async inactive(@GetPermission() permission: Permission): Promise<void> {
        try {
            await this.permissionService.inactive(permission.id);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @PermissionActiveDoc()
    @Response('permission.active', {})
    @PermissionUpdateActiveGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthJwtAdminAccessProtected()
    @Patch('/:permission/active')
    async active(@GetPermission() permission: Permission): Promise<void> {
        try {
            await this.permissionService.active(permission.id);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }
}

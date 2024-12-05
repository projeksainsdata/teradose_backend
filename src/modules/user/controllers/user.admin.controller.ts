import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Put,
    InternalServerErrorException,
    NotFoundException,
    ConflictException,
    Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
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
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/constants/user.status-code.constant';
import {
    UserDeleteGuard,
    UserGetGuard,
    UserUpdateActiveGuard,
    UserUpdateBlockedGuard,
    UserUpdateGuard,
    UserUpdateInactiveGuard,
} from 'src/modules/user/decorators/user.admin.decorator';
import { GetUser } from 'src/modules/user/decorators/user.decorator';
import {
    UserActiveDoc,
    UserBlockedDoc,
    UserCreateDoc,
    UserDeleteDoc,
    UserGetDoc,
    UserInactiveDoc,
    UserListDoc,
    UserUpdateDoc,
} from 'src/modules/user/docs/user.admin.doc';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserRequestDto } from 'src/modules/user/dtos/user.request.dto';
import { UserGetSerialization } from 'src/modules/user/serializations/user.get.serialization';
import { UserListSerialization } from 'src/modules/user/serializations/user.list.serialization';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { UserUpdateNameDto } from 'src/modules/user/dtos/user.update-name.dto';
import {
    USER_DEFAULT_AVAILABLE_ORDER_BY,
    USER_DEFAULT_AVAILABLE_SEARCH,
    USER_DEFAULT_ORDER_BY,
    USER_DEFAULT_ORDER_DIRECTION,
    USER_DEFAULT_PER_PAGE,
} from 'src/modules/user/constants/user.list.constant';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    PaginationQuery,
    PaginationQueryBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { IAuthPassword } from '../../../common/auth/interfaces/auth.interface';
import { User } from '@prisma/client';
import { IUser } from '../interfaces/user.interface';
import { UserUpdateDto } from '../dtos/user.update.dto';

@ApiTags('modules.admin.user')
@Controller({
    version: '1',
    path: '/users',
})
export class UserAdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly paginationService: PaginationService,
        private readonly userService: UserService,
        private readonly roleService: RoleService
    ) {}

    @UserListDoc()
    @ResponsePaging('user.list', {
        serialization: UserListSerialization,
    })
    @AuthJwtAdminAccessProtected()
    @Get('/')
    async list(
        @PaginationQuery(
            USER_DEFAULT_PER_PAGE,
            USER_DEFAULT_ORDER_BY,
            USER_DEFAULT_ORDER_DIRECTION,
            USER_DEFAULT_AVAILABLE_SEARCH,
            USER_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryBoolean('isActive')
        isActive: Record<string, any>,
        @PaginationQueryBoolean('blocked')
        blocked: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...isActive,
            ...blocked,
        };

        const users: IUser[] = await this.userService.findAll(find, {
            orderBy: _order,
            skip: _offset,
            take: _limit,
        });
        const total: number = await this.userService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: users,
        };
    }

    @UserGetDoc()
    @Response('user.get', {
        serialization: UserGetSerialization,
    })
    @UserGetGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthJwtAdminAccessProtected()
    @Get('/:user')
    async get(@GetUser() user: User): Promise<IResponse> {
        const userWithRole: IUser = await this.userService.joinWithRole(
            user.id
        );
        return { data: userWithRole };
    }

    @UserCreateDoc()
    @Response('user.create', {
        serialization: ResponseIdSerialization,
    })
    @AuthJwtAdminAccessProtected()
    @Post('/')
    async create(
        @Body()
        { fullName, email, jobTitle, role, ...body }: UserCreateDto
    ): Promise<IResponse> {
        const checkRole = await this.roleService.exist(role);
        if (!checkRole) {
            throw new NotFoundException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                message: 'role.error.notFound',
            });
        }

        const emailExist: boolean = await this.userService.existByEmail(email);
        if (emailExist) {
            throw new ConflictException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        }

        try {
            const password: IAuthPassword =
                await this.authService.createPassword(body.password);

            const created: User = await this.userService.create(
                { fullName, email, jobTitle, role, ...body },
                password
            );

            return {
                data: { id: created.id },
            };
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }
    }

    @UserDeleteDoc()
    @Response('user.delete')
    @UserDeleteGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthJwtAdminAccessProtected()
    @Delete('/:user')
    async delete(@GetUser() user: User): Promise<void> {
        try {
            await this.userService.delete(user.id);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @UserUpdateDoc()
    @Response('user.update', {
        serialization: ResponseIdSerialization,
    })
    @UserUpdateGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthJwtAdminAccessProtected()
    @Put('/:user')
    async update(
        @GetUser() user: User,
        @Body()
        body: UserUpdateDto
    ): Promise<IResponse> {
        if (body.role) {
            const checkRole = await this.roleService.exist(body.role);
            if (!checkRole) {
                throw new NotFoundException({
                    statusCode:
                        ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                    message: 'role.error.notFound',
                });
            }
        }
        if (body.password) {
            const password: IAuthPassword =
                await this.authService.createPassword(body.password);
            body.password = password.passwordHash;
        }

        try {
            await this.userService.update(user.id, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return {
            data: { id: user.id },
        };
    }

    @UserInactiveDoc()
    @Response('user.inactive')
    @UserUpdateInactiveGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthJwtAdminAccessProtected()
    @Patch('/:user/inactive')
    async inactive(@GetUser() user: User): Promise<void> {
        try {
            await this.userService.inactive(user.id);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @UserActiveDoc()
    @Response('user.active')
    @UserUpdateActiveGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthJwtAdminAccessProtected()
    @Patch('/:user/active')
    async active(@GetUser() user: User): Promise<void> {
        try {
            await this.userService.active(user.id);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @UserBlockedDoc()
    @Response('user.blocked')
    @UserUpdateBlockedGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthJwtAdminAccessProtected()
    @Patch('/:user/blocked')
    async blocked(@GetUser() user: User): Promise<void> {
        try {
            await this.userService.blocked(user.id);
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

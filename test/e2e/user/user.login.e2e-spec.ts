import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { RouterModule } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { E2E_USER_LOGIN_URL } from './user.constant';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/common/request/constants/request.status-code.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/constants/user.status-code.constant';
import { CommonModule } from 'src/common/common.module';
import { RoutesModule } from 'src/router/routes/routes.module';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthService } from 'src/common/auth/services/auth.service';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { ENUM_AUTH_ACCESS_FOR_DEFAULT } from 'src/common/auth/constants/auth.enum.constant';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import { RoleModule } from 'src/modules/role/role.module';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { Role, User } from '@prisma/client';

describe('E2E User Login', () => {
    let app: INestApplication;
    let userService: UserService;
    let authService: AuthService;
    let roleService: RoleService;
    let helperDateService: HelperDateService;

    const password = `@!${faker.person.firstName().toLowerCase()}${faker.person
        .firstName()
        .toUpperCase()}${faker.number.int({ min: 1, max: 99 })}`;

    let user: User;
    let role: Role;
    const roleName = faker.string.alphanumeric(5);
    let passwordExpired: Date;

    beforeAll(async () => {
        process.env.AUTH_JWT_PAYLOAD_ENCRYPT = 'false';

        const modRef = await Test.createTestingModule({
            imports: [
                CommonModule,
                RoleModule,
                PermissionModule,
                RoutesModule,
                RouterModule.register([
                    {
                        path: '/',
                        module: RoutesModule,
                    },
                ]),
            ],
        }).compile();

        app = modRef.createNestApplication();
        useContainer(app.select(CommonModule), { fallbackOnErrors: true });
        userService = app.get(UserService);
        authService = app.get(AuthService);
        roleService = app.get(RoleService);
        helperDateService = app.get(HelperDateService);

        await roleService.create({
            name: roleName,
            accessFor: ENUM_AUTH_ACCESS_FOR_DEFAULT.USER,
            permissions: [],
        });
        role = await roleService.findOneByName(roleName);

        passwordExpired = helperDateService.backwardInDays(5);

        const passwordHash = await authService.createPassword(password);

        user = await userService.create(
            {
                fullName: faker.person.fullName(),
                password: password,
                email: faker.internet.email(),
                jobTitle: faker.person.jobTitle(),
                role: `${role.id}`,
            },
            passwordHash
        );

        await app.init();
    });

    afterAll(async () => {
        jest.clearAllMocks();

        try {
            await userService.deleteMany({ id: user.id });
            await roleService.deleteMany({ name: roleName });
        } catch (err: any) {
            console.error(err);
        }

    });

    it(`POST ${E2E_USER_LOGIN_URL} Error Request`, async () => {
        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                username: [1231],
                password,
                rememberMe: false,
            });

        expect(response.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(response.body.statusCode).toEqual(
            ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR
        );
    });

    it(`POST ${E2E_USER_LOGIN_URL} Not Found`, async () => {
        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                username: faker.internet.userName(),
                password,
                rememberMe: false,
            });

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        expect(response.body.statusCode).toEqual(
            ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR
        );
    });

    it(`POST ${E2E_USER_LOGIN_URL} Password Not Match`, async () => {
        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                email: user.email,
                password: 'Password@@1231',
                rememberMe: false,
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.body.statusCode).toEqual(
            ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR
        );
    });

    it(`POST ${E2E_USER_LOGIN_URL} Password Attempt Max`, async () => {
        await userService.maxPasswordAttempt(user.id);

        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                email: user.email,
                password: 'Password@@1231',
                rememberMe: false,
            });

        expect(response.status).toEqual(HttpStatus.FORBIDDEN);
        expect(response.body.statusCode).toEqual(
            ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR
        );

        await userService.resetPasswordAttempt(user.id);
    });

    it(`POST ${E2E_USER_LOGIN_URL} Blocked`, async () => {
        await userService.blocked(user.id);

        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                email: user.email,
                password,
                rememberMe: false,
            });

        await userService.unblocked(user.id);

        expect(response.status).toEqual(HttpStatus.FORBIDDEN);
        expect(response.body.statusCode).toEqual(
            ENUM_USER_STATUS_CODE_ERROR.USER_BLOCKED_ERROR
        );
    });

    it(`POST ${E2E_USER_LOGIN_URL} Inactive`, async () => {
        await userService.inactive(user.id);

        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                email: user.email,
                password,
                rememberMe: false,
            });

        await userService.active(user.id);

        expect(response.status).toEqual(HttpStatus.FORBIDDEN);
        expect(response.body.statusCode).toEqual(
            ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR
        );
    });

    it(`POST ${E2E_USER_LOGIN_URL} Role Inactive`, async () => {
        await roleService.inactive(role.id);

        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                email: user.email,
                password,
                rememberMe: false,
            });

        await roleService.active(role.id);

        expect(response.status).toEqual(HttpStatus.FORBIDDEN);
        expect(response.body.statusCode).toEqual(
            ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR
        );
    });

    it(`POST ${E2E_USER_LOGIN_URL} Success`, async () => {
        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                email: user.email,
                password,
                rememberMe: false,
            });

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.statusCode).toEqual(HttpStatus.OK);
    });

    it(`POST ${E2E_USER_LOGIN_URL} Password Expired`, async () => {
        await userService.updatePasswordExpired(user.id, passwordExpired);

        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                email: user.email,
                password,
                rememberMe: false,
            });

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.statusCode).toEqual(
            ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_EXPIRED_ERROR
        );
    });
});

describe('E2E User Login Payload Encryption', () => {
    let app: INestApplication;
    let userService: UserService;
    let authService: AuthService;
    let roleService: RoleService;

    const password = `@!${faker.person.firstName().toLowerCase()}${faker.person
        .firstName()
        .toUpperCase()}${faker.number.int({ min: 1, max: 99 })}`;

    let user: User;
    const roleName = faker.string.alphanumeric(5);

    beforeAll(async () => {
        process.env.AUTH_JWT_PAYLOAD_ENCRYPT = 'true';

        const modRef = await Test.createTestingModule({
            imports: [
                CommonModule,
                RoleModule,
                PermissionModule,
                RoutesModule,
                RouterModule.register([
                    {
                        path: '/',
                        module: RoutesModule,
                    },
                ]),
            ],
        }).compile();

        app = modRef.createNestApplication();
        useContainer(app.select(CommonModule), { fallbackOnErrors: true });
        userService = app.get(UserService);
        authService = app.get(AuthService);
        roleService = app.get(RoleService);

        await roleService.create({
            name: roleName,
            accessFor: ENUM_AUTH_ACCESS_FOR_DEFAULT.USER,
            permissions: [],
        });
        const role: Role = await roleService.findOneByName(roleName);

        const passwordHash = await authService.createPassword(password);

        user = await userService.create(
            {
                fullName: faker.person.fullName(),
                password: password,
                email: faker.internet.email(),
                jobTitle: faker.person.jobTitle(),
                role: `${role.id}`,
            },
            passwordHash
        );

        await app.init();
    });

    it(`POST ${E2E_USER_LOGIN_URL} Success`, async () => {
        const response = await request(app.getHttpServer())
            .post(E2E_USER_LOGIN_URL)
            .set('Content-Type', 'application/json')
            .send({
                email: user.email,
                password,
                rememberMe: true,
            });

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.statusCode).toEqual(HttpStatus.OK);
    });
});

export enum ENUM_AUTH_ACCESS_FOR_SUPER_ADMIN {
    SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum ENUM_AUTH_ACCESS_FOR_DEFAULT {
    USER = 'USER',
    AUTHOR = 'AUTHOR',
}

export const ENUM_AUTH_ACCESS_FOR = {
    ...ENUM_AUTH_ACCESS_FOR_SUPER_ADMIN,
    ...ENUM_AUTH_ACCESS_FOR_DEFAULT,
};

export type ENUM_AUTH_ACCESS_FOR =
    | ENUM_AUTH_ACCESS_FOR_SUPER_ADMIN
    | ENUM_AUTH_ACCESS_FOR_DEFAULT;

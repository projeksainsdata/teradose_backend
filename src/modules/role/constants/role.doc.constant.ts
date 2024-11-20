import { faker } from '@faker-js/faker';
import { ENUM_AUTH_ACCESS_FOR } from 'src/common/auth/constants/auth.enum.constant';

export const RoleDocQueryIsActive = [
    {
        name: 'isActive',
        required: false,
        type: 'string',
        example: 'true',
    },
];

export const RoleDocQueryAccessFor = [
    {
        name: 'accessFor',
        required: false,
        type: 'string',
        example: Object.values(ENUM_AUTH_ACCESS_FOR).join(','),
        description: 'enum value',
    },
];

export const RoleDocParamsGet = [
    {
        name: 'role',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.string.uuid(),
    },
];

import { faker } from '@faker-js/faker';

export const UserDocQueryIsActive = [
    {
        name: 'isActive',
        required: false,
        type: 'string',
        example: 'true',
        description: "boolean value",
    },
];

export const UserDocQueryBlocked = [
    {
        name: 'blocked',
        type: 'string',
        default: 'false',
        example: 'false',
        description: "boolean value",
    },
];

export const UserDocParamsGet = [
    {
        name: 'user',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.string.uuid(),
    },
];

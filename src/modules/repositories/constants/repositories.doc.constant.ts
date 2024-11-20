import { faker } from '@faker-js/faker';
import { ENUM_REPOSITORIES_STATUS_LIST } from './repositories.enum.constant';

export const RepostoriesDocQueryStatus = [
    {
        name: 'status',
        required: false,
        type: 'string',
        example: Object.values(ENUM_REPOSITORIES_STATUS_LIST).join(','),
        description: 'enum value with comma separated (,)',
    },
];

export const RepositoryDocQueryCategory = [
    {
        name: 'category',
        required: false,
        type: 'string',
        example: faker.string.uuid(),
        description: 'Filter by category id',
    },
];

export const RepositoryDocQueryCategoryName = [
    {
        name: 'categoryName',
        required: false,
        type: 'string',
        example: faker.person.jobType(),
        description: 'Filter by category name',
    },
];

export const RepostoriesDocParamsGet = [
    {
        name: 'repositories',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.string.uuid(),
    },
];

export const RepostoriesDocParamsSlug = [
    {
        name: 'slug',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.lorem.slug(),
    },
];

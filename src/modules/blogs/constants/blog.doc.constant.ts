import { faker } from '@faker-js/faker';
import { ENUM_BLOG_STATUS_LIST } from './blog.enum.constant';

export const BlogDocQueryStatus = [
    {
        name: 'status',
        required: false,
        type: 'string',
        example: Object.values(ENUM_BLOG_STATUS_LIST).join(','),
        description: 'enum value with comma separated (,)',
    },
];

export const BlogDocQueryCategory = [
    {
        name: 'category',
        required: false,
        type: 'string',
        example: faker.string.uuid(),
        description: 'Filter by category id',
    },
];

export const BlogDocQueryCategoryName = [
    {
        name: 'categoryName',
        required: false,
        type: 'string',
        example: faker.person.jobType(),
        description: 'Filter by category name',
    },
];

export const BlogDocParamsGet = [
    {
        name: 'blog',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.string.uuid(),
    },
];

export const BlogDocParamsSlug = [
    {
        name: 'slug',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.lorem.slug(),
    },
];

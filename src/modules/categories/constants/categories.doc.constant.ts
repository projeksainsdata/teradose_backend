import { faker } from '@faker-js/faker';
import {
    ENUM_CATEGORY_TYPE,
} from 'src/modules/categories/constants/categories.enum.constant';

export const CATEGORY_DOC_QUERY_TYPE = [
    {
        name: 'type',
        type: 'string',
        example: `${ENUM_CATEGORY_TYPE.BLOGS},${ENUM_CATEGORY_TYPE.REPOSITORIES}`,
        description: 'Category type value',
    },
];

export const CATEGORY_DOC_QUERY_SEARCH = [
    {
        name: 'search',
        type: 'string',
        example: faker.commerce.department(),
        description: 'Category search value',
    },
];



export const CategoriesDocParamsGet = [
    {
        name: 'categories',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.string.uuid(),
    },
];

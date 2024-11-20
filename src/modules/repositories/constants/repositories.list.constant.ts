import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { ENUM_REPOSITORIES_STATUS_LIST } from './repositories.enum.constant';

export const REPOSITORIES_DEFAULT_ORDER_BY = 'createdAt';
export const REPOSITORIES_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const REPOSITORIES_DEFAULT_PER_PAGE = 20;
export const REPOSITORIES_DEFAULT_AVAILABLE_ORDER_BY = [
    'title',
    'createdAt',
    'status',
];
export const REPOSITORY_DEFAULT_AVAILABLE_SEARCH = [
    'title',
    'description',
    'product_categories'
];
export const REPOSITORIES_DEFAULT_STATUS = Object.values(
    ENUM_REPOSITORIES_STATUS_LIST
);


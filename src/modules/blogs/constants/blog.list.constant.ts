import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { ENUM_BLOG_STATUS_LIST } from './blog.enum.constant';

export const BLOG_DEFAULT_ORDER_BY = 'createdAt';
export const BLOG_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const BLOG_DEFAULT_PER_PAGE = 20;
export const BLOG_DEFAULT_AVAILABLE_ORDER_BY = [
    'title',
    'createdAt',
];
export const BLOG_DEFAULT_AVAILABLE_SEARCH = ['title', 'description'];
export const BLOG_DEFAULT_STATUS = Object.values(ENUM_BLOG_STATUS_LIST);

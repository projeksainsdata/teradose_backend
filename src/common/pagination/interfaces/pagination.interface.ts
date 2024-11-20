import {
    ENUM_PAGINATION_FILTER_CASE_OPTIONS,
    ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS,
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
} from 'src/common/pagination/constants/pagination.enum.constant';

export type IPaginationOrder = Record<
    string,
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE
>;

export interface IPaginationPaging {
    take?: number;
    skip?: number;
}

export interface IPaginationOptions extends IPaginationPaging {
    orderBy?: IPaginationOrder;
}

export interface IPaginationFilterDateOptions {
    time?: ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS;
}

export interface IPaginationFilterStringContainOptions {
    case?: ENUM_PAGINATION_FILTER_CASE_OPTIONS;
    trim?: boolean;
    fullMatch?: boolean;
}

export interface IPaginationJoinSearchOptions {
    field: string; // Field to search in joined table
    table: string; // Joined table name
    searchField: string; // Search field name in request
}

export interface IPaginationFilterStringEqualOptions
    extends IPaginationFilterStringContainOptions {
    isNumber?: boolean;
}

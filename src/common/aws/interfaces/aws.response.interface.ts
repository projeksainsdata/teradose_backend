// response/interfaces/response.interface.ts
import { ClassConstructor } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';

export interface IResponseOptions<T> {
    serialization?: ClassConstructor<T>;
    messageProperties?: Record<string, any>;
    statusCode?: number;
}

export interface IResponsePagingOptions<T> extends IResponseOptions<T> {
    page?: number;
    perPage?: number;
    total?: number;
}

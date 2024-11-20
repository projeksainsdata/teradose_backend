// response/response.decorator.ts
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ResponseDefaultInterceptor } from '../interceptors/aws.response.default.interceptor';
import { ResponsePagingInterceptor } from '../interceptors/aws.paging.interceptor';
import {
    IResponseOptions,
    IResponsePagingOptions,
} from '../interfaces/aws.response.interface';
import {
    RESPONSE_MESSAGE_PATH,
    RESPONSE_MESSAGE_PROPERTIES,
    RESPONSE_SERIALIZATION,
} from '../constants/aws.s3.constant';

export function Response<T>(
    messagePath: string,
    options?: IResponseOptions<T>
): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponseDefaultInterceptor<T>),
        SetMetadata(RESPONSE_MESSAGE_PATH, messagePath),
        SetMetadata(RESPONSE_SERIALIZATION, options?.serialization),
        SetMetadata(RESPONSE_MESSAGE_PROPERTIES, options?.messageProperties)
    );
}

export function ResponsePaging<T>(
    messagePath: string,
    options?: IResponsePagingOptions<T>
): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponsePagingInterceptor<T>),
        SetMetadata(RESPONSE_MESSAGE_PATH, messagePath),
        SetMetadata(RESPONSE_SERIALIZATION, options?.serialization),
        SetMetadata(RESPONSE_MESSAGE_PROPERTIES, options?.messageProperties)
    );
}

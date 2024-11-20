// interceptors/response.paging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
    RESPONSE_MESSAGE_PATH,
    RESPONSE_SERIALIZATION,
    RESPONSE_MESSAGE_PROPERTIES,
} from '../constants/aws.s3.constant';

@Injectable()
export class ResponsePagingInterceptor<T> implements NestInterceptor<T> {
    constructor(private readonly reflector: Reflector) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const messagePath = this.reflector.get<string>(
            RESPONSE_MESSAGE_PATH,
            context.getHandler()
        );

        const serializationClass = this.reflector.get<ClassConstructor<T>>(
            RESPONSE_SERIALIZATION,
            context.getHandler()
        );

        const messageProperties = this.reflector.get<Record<string, any>>(
            RESPONSE_MESSAGE_PROPERTIES,
            context.getHandler()
        );

        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map((responseData: any) => {
                const statusCode = response.statusCode || HttpStatus.OK;

                const { data, metadata } = responseData;

                const serializedData = serializationClass
                    ? data.map((item: any) =>
                          plainToInstance(serializationClass, item, {
                              excludeExtraneousValues: true,
                          })
                      )
                    : data;

                const responseBody = {
                    statusCode,
                    message: messagePath,
                    messageProperties,
                    data: serializedData,
                    metadata: {
                        page: metadata?.page ?? 1,
                        perPage: metadata?.perPage ?? 10,
                        total: metadata?.total ?? 0,
                        totalPage: Math.ceil(
                            (metadata?.total ?? 0) / (metadata?.perPage ?? 10)
                        ),
                    },
                };

                return responseBody;
            })
        );
    }
}

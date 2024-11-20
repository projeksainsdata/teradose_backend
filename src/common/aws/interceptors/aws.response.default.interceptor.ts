// interceptors/response.default.interceptor.ts
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
export class ResponseDefaultInterceptor<T> implements NestInterceptor<T> {
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

                const responseBody = {
                    statusCode,
                    message: messagePath,
                    messageProperties,
                    data: serializationClass
                        ? plainToInstance(serializationClass, responseData, {
                              excludeExtraneousValues: true,
                          })
                        : responseData,
                };

                return responseBody;
            })
        );
    }
}

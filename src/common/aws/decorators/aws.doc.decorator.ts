// doc/doc.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiConsumes,
    ApiSecurity,
    ApiHeader,
} from '@nestjs/swagger';
import { IDocOptions } from '../interfaces/aws.doc.interface';

export function Doc<T>(
    summary: string,
    options?: IDocOptions<T>
): MethodDecorator {
    const decorators = [ApiOperation({ summary })];

    // Handle request configuration
    if (options?.request) {
        if (options.request.bodyType === 'form-data') {
            decorators.push(ApiConsumes('multipart/form-data'));
        }

        if (options.request.file) {
            decorators.push(
                ApiBody({
                    required: options.request.file.required,
                    type: 'multipart/form-data',
                })
            );
        }
    }

    // Handle response configuration
    if (options?.response) {
        decorators.push(
            ApiResponse({
                status: options.response.httpStatus || 200,
            })
        );
    }

    // Handle authentication
    if (options?.auth) {
        if (options.auth.jwtAccessToken) {
            decorators.push(ApiSecurity('bearer'));
        }
    }

    // Handle headers
    if (options?.requestHeader) {
        if (options.requestHeader.userAgent) {
            decorators.push(
                ApiHeader({
                    name: 'user-agent',
                    required: true,
                })
            );
        }
    }

    return applyDecorators(...decorators);
}

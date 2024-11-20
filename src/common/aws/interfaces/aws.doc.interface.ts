// doc/interfaces/doc.interface.ts
import { HttpStatus } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export interface IDocOptions<T> {
    request?: {
        bodyType?: 'json' | 'form-data' | 'text';
        params?: Record<string, any>;
        queries?: Record<string, any>;
        file?: {
            required?: boolean;
        };
    };
    response?: {
        httpStatus?: HttpStatus;
        statusCode?: number;
        serialization?: ClassConstructor<T>;
        bodyType?: 'json' | 'file' | 'text';
    };
    auth?: {
        jwtAccessToken?: boolean;
        jwtRefreshToken?: boolean;
    };
    requestHeader?: {
        userAgent?: boolean;
        timestamp?: boolean;
    };
}

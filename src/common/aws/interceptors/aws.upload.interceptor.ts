// interceptors/aws.file.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MAX_FILE_SIZE } from '../constants/aws.s3.constant';

@Injectable()
export class AwsFileInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const file = request.file;

        if (file && file.size > MAX_FILE_SIZE) {
            throw new BadRequestException(
                `File size cannot exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`
            );
        }

        return next.handle();
    }
}

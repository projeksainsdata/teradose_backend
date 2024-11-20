// guards/aws.file.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { ALLOWED_MIME_TYPES } from '../constants/aws.s3.constant';

@Injectable()
export class AwsFileGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const file = request.file;

        if (!file) {
            throw new BadRequestException('File is required');
        }

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
            );
        }

        return true;
    }
}

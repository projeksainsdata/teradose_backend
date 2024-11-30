// aws.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class S3FileNotFoundException extends HttpException {
    constructor(filename: string) {
        super(`File ${filename} not found in S3 bucket`, HttpStatus.NOT_FOUND);
    }
}

export class S3OperationException extends HttpException {
    constructor(message: string) {
        super(
            `S3 operation failed: ${message}`,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}

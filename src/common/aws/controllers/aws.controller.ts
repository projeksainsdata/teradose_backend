// aws.controller.ts
import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    UseInterceptors,
    UploadedFile,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { AwsS3Service } from '../services/aws.s3.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { AwsS3UploadDoc } from '../doc/aws.doc';
import { Response } from 'src/common/response/decorators/response.decorator';
import { AwsS3Serialization } from '../serializations/aws.s3.serialization';
import {
    S3FileNotFoundException,
    S3OperationException,
} from '../exceptions/aws.exception';

@ApiTags('AWS S3')
@Controller('aws/s3')
export class AwsS3Controller {
    constructor(private readonly awsS3Service: AwsS3Service) {}

    @Post('upload')
    @AwsS3UploadDoc()
    @UseInterceptors(FileInterceptor('file'))
    @Response('aws.upload', {
        serialization: AwsS3Serialization,
    })
    async uploadFile(
        @UploadedFile() file: Multer.File,
        @Body() body: { path?: string }
    ) {
        try {
            const data = await this.awsS3Service.putItemInBucket(
                file.originalname,
                file.buffer,
                { path: body.path }
            );
            return {
                data,
                message: 'File uploaded successfully',
            };
        } catch (err) {
            if (err.$metadata?.httpStatusCode === 403) {
                throw new S3OperationException('Permission denied');
            }

            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }
    }
}

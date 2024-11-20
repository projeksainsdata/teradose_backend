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

@ApiTags('AWS S3')
@Controller('aws/s3')
export class AwsS3Controller {
    constructor(private readonly awsS3Service: AwsS3Service) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload single file to AWS S3' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                path: {
                    type: 'string',
                    description: 'Optional path in bucket',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'File uploaded successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Multer.File,
        @Body() body: { path?: string }
    ) {
        try {
            return this.awsS3Service.putItemInBucket(
                file.originalname,
                file.buffer,
                { path: body.path }
            );
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }
    }

    @Post('multipart/init')
    @ApiOperation({ summary: 'Initialize multipart upload' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                filename: { type: 'string' },
                path: { type: 'string' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Multipart upload initialized',
    })
    async initializeMultipartUpload(
        @Body() body: { filename: string; path?: string }
    ) {
        return this.awsS3Service.createMultiPart(body.filename, {
            path: body.path,
        });
    }

    @Post('multipart/upload-part')
    @ApiOperation({ summary: 'Upload part for multipart upload' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                path: { type: 'string' },
                uploadId: { type: 'string' },
                partNumber: { type: 'number' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Part uploaded successfully',
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadPart(
        @UploadedFile() file: Multer.File,
        @Body() body: { path: string; uploadId: string; partNumber: number }
    ) {
        return this.awsS3Service.uploadPart(
            body.path,
            file.buffer,
            body.uploadId,
            body.partNumber
        );
    }

    @Post('multipart/complete')
    @ApiOperation({ summary: 'Complete multipart upload' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                uploadId: { type: 'string' },
                parts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            ETag: { type: 'string' },
                            PartNumber: { type: 'number' },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Multipart upload completed' })
    async completeMultipartUpload(
        @Body()
        body: {
            path: string;
            uploadId: string;
            parts: { ETag: string; PartNumber: number }[];
        }
    ) {
        return this.awsS3Service.completeMultipart(
            body.path,
            body.uploadId,
            body.parts
        );
    }

    @Delete('multipart/abort/:uploadId')
    @ApiOperation({ summary: 'Abort multipart upload' })
    @ApiParam({ name: 'uploadId', type: 'string' })
    @ApiResponse({ status: 200, description: 'Multipart upload aborted' })
    async abortMultipartUpload(
        @Param('uploadId') uploadId: string,
        @Body() body: { path: string }
    ) {
        return this.awsS3Service.abortMultipart(body.path, uploadId);
    }

    @Get('files')
    @ApiOperation({ summary: 'List files in bucket' })
    @ApiResponse({
        status: 200,
        description: 'List of files',
    })
    async listFiles(@Body() body: { prefix?: string }) {
        return this.awsS3Service.listItemInBucket(body.prefix);
    }

    @Delete('files/:filename')
    @ApiOperation({ summary: 'Delete file from bucket' })
    @ApiParam({ name: 'filename', type: 'string' })
    @ApiResponse({ status: 200, description: 'File deleted successfully' })
    async deleteFile(@Param('filename') filename: string) {
        return this.awsS3Service.deleteItemInBucket(filename);
    }
}

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
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AwsS3Service } from '../services/aws.s3.service';
import { AwsFileGuard } from '../guards/aws.upload.guard';
import { AwsFileInterceptor } from '../interceptors/aws.upload.interceptor';
import { Response } from '../decorators/aws.response.decorator';
import { Doc } from '../decorators/aws.doc.decorator';
import { ApiFile } from '../decorators/aws.decorator';
import {
    AwsUploadDto,
    AwsMultipartInitDto,
    AwsMultipartUploadDto,
    AwsMultipartCompleteDto,
} from '../dtos/aws.upload.dto';
import { AwsS3Serialization } from '../serializations/aws.s3.serialization';
import { AwsS3MultipartSerialization } from '../serializations/aws.s3-multipart.serialization';
import { Multer } from 'multer';

@ApiTags('AWS S3')
@Controller('aws/s3')
export class AwsS3Controller {
    constructor(private readonly awsS3Service: AwsS3Service) {}

    @Post('upload')
    @ApiFile('Upload single file to AWS S3')
    @Response('aws.upload.success', {
        serialization: AwsS3Serialization,
    })
    @UseGuards(AwsFileGuard)
    @UseInterceptors(FileInterceptor('file'), AwsFileInterceptor)
    @Doc('aws.upload', {
        request: {
            bodyType: 'form-data',
        },
        response: {
            serialization: AwsS3Serialization,
        },
    })
    async uploadFile(
        @UploadedFile() file: Multer.File,
        @Body() dto: AwsUploadDto
    ): Promise<AwsS3Serialization> {
        return this.awsS3Service.putItemInBucket(
            file.originalname,
            file.buffer,
            { path: dto.path }
        );
    }

    @Post('multipart/init')
    @Response('aws.multipart.init.success', {
        serialization: AwsS3MultipartSerialization,
    })
    @Doc('aws.multipart.init', {
        response: {
            serialization: AwsS3MultipartSerialization,
        },
    })
    async initializeMultipartUpload(
        @Body() dto: AwsMultipartInitDto
    ): Promise<AwsS3MultipartSerialization> {
        return this.awsS3Service.createMultiPart(dto.filename, {
            path: dto.path,
        });
    }

    @Post('multipart/upload-part')
    @ApiFile('Upload part for multipart upload')
    @Response('aws.multipart.upload.success')
    @UseGuards(AwsFileGuard)
    @UseInterceptors(FileInterceptor('file'), AwsFileInterceptor)
    @Doc('aws.multipart.upload', {
        request: {
            bodyType: 'form-data',
            file: {
                required: true,
            },
        },
    })
    async uploadPart(
        @UploadedFile() file: Multer.File,
        @Body() dto: AwsMultipartUploadDto
    ) {
        return this.awsS3Service.uploadPart(
            dto.path,
            file.buffer,
            dto.uploadId,
            dto.partNumber
        );
    }

    @Post('multipart/complete')
    @Response('aws.multipart.complete.success')
    @Doc('aws.multipart.complete')
    async completeMultipartUpload(@Body() dto: AwsMultipartCompleteDto) {
        return this.awsS3Service.completeMultipart(
            dto.path,
            dto.uploadId,
            dto.parts
        );
    }

    @Delete('multipart/abort/:uploadId')
    @Response('aws.multipart.abort.success')
    @Doc('aws.multipart.abort', {
        request: {
            params: {
                uploadId: {
                    required: true,
                    type: 'string',
                },
            },
        },
    })
    async abortMultipartUpload(
        @Param('uploadId') uploadId: string,
        @Body('path') path: string
    ) {
        return this.awsS3Service.abortMultipart(path, uploadId);
    }

    @Get('files')
    @Response('aws.files.list.success', {
        serialization: AwsS3Serialization,
    })
    @Doc('aws.files.list', {
        response: {
            serialization: AwsS3Serialization,
        },
    })
    async listFiles(@Body('prefix') prefix?: string) {
        return this.awsS3Service.listItemInBucket(prefix);
    }

    @Delete('files/:filename')
    @Response('aws.files.delete.success')
    @Doc('aws.files.delete', {
        request: {
            params: {
                filename: {
                    required: true,
                    type: 'string',
                },
            },
        },
    })
    async deleteFile(@Param('filename') filename: string) {
        return this.awsS3Service.deleteItemInBucket(filename);
    }
}

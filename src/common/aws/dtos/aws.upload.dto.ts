// dtos/aws.upload.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Multer } from 'multer';
import {
    IsNotEmpty,
    IsNumber,
    IsArray,
    ValidateNested,
    Min,
    IsOptional,
    IsString,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AwsS3MaxPartNumber } from '../constants/aws.s3.constant';

export class AwsUploadDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: true,
    })
    file: Multer.File;

    @ApiProperty({
        type: 'string',
        required: false,
        description: 'Optional path in bucket',
    })
    @IsOptional()
    @IsString()
    path?: string;
}

export class AwsMultipartInitDto {
    @ApiProperty({
        example: 'example.jpg',
        description: 'Name of the file to upload',
    })
    @IsString()
    @IsNotEmpty()
    filename: string;

    @ApiProperty({
        example: 'uploads/images',
        description: 'Optional path in bucket',
        required: false,
    })
    @IsString()
    path?: string;
}

export class AwsMultipartUploadDto {
    @ApiProperty({
        example: 'uploads/images/example.jpg',
        description: 'Full path of the file in bucket',
    })
    @IsString()
    @IsNotEmpty()
    path: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Upload ID from init multipart response',
    })
    @IsString()
    @IsNotEmpty()
    uploadId: string;

    @ApiProperty({
        example: 1,
        description: 'Part number (1-10000)',
        minimum: 1,
        maximum: AwsS3MaxPartNumber,
    })
    @IsNumber()
    @Min(1)
    @Max(AwsS3MaxPartNumber)
    partNumber: number;
}

export class AwsMultipartPartDto {
    @ApiProperty({
        example: '"a54357aff0632cce46d942af68356b38"',
        description: 'ETag from upload part response',
    })
    @IsString()
    @IsNotEmpty()
    ETag: string;

    @ApiProperty({
        example: 1,
        description: 'Part number',
    })
    @IsNumber()
    @Min(1)
    @Max(AwsS3MaxPartNumber)
    PartNumber: number;
}

export class AwsMultipartCompleteDto {
    @ApiProperty({
        example: 'uploads/images/example.jpg',
        description: 'Full path of the file in bucket',
    })
    @IsString()
    @IsNotEmpty()
    path: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Upload ID from init multipart response',
    })
    @IsString()
    @IsNotEmpty()
    uploadId: string;

    @ApiProperty({
        type: [AwsMultipartPartDto],
        description: 'Array of uploaded parts',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AwsMultipartPartDto)
    parts: AwsMultipartPartDto[];
}

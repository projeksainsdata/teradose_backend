import { ApiProperty } from "@nestjs/swagger";

// aws.serialization.ts
export class AwsS3Serialization {
    @ApiProperty({
        description: 'Base path in S3 bucket',
        example: 'uploads/images',
    })
    path: string;

    @ApiProperty({
        description: 'Full path including filename',
        example: 'uploads/images/example-123.png',
    })
    pathWithFilename: string;

    @ApiProperty({
        description: 'Original filename',
        example: 'example-123.png',
    })
    filename: string;

    @ApiProperty({
        description: 'Complete S3 URL',
        example:
            'https://bucket-name.s3.amazonaws.com/uploads/images/example-123.png',
    })
    completedUrl: string;

    @ApiProperty({
        description: 'S3 bucket base URL',
        example: 'https://bucket-name.s3.amazonaws.com',
    })
    baseUrl: string;

    @ApiProperty({
        description: 'File mime type',
        example: 'image/png',
    })
    mime: string;
}

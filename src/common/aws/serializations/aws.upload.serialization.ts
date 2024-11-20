// serializations/aws.upload.serialization.ts
import { ApiProperty } from '@nestjs/swagger';

export class AwsUploadSerialization {
    @ApiProperty()
    path: string;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    mimetype: string;

    @ApiProperty()
    size: number;

    @ApiProperty()
    url: string;
}

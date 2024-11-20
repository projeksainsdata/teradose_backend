// decorators/aws.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AwsUploadDto } from '../dtos/aws.upload.dto';

export function ApiFile(summary: string) {
    return applyDecorators(
        ApiOperation({ summary }),
        ApiConsumes('multipart/form-data'),
        ApiBody({
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
    );
}

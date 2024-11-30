// aws.doc.ts
import { applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import { AwsS3Serialization } from '../serializations/aws.s3.serialization';
import {
    AwsS3DocParamsGet,
    AwsS3DocQueryUpload,
} from '../constants/aws.doc.constant';

export function AwsS3UploadDoc(): MethodDecorator {
    return applyDecorators(
        Doc<AwsS3Serialization>('aws.upload', {
            request: {
                bodyType: ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA,
                file: {
                    multiple: false,
                },
                queries: AwsS3DocQueryUpload,
            },
            response: {
                serialization: AwsS3Serialization,
            },
        })
    );
}

export function AwsS3GetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<AwsS3Serialization>('aws.get', {
            request: {
                params: AwsS3DocParamsGet,
            },
            response: {
                serialization: AwsS3Serialization,
            },
        })
    );
}

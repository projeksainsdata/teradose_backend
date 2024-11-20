import { ObjectCannedACL } from '@aws-sdk/client-s3';

export interface IAwsS3PutItemOptions {
    path: string;
    acl?: ObjectCannedACL;
}
export interface IAwsUploadResponse {
    path: string;
    filename: string;
    mimetype: string;
    size: number;
    url: string;
}

export interface IAwsMultipartUpload {
    uploadId: string;
    key: string;
    parts: {
        ETag: string;
        PartNumber: number;
    }[];
}

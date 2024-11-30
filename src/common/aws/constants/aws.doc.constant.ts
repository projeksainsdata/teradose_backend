// aws.doc.constant.ts
export const AwsS3DocQueryUpload = [
    {
        name: 'path',
        required: false,
        type: 'string',
        example: 'uploads/images',
        description: 'Path in S3 bucket where file will be stored',
    },
];

export const AwsS3DocParamsGet = [
    {
        name: 'path',
        required: true,
        type: 'string',
        example: 'uploads/images/example-123.png',
        description: 'Full path of file in S3',
    },
];

import { ApiProperty } from '@nestjs/swagger';
import { ENUM_STATUS } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class BlogListSerialization {
    @ApiProperty({
        description: 'Blog ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    readonly id: string;

    @ApiProperty({
        description: 'Blog title',
        example: 'Introduction to TypeScript',
    })
    readonly title: string;

    @ApiProperty({
        description: 'Blog slug',
        example: 'introduction-to-typescript',
    })
    readonly slug: string;

    @ApiProperty({
        description: 'Blog status',
        example: ENUM_STATUS.PUBLISHED,
        enum: ENUM_STATUS,
    })
    readonly status: ENUM_STATUS;

    @ApiProperty({
        description: 'Created at',
        example: '2024-03-19T12:00:00Z',
    })
    @Type(() => Date)
    readonly createdAt: Date;

    @ApiProperty({
        description: 'Categories Payload',
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Programming',
        },
    })
    @IsOptional()
    @Type(() => Object)
    readonly categories: {
        id: string;
        name: string;
    };
}

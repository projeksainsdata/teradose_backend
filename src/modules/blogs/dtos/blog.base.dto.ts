// src/modules/Blog/dtos/repositories.base.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ENUM_BLOG_STATUS_LIST } from '../constants/blog.enum.constant';
import { ENUM_STATUS } from '@prisma/client';
import { faker } from '@faker-js/faker';

export class BlogBaseDto {
    @ApiProperty({
        description: 'Blog title',
        example: 'Paracetamol',
        required: true,
    })
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: 'Blog description',
        example: 'Pain relief medication',
        required: true,
    })
    @IsString()
    readonly description: string;

    @ApiProperty({
        description: 'Blog thumbnail',
        example: 'path/to/image.jpg',
        required: true,
    })
    @IsString()
    readonly thumbnail: string;

    @ApiProperty({
        description: 'Blog content',
        example: 'This is a blog content',
        required: true,
    })
    @IsString()
    readonly content: string;

    @ApiProperty({
        description: 'Blog status',
        example: Object.values(ENUM_BLOG_STATUS_LIST).join(','), // 'DRAFT,PUBLISHED,ARCHIVED'
        required: true,
        default: ENUM_STATUS.DRAFT,
    })
    @IsString()
    readonly status: ENUM_STATUS;

    @ApiProperty({
        description: 'Blog category',
        example: faker.string.uuid(),
        required: true,
    })
    @IsUUID()
    @IsString()
    readonly category: string;
}

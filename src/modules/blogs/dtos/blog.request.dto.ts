// src/modules/Blog/dtos/repositories.request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class BlogRequestIdDto {
    @ApiProperty({
        name: 'blogs',
        description: 'blog id to get blog',
        required: true,
        nullable: false,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    blogs: string;
}

export class BlogRequestSlugDto {
    @ApiProperty({
        name: 'slug',
        description: 'slug to get blog',
        required: true,
        nullable: false,
        example: 'slug-example',
    })
    @IsNotEmpty()
    @Type(() => String)
    slug: string;
}

export class BlogRequestCategoryDto {
    @ApiProperty({
        name: 'categoryId',
        description: 'categoryid to get blog',
        required: true,
        nullable: false,
        example: 'category-example',
    })
    @IsNotEmpty()
    @Type(() => String)
    categoryId: string;
}

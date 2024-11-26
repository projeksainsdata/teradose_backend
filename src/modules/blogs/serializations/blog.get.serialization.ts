import { ApiProperty } from '@nestjs/swagger';
import { ENUM_STATUS } from '@prisma/client';
import { Type } from 'class-transformer';
import { BlogListSerialization } from './blog.list.serialization';

export class BlogGetSerialization extends BlogListSerialization {
    @ApiProperty({
        description: 'Blog description',
        example: 'A detailed blog about programming',
    })
    readonly description: string;

    @ApiProperty({
        description: 'Blog content',
        example: 'This is the content of the blog...',
    })
    readonly content: string;

    @ApiProperty({
        description: 'Blog thumbnail URL',
        example: 'https://example.com/thumbnail.jpg',
    })
    readonly thumbnail: string;

    @ApiProperty({
        description: 'Blog status',
        example: ENUM_STATUS.PUBLISHED,
    })
    readonly status: ENUM_STATUS;

    @ApiProperty({
        description: 'Updated at',
        example: '2024-03-19T12:00:00Z',
    })
    @Type(() => Date)
    readonly updatedAt: Date;
}

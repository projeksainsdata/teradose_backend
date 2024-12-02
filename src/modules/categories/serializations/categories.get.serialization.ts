import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY_TYPE } from '../constants/categories.enum.constant';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { Blogs } from '@prisma/client';
import { BlogListSerialization } from 'src/modules/blogs/serializations/blog.list.serialization';
import { RepositoryListSerialization } from 'src/modules/repositories/serializations/repositories.list.serialization';
import { Type } from 'class-transformer';

export class CategoryGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Category name',
        example: faker.commerce.department(),
    })
    readonly name: string;

    @ApiProperty({
        example: faker.commerce.department(),
    })
    readonly description: string;

    @ApiProperty({
        example: faker.helpers.arrayElement(Object.values(CATEGORY_TYPE)),
    })
    readonly type: string;

    @ApiProperty({
        example: faker.helpers.slugify(faker.commerce.department()),
    })
    readonly slug: string;
}

export class CategoryGetDataSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Category name',
        example: faker.commerce.department(),
    })
    readonly name: string;

    @ApiProperty({
        example: faker.commerce.department(),
    })
    readonly description: string;

    @ApiProperty({
        example: faker.helpers.arrayElement(Object.values(CATEGORY_TYPE)),
    })
    readonly type: string;

    @ApiProperty({
        example: faker.helpers.slugify(faker.commerce.department()),
    })
    readonly slug: string;

    // join categories table
    @ApiProperty({
        description: 'Blog by categories',
        example: [
            {
                id: '123e4567-e89b-12d3-a456-426614174000',
                title: 'Introduction to TypeScript',
                slug: 'introduction-to-typescript',
                createdAt: '2024-03-19T12:00:00Z',
                user: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    fullName: 'John Doe',
                },
            },
        ],
    })
    @Type(() => BlogListSerialization)
    readonly blogs: BlogListSerialization[];

    // join users table
    @ApiProperty({
        description: 'Repositories by categories',
        example: [
            {
                id: '123e4567-e89b-12d3-a456-426614174000',
                title: 'Paracetamol',
                slug: 'paracetamol',
                createdAt: '2024-03-19T12:00:00Z',
            },
        ],
    })
    @Type(() => RepositoryListSerialization)
    readonly repositories: RepositoryListSerialization[];
}

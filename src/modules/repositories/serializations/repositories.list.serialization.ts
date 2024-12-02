// src/modules/repository/serializations/repositories.list.serialization.ts
import { ApiProperty } from '@nestjs/swagger';
import { ENUM_STATUS } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class RepositoryListSerialization {
    @ApiProperty({
        description: 'Repository ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    readonly id: string;

    @ApiProperty({
        description: 'Repository title',
        example: 'Paracetamol',
    })
    readonly title: string;

    @ApiProperty({
        description: 'Repository slug',
        example: 'paracetamol',
    })
    readonly slug: string;

    @ApiProperty({
        description: 'Repository status',
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
            name: 'Pain Relief',
        },
    })
    @IsOptional()
    @Type(() => Object)
    readonly categories: {
        id: string;
        name: string;
    };

    @ApiProperty({
        description: 'thumnail repositories',
        example: 'https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b',
    })
    @Type(() => String)
    readonly thumbnail: string;
}

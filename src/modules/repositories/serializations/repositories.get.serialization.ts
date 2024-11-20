// src/modules/repository/serializations/repositories.get.serialization.ts
import { ApiProperty } from '@nestjs/swagger';
import { ENUM_STATUS } from '@prisma/client';
import { Type } from 'class-transformer';
import { RepositoryListSerialization } from './repositories.list.serialization';

export class RepositoryGetSerialization extends RepositoryListSerialization {
    @ApiProperty({
        description: 'Repository description',
        example: 'Pain relief medication',
    })
    readonly description: string;

    @ApiProperty({
        description: 'Repository indication',
        example: 'For pain and fever relief',
    })
    readonly indication: string;

    @ApiProperty({
        description: 'Repository composition',
        example: 'Paracetamol 500mg',
    })
    readonly composition: string;

    @ApiProperty({
        description: 'Updated at',
        example: '2024-03-19T12:00:00Z',
    })
    @Type(() => Date)
    readonly updatedAt: Date;
}

// src/modules/repository/dtos/repositories.base.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RepositoryBaseDto {
    @ApiProperty({
        description: 'Repository title',
        example: 'Paracetamol',
        required: true,
    })
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: 'Category ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
    })
    @IsString()
    readonly category: string;

    @ApiProperty({
        description: 'Repository description',
        example: 'Pain relief medication',
        required: true,
    })
    @IsString()
    readonly description: string;

    @ApiProperty({
        description: 'Repository thumbnail',
        example: 'path/to/image.jpg',
        required: true,
    })
    @IsString()
    readonly thumbnail: string;
}

// src/modules/repository/dtos/repositories.request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RepositoryRequestDto {
    @ApiProperty({
        name: 'repository',
        description: 'Repository id',
        required: true,
        nullable: false,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    repositories: string;
}

export class RepositorySlugRequestDto {
    @ApiProperty({
        name: 'slug',
        description: 'Repository slug',
        required: true,
        nullable: false,
        example: 'repo-sitories',
    })
    @IsNotEmpty()
    @Type(() => String)
    slug: string;
}

// src/modules/Blog/dtos/repositories.request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class BlogRequestDto {
    @ApiProperty({
        name: 'Blog',
        description: 'Blog id',
        required: true,
        nullable: false,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    blog: string;
}

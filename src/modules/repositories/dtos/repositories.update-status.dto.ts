// src/modules/repository/dtos/repositories.update-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_STATUS } from '@prisma/client';

export class RepositoryUpdateStatusDto {
    @ApiProperty({
        description: 'Repository status',
        example: ENUM_STATUS.PUBLISHED,
        enum: ENUM_STATUS,
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(ENUM_STATUS)
    status: ENUM_STATUS;
}

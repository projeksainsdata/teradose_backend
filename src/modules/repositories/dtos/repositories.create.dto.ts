// src/modules/repository/dtos/repositories.create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { RepositoryBaseDto } from './repositories.base.dto';

export class RepositoryCreateDto extends RepositoryBaseDto {
    @ApiProperty({
        description: 'Indication',
        example: 'For pain and fever relief',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly indication?: string;

    @ApiProperty({
        description: 'Composition',
        example: 'Paracetamol 500mg',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly composition?: string;

    @ApiProperty({
        description: 'Dose information',
        example: '1-2 tablets every 4-6 hours',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly dose?: string;

    @ApiProperty({
        description: 'Usage guidelines',
        example: 'Take with water after meals',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly usage_guideline?: string;

    //slug is generated from title
    @ApiProperty({
        description: 'Repository slug',
        example: 'paracetamol',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    slug?: string;

    @ApiProperty({
        description: 'Attention information',
        example: 'Do not exceed recommended dose',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly attention?: string;

    @ApiProperty({
        description: 'Contraindication information',
        example: 'Not for children under 12 years',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly contraindication?: string;

    @ApiProperty({
        description: 'Side effect information',
        example: 'May cause drowsiness',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly side_effect?: string;

    @ApiProperty({
        description: 'Product categories',
        example: 'Pain relief',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly product_categories?: string;
}

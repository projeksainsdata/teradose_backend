import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CategoriesRequestDto {
    @ApiProperty({
        name: 'categories',
        description: 'categories id',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @Type(() => String)
    categories: string;
}

export class CategoriesSlugRequestDto {
    @ApiProperty({
        name: 'slug',
        description: 'slug',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @Type(() => String)
    slug: string;
}

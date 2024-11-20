import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    IsEnum,
} from 'class-validator';
import { ENUM_CATEGORY_TYPE } from '../constants/categories.enum.constant';

export class CategoriesCreateDto {
    @ApiProperty({
        example: faker.internet.displayName(),
        required: true,
        description: 'Name of category',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly name: string;

    @ApiProperty({
        example: faker.helpers.arrayElement([
            ENUM_CATEGORY_TYPE.BLOGS,
            ENUM_CATEGORY_TYPE.REPOSITORIES,
        ]),
        required: true,
        description: 'type of category (blog, repository)',
        enum: [ENUM_CATEGORY_TYPE.BLOGS, ENUM_CATEGORY_TYPE.BLOGS],
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(ENUM_CATEGORY_TYPE)
    @Type(() => String)
    readonly type: ENUM_CATEGORY_TYPE;

    @ApiProperty({
        example: faker.lorem.sentence(),
        required: false,
        description: 'Description of category',
    })
    @IsString()
    @Type(() => String)
    @IsOptional()
    readonly description: string;

    
}

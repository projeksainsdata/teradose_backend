import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { BlogCreateDto } from './blog.create.dto';
import { faker } from '@faker-js/faker';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class BlogUpdateDto extends PartialType(
    OmitType(BlogCreateDto, ['user_id', 'slug'] as const)
) {
    @ApiProperty({
        description: 'Blog category',
        example: faker.string.uuid(),
    })
    @IsUUID()
    @IsOptional()
    @IsString()
    readonly category?: string;
}

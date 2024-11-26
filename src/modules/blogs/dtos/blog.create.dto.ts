import { ApiProperty } from '@nestjs/swagger';
import { BlogBaseDto } from './blog.base.dto';
import { IsOptional, IsString } from 'class-validator';

export class BlogCreateDto extends BlogBaseDto {
    @ApiProperty({
        name: 'slug',
        description: 'Blog slug',
        required: false,
        nullable: false,
        example: 'paracetamol',
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        name: 'author',
        description: 'Blog auhtor',
        required: false,
        nullable: false,
    })
    user_id?: string;
}

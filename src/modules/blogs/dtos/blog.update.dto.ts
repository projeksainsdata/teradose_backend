import { PartialType, OmitType } from '@nestjs/swagger';
import { BlogCreateDto } from './blog.create.dto';

export class BlogUpdateDto extends PartialType(
    OmitType(BlogCreateDto, ['user_id', 'category', 'slug'] as const)
) {}

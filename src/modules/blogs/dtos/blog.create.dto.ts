import { BlogBaseDto } from './blog.base.dto';

export class BlogCreateDto extends BlogBaseDto {
    slug?: string;
    user_id?: string;
}

import { PickType } from '@nestjs/swagger';
import { CategoriesCreateDto } from './categories.create.dto';
import { Exclude } from 'class-transformer';

export class CategoriesUpdateDto extends PickType(CategoriesCreateDto, [
    'description',
    'type',
] as const) {
    @Exclude()
    name: string;

    @Exclude()
    slug: string;
}

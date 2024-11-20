import { categories } from '@prisma/client';

import { CategoriesCreateDto } from '../dtos/categories.create.dto';
import { CategoriesUpdateDto } from '../dtos/categories.update.dto';

export interface ICategoriesService {
    findAll(find?: Record<string, any>, options?: any): Promise<categories[]>;

    findOneById(id: string, options?: any): Promise<categories>;

    findOne(find: Record<string, any>, options?: any): Promise<categories>;

    getTotal(find?: Record<string, any>, options?: any): Promise<number>;

    create(
        { name, description, type }: CategoriesCreateDto,
        options?: any
    ): Promise<categories>;

    existByName(name: string, options?: any): Promise<boolean>;

    delete(id: string): Promise<categories>;

    update(
        id: string,
        data: CategoriesUpdateDto
    ): Promise<categories>;
}

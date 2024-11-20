import { Module } from '@nestjs/common';
import { CategoriesServices } from './services/categories.service';

@Module({
    controllers: [],
    providers: [CategoriesServices],
    exports: [CategoriesServices],
    imports: [],
})
export class CategoriesModule {}

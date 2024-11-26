import { Module } from '@nestjs/common';
import { BlogsService } from './services/blog.service';

@Module({
    controllers: [],
    providers: [BlogsService],
    exports: [BlogsService],
    imports: [],
})
export class BlogModule {}

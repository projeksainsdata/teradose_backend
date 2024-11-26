// src/modules/repository/interfaces/Blogs.service.interface.ts
import { Blogs, Prisma } from '@prisma/client';
import { BlogCreateDto } from '../dtos/blog.create.dto';
import { BlogUpdateDto } from '../dtos/blog.update.dto';

export interface IBlogsService {
    findAll(
        find?: Record<string, any>,
        options?: Prisma.BlogsFindManyArgs
    ): Promise<Blogs[]>;

    findOneById(
        id: string,
        options?: Prisma.BlogsFindUniqueArgs
    ): Promise<Blogs>;

    findOne(
        find: Record<string, any>,
        options?: Prisma.BlogsFindFirstArgs
    ): Promise<Blogs>;

    findOneBySlug(
        slug: string,
        options?: Prisma.BlogsFindFirstArgs
    ): Promise<Blogs>;

    getTotal(
        find?: Record<string, any>,
        options?: Prisma.BlogsCountArgs
    ): Promise<number>;

    exist(id: string, options?: Prisma.BlogsFindFirstArgs): Promise<boolean>;

    existBySlug(
        slug: string,
        options?: Prisma.BlogsFindFirstArgs
    ): Promise<boolean>;

    create(
        data: BlogCreateDto,
        options?: Prisma.BlogsCreateArgs
    ): Promise<Blogs>;

    update(id: string, data: BlogUpdateDto): Promise<Blogs>;

    delete(id: string): Promise<Blogs>;

    deleteMany(
        find: Record<string, any>,
        options?: Prisma.BlogsDeleteManyArgs
    ): Promise<boolean>;

    createMany(
        data: BlogCreateDto[],
        options?: Prisma.BlogsCreateManyArgs
    ): Promise<boolean>;

    updateStatus(id: string, status: string): Promise<Blogs>;
}

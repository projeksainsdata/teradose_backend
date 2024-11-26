// src/modules/repository/services/Blogs.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/databases/services/database.service';
import { Blogs, Prisma, ENUM_STATUS } from '@prisma/client';
import { IBlogsService } from '../interfaces/blog.service.interface';
import { BlogCreateDto } from '../dtos/blog.create.dto';
import { BlogUpdateDto } from '../dtos/blog.update.dto';

@Injectable()
export class BlogsService implements IBlogsService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(
        find?: Record<string, any>,
        options?: Prisma.BlogsFindManyArgs
    ): Promise<Blogs[]> {
        return this.prismaService.blogs.findMany({
            where: find,
            ...options,
        });
    }

    async findOneById(
        id: string,
        options?: Prisma.BlogsFindUniqueArgs
    ): Promise<Blogs> {
        return this.prismaService.blogs.findUnique({
            where: { id },
            ...options,
        });
    }

    async findOne(
        find: Record<string, any>,
        options?: Prisma.BlogsFindFirstArgs
    ): Promise<Blogs> {
        return this.prismaService.blogs.findFirst({
            where: find,
            ...options,
        });
    }

    async findOneBySlug(
        slug: string,
        options?: Prisma.BlogsFindFirstArgs
    ): Promise<Blogs> {
        return this.prismaService.blogs.findFirst({
            where: { slug },
            ...options,
        });
    }

    async getTotal(
        find?: Record<string, any>,
        options?: Prisma.BlogsCountArgs
    ): Promise<number> {
        return this.prismaService.blogs.count({
            where: find,
            ...options,
        });
    }

    async exist(
        id: string,
        options?: Prisma.BlogsFindFirstArgs
    ): Promise<boolean> {
        const repository = await this.prismaService.blogs.findFirst({
            where: { id },
            ...options,
        });
        return !!repository;
    }

    async existBytitle(
        title: string,
        options?: Prisma.BlogsFindFirstArgs
    ): Promise<boolean> {
        const repository = await this.prismaService.blogs.findFirst({
            where: { title },
            ...options,
        });
        return !!repository;
    }

    async existBySlug(
        slug: string,
        options?: Prisma.BlogsFindFirstArgs
    ): Promise<boolean> {
        const repository = await this.prismaService.blogs.findFirst({
            where: { slug },
            ...options,
        });
        return !!repository;
    }

    async create(
        data: BlogCreateDto,
        options?: Prisma.BlogsCreateArgs
    ): Promise<Blogs> {
        return this.prismaService.blogs.create({
            data,
            ...options,
        });
    }

    async update(id: string, data: BlogUpdateDto): Promise<Blogs> {
        return this.prismaService.blogs.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Blogs> {
        return this.prismaService.blogs.delete({
            where: { id },
        });
    }

    async deleteMany(
        find: Record<string, any>,
        options?: Prisma.BlogsDeleteManyArgs
    ): Promise<boolean> {
        const result = await this.prismaService.blogs.deleteMany({
            where: find,
            ...options,
        });
        return result.count > 0;
    }

    async createMany(
        data: BlogCreateDto[],
        options?: Prisma.BlogsCreateManyArgs
    ): Promise<boolean> {
        const result = await this.prismaService.blogs.createMany({
            data,
            ...options,
        });
        return result.count > 0;
    }

    async updateStatus(id: string, status: ENUM_STATUS): Promise<Blogs> {
        return this.prismaService.blogs.update({
            where: { id },
            data: { status },
        });
    }
}

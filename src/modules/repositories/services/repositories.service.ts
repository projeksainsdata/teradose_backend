// src/modules/repository/services/repositories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/databases/services/database.service';
import { Repositories, Prisma, ENUM_STATUS } from '@prisma/client';
import { IRepositoriesService } from '../interfaces/repository.service.interface';
import { RepositoryCreateDto } from '../dtos/repositories.create.dto';
import { RepositoryUpdateDto } from '../dtos/repositories.update.dto';

@Injectable()
export class RepositoriesService implements IRepositoriesService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(
        find?: Record<string, any>,
        options?: Prisma.RepositoriesFindManyArgs
    ): Promise<Repositories[]> {
        return this.prismaService.repositories.findMany({
            where: find,
            ...options,
        });
    }

    async findOneById(
        id: string,
        options?: Prisma.RepositoriesFindUniqueArgs
    ): Promise<Repositories> {
        return this.prismaService.repositories.findUnique({
            where: { id },
            ...options,
        });
    }

    async findOne(
        find: Record<string, any>,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<Repositories> {
        return this.prismaService.repositories.findFirst({
            where: find,
            ...options,
        });
    }

    async findOneBySlug(
        slug: string,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<Repositories> {
        return this.prismaService.repositories.findFirst({
            where: { slug },
            ...options,
        });
    }

    async getTotal(
        find?: Record<string, any>,
        options?: Prisma.RepositoriesCountArgs
    ): Promise<number> {
        return this.prismaService.repositories.count({
            where: find,
            ...options,
        });
    }

    async exist(
        id: string,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<boolean> {
        const repository = await this.prismaService.repositories.findFirst({
            where: { id },
            ...options,
        });
        return !!repository;
    }

    async existBytitle(
        title: string,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<boolean> {
        const repository = await this.prismaService.repositories.findFirst({
            where: { title },
            ...options,
        });
        return !!repository;
    }

    async existBySlug(
        slug: string,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<boolean> {
        const repository = await this.prismaService.repositories.findFirst({
            where: { slug },
            ...options,
        });
        return !!repository;
    }

    async create(
        data: RepositoryCreateDto,
        options?: Prisma.RepositoriesCreateArgs
    ): Promise<Repositories> {
        return this.prismaService.repositories.create({
            data,
            ...options,
        });
    }

    async update(id: string, data: RepositoryUpdateDto): Promise<Repositories> {
        return this.prismaService.repositories.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Repositories> {
        return this.prismaService.repositories.delete({
            where: { id },
        });
    }

    async deleteMany(
        find: Record<string, any>,
        options?: Prisma.RepositoriesDeleteManyArgs
    ): Promise<boolean> {
        const result = await this.prismaService.repositories.deleteMany({
            where: find,
            ...options,
        });
        return result.count > 0;
    }

    async createMany(
        data: RepositoryCreateDto[],
        options?: Prisma.RepositoriesCreateManyArgs
    ): Promise<boolean> {
        const result = await this.prismaService.repositories.createMany({
            data,
            ...options,
        });
        return result.count > 0;
    }

    async updateStatus(id: string, status: ENUM_STATUS): Promise<Repositories> {
        return this.prismaService.repositories.update({
            where: { id },
            data: { status },
        });
    }
}

import { PrismaService } from 'src/common/databases/services/database.service';
import { ICategoriesService } from '../interfaces/categories.service.interface';
import { categories } from '@prisma/client';
import { CategoriesCreateDto } from 'src/modules/categories/dtos/categories.create.dto';
import { CategoriesUpdateDto } from 'src/modules/categories/dtos/categories.update.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesServices implements ICategoriesService {
    constructor(private readonly prismaServices: PrismaService) {}

    async create(data: any, options?: any): Promise<categories> {
        return this.prismaServices.categories.create({
            data,
            ...options,
        });
    }

    async delete(id: string): Promise<categories> {
        return this.prismaServices.categories.delete({
            where: { id },
        });
    }

    async existByName(name: string, options?: any): Promise<boolean> {
        const check = await this.prismaServices.categories.findFirst({
            where: { name },
            ...options,
        });

        return !!check;
    }
    async existById(id: string, options?: any): Promise<boolean> {
        const check = await this.prismaServices.categories.findFirst({
            where: { id },
            ...options,
        });

        return !!check;
    }
    async findAll(
        find?: Record<string, any>,
        options?: any
    ): Promise<categories[]> {
        return this.prismaServices.categories.findMany({
            where: find,
            ...options,
        });
    }

    async findOne(
        find: Record<string, any>,
        options?: any
    ): Promise<categories> {
        return this.prismaServices.categories.findFirst({
            where: find,
            ...options,
        });
    }

    async findOneById(id: string, options?: any): Promise<categories> {
        return this.prismaServices.categories.findUnique({
            where: { id },
            ...options,
        });
    }

    async getTotal(find?: Record<string, any>, options?: any): Promise<number> {
        return this.prismaServices.categories.count({
            where: find,
            ...options,
        });
    }

    async update(
        id: string,
        { name, description, type }: CategoriesUpdateDto
    ): Promise<categories> {
        return this.prismaServices.categories.update({
            where: { id },
            data: {
                name,
                description,
                type: {
                    set: type,
                },
            },
        });
    }
}

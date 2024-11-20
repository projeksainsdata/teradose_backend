// src/modules/repository/interfaces/repositories.service.interface.ts
import { Repositories, Prisma } from '@prisma/client';
import { RepositoryCreateDto } from '../dtos/repositories.create.dto';
import { RepositoryUpdateDto } from '../dtos/repositories.update.dto';

export interface IRepositoriesService {
    findAll(
        find?: Record<string, any>,
        options?: Prisma.RepositoriesFindManyArgs
    ): Promise<Repositories[]>;

    findOneById(
        id: string,
        options?: Prisma.RepositoriesFindUniqueArgs
    ): Promise<Repositories>;

    findOne(
        find: Record<string, any>,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<Repositories>;

    findOneBySlug(
        slug: string,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<Repositories>;

    getTotal(
        find?: Record<string, any>,
        options?: Prisma.RepositoriesCountArgs
    ): Promise<number>;

    exist(
        id: string,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<boolean>;

    existBySlug(
        slug: string,
        options?: Prisma.RepositoriesFindFirstArgs
    ): Promise<boolean>;

    create(
        data: RepositoryCreateDto,
        options?: Prisma.RepositoriesCreateArgs
    ): Promise<Repositories>;

    update(id: string, data: RepositoryUpdateDto): Promise<Repositories>;

    delete(id: string): Promise<Repositories>;

    deleteMany(
        find: Record<string, any>,
        options?: Prisma.RepositoriesDeleteManyArgs
    ): Promise<boolean>;

    createMany(
        data: RepositoryCreateDto[],
        options?: Prisma.RepositoriesCreateManyArgs
    ): Promise<boolean>;

    updateStatus(id: string, status: string): Promise<Repositories>;

    
}

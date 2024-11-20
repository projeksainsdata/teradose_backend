// src/modules/repository/guards/repository.put-to-request.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Repositories } from '@prisma/client';
import { RepositoriesService } from '../services/repositories.service';

@Injectable()
export class RepositoryPutToRequestGuard implements CanActivate {
    constructor(private readonly repositoryService: RepositoriesService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { repositories } = params;

        const check: Repositories =
            await this.repositoryService.findOneById(repositories);
        request.__repositories = check;

        return true;
    }
}

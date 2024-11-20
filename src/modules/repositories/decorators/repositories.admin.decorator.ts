// src/modules/repository/decorators/repository.admin.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { REPOSITORIES_ACTIVE_META_KEY } from '../constants/repositories.constant';
import { RepositoryPutToRequestGuard } from '../guards/repositories.put-to-request.guard';
import { RepositoryNotFoundGuard } from '../guards/repositories.not-found.guard';
import { RepositoryStatusGuard } from '../guards/repositories.status.guard';

export function RepositoryGetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RepositoryPutToRequestGuard, RepositoryNotFoundGuard)
    );
}

export function RepositoryUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            RepositoryPutToRequestGuard,
            RepositoryNotFoundGuard,
            RepositoryStatusGuard
        ),
        SetMetadata(REPOSITORIES_ACTIVE_META_KEY, ['DRAFT'])
    );
}

export function RepositoryDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            RepositoryPutToRequestGuard,
            RepositoryNotFoundGuard,
            RepositoryStatusGuard
        ),
        SetMetadata(REPOSITORIES_ACTIVE_META_KEY, ['DRAFT'])
    );
}

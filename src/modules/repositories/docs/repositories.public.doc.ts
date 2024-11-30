// src/modules/repository/docs/repositories.public.doc.ts
import { applyDecorators } from '@nestjs/common';
import { Doc, DocPaging } from 'src/common/doc/decorators/doc.decorator';
import {
    RepostoriesDocParamsGet,
    RepositoryDocQueryCategoryName,
    RepostoriesDocQueryStatus,
    RepositoryDocQueryCategory,
} from '../constants/repositories.doc.constant';
import { RepositoryListSerialization } from '../serializations/repositories.list.serialization';
import { RepositoryGetSerialization } from '../serializations/repositories.get.serialization';

export function RepositoryPublicListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<RepositoryListSerialization>('repository.public.list', {
            request: {
                queries: [
                    ...RepositoryDocQueryCategoryName,
                ],
            },
            response: {
                serialization: RepositoryListSerialization,
            },
        })
    );
}

export function RepositoryPublicGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<RepositoryGetSerialization>('repository.public.get', {
            request: {
                params: RepostoriesDocParamsGet,
            },
            response: {
                serialization: RepositoryGetSerialization,
            },
        })
    );
}

export function RepositoryPublicCategoryDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<RepositoryListSerialization>('repository.public.category', {
            request: {
                params: RepositoryDocQueryCategory,
                queries: [
                    ...RepostoriesDocQueryStatus,
                    ...RepositoryDocQueryCategoryName,
                ],
            },
            response: {
                serialization: RepositoryListSerialization,
            },
        })
    );
}

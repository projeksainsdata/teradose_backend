// src/modules/repository/docs/repository.admin.doc.ts
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { Doc, DocPaging } from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import {
    RepositoryDocQueryCategoryName,
    RepostoriesDocParamsGet,
    RepostoriesDocParamsSlug,
    RepostoriesDocQueryStatus,
} from '../constants/repositories.doc.constant';
import { RepositoryListSerialization } from '../serializations/repositories.list.serialization';
import { RepositoryGetSerialization } from '../serializations/repositories.get.serialization';

export function RepositoryListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<RepositoryListSerialization>('repository.list', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
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

export function RepositoryGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<RepositoryGetSerialization>('repository.get', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: RepostoriesDocParamsGet,
            },
            response: { serialization: RepositoryGetSerialization },
        })
    );
}

export function RepositoryCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('repository.create', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            response: {
                serialization: ResponseIdSerialization,
            },
        })
    );
}

export function RepositoryUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('repository.update', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: RepostoriesDocParamsGet,
            },
            response: { serialization: ResponseIdSerialization },
        })
    );
}

export function RepositoryDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('repository.delete', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: RepostoriesDocParamsGet,
            },
        })
    );
}

export function RepositoryUpdateStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('repository.updateStatus', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: RepostoriesDocParamsGet,
            },
        })
    );
}

export function RepositoryUpdateSlugDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('repository.updateSlug', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: RepostoriesDocParamsSlug,
            },
        })
    );
}

export function RepositoryGetCategoryDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('repository.getCategory', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                queries: RepositoryDocQueryCategoryName,
            },
        })
    );
}

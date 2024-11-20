// src/common/pagination/pipes/pagination.join-search.pipe.ts
import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { PaginationService } from '../services/pagination.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { IPaginationJoinSearchOptions } from '../interfaces/pagination.interface';

export function PaginationJoinSearchPipe(
    options: IPaginationJoinSearchOptions[]
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationJoinSearchPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(
            value: Record<string, any>
        ): Promise<Record<string, any>> {
            const searches: Record<string, any> = {};

            // Process each join search option
            for (const opt of options) {
                const searchValue = value?.[opt.searchField];

                if (searchValue) {
                    // Build Prisma where clause for join
                    searches[opt.table] = {
                        [opt.field]: {
                            contains: searchValue,
                        },
                    };

                    // Store search params in request
                    this.request.__pagination = {
                        ...this.request.__pagination,
                        [`${opt.table}Search`]: {
                            field: opt.field,
                            value: searchValue,
                        },
                    };
                }
            }

            return {
                ...value,
                _joins: searches,
            };
        }
    }

    return mixin(MixinPaginationJoinSearchPipe);
}

import { Inject, Injectable } from '@nestjs/common';
import {
    ArgumentMetadata,
    PipeTransform,
    Scope,
} from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

@Injectable({ scope: Scope.REQUEST })
export class PaginationFilterEqualBooleanPipe implements PipeTransform {
    constructor(
        @Inject(REQUEST) protected readonly request: IRequestApp,
        private readonly paginationService: PaginationService
    ) {}

    async transform(
        value: string,
        { data: field }: ArgumentMetadata
    ): Promise<Record<string, boolean>> {
        if (!value) {
            return undefined;
        }

        const finalValue = value === 'true';

        this.request.__filters = {
            ...this.request.__filters,
            [field]: finalValue,
        };

        return this.paginationService.filterEqual<boolean>(field, finalValue);
    }
}

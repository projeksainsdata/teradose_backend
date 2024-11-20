// src/modules/repository/decorators/repository.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Repositories } from '@prisma/client';

export const GetRepository = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): Repositories => {
        const { __repositories } = ctx.switchToHttp().getRequest();
        return returnPlain ? __repositories.toObject() : __repositories;
    }
);

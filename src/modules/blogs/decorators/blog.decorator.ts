// src/modules/repository/decorators/repository.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Repositories } from '@prisma/client';

export const GetBlog = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): Repositories => {
        const { __blog } = ctx.switchToHttp().getRequest();
        return returnPlain ? __blog.toObject() : __blog;
    }
);

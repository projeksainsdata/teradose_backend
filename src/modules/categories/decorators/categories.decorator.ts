import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { categories } from '@prisma/client';

export const GetCategories = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): categories => {
        const { __categories } = ctx.switchToHttp().getRequest();
        return returnPlain ? __categories.toObject() : __categories;
    }
);

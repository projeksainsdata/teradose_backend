// src/modules/repository/guards/repository.put-to-request.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Blogs } from '@prisma/client';
import { BlogsService } from '../services/blog.service';

@Injectable()
export class BlogPutToRequestGuard implements CanActivate {
    constructor(private readonly blogService: BlogsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { blogs } = params;

        const check: Blogs = await this.blogService.findOneById(blogs);
        request.__blog = check;

        return true;
    }
}

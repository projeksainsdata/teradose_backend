import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { GenerateUUID } from 'src/common/databases/constants/database.function.constant';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    async use(
        req: IRequestApp,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const uuid: string = GenerateUUID();
        req.__id = uuid;
        next();
    }
}

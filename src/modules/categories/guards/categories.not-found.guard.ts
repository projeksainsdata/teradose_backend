import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { ENUM_CATEGORIES_STATUS_CODE_ERROR } from 'src/modules/categories/constants/categoties.status-code.constant';

@Injectable()
export class CategoriesNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __categories } = context.switchToHttp().getRequest();

        if (!__categories) {
            throw new NotFoundException({
                statusCode:
                    ENUM_CATEGORIES_STATUS_CODE_ERROR.CATEGORIES_NOT_FOUND_ERROR,
                message: 'categories.error.notFound',
            });
        }

        return true;
    }
}

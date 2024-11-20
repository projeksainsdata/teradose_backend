import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { CategoriesPublicController } from 'src/modules/categories/controllers/categories.public.controller';
import { RepositoriesPublicController } from 'src/modules/repositories/controllers/repositories.public.controller';
import { RepositoriesModule } from 'src/modules/repositories/repositories.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserPublicController } from 'src/modules/user/controllers/user.public.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [
        UserPublicController,
        CategoriesPublicController,
        RepositoriesPublicController,
    ],
    providers: [],
    exports: [],
    imports: [
        UserModule,
        AuthModule,
        RoleModule,
        CategoriesModule,
        RepositoriesModule,
    ],
})
export class RoutesPublicModule {}

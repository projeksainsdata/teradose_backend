import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { SettingAdminController } from 'src/common/setting/controllers/setting.admin.controller';
import { SettingModule } from 'src/common/setting/setting.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { CategoriesAdminController } from 'src/modules/categories/controllers/categories.admin.controller';
import { PermissionAdminController } from 'src/modules/permission/controllers/permission.admin.controller';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { RoleAdminController } from 'src/modules/role/controllers/role.admin.controller';
import { RoleModule } from 'src/modules/role/role.module';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [
        SettingAdminController,
        PermissionAdminController,
        RoleAdminController,
        UserAdminController,
        CategoriesAdminController,
    ],
    providers: [],
    exports: [],
    imports: [
        AuthModule,
        PermissionModule,
        RoleModule,
        UserModule,
        SettingModule,
        CategoriesModule,
    ],
})
export class RoutesAdminModule {}

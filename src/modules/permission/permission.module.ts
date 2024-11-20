import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';

@Module({
    controllers: [],
    providers: [PermissionService],
    exports: [PermissionService],
    imports: [],
})
export class PermissionModule {}

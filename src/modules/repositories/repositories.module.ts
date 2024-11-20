import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { RepositoriesService } from './services/repositories.service';

@Module({
    imports: [AuthModule],
    controllers: [],
    providers: [RepositoriesService],
    exports: [RepositoriesService],
})
export class RepositoriesModule {}

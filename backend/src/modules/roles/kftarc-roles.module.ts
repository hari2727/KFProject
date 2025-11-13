import { Module } from '@nestjs/common';
import { KfTarcRolesController } from './kftarc-roles.controller';
import { KfTarcRolesService } from './kftarc-roles.service';

@Module({
    providers: [
        KfTarcRolesService,
    ],
    controllers: [
        KfTarcRolesController,
    ],
})
export class KfTarcRolesModule {}

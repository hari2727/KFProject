import { Module } from '@nestjs/common';
import { BmController } from './bm.controller';
import { BmService } from './bm.service';
import { BmMssqlService } from './bm-mssql.service';
import { ProfilesRepository, SubCategoryRepository } from './bm-mssql.repository';

@Module({
    providers: [
        BmService,
        BmMssqlService,
        ProfilesRepository,
        SubCategoryRepository,
    ],
    controllers: [
        BmController,
    ],
})
export class BulkMappingModule {}

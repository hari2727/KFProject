import { Module } from '@nestjs/common';
import { BulkMappingSkillsController } from './bms.controller';
import { BulkMappingSkillsService } from './bms.service';
import { BulkMappingSkillsDataService } from './bms-data.service';
import { BulkMappingSkillsDataMapper } from './bms-data.mapper';

@Module({
    providers: [
        BulkMappingSkillsService,
        BulkMappingSkillsDataService,
        BulkMappingSkillsDataMapper,
    ],
    controllers: [
        BulkMappingSkillsController,
    ],
})
export class BulkMappingSkillsModule {}

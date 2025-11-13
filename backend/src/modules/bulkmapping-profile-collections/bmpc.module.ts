import { Module } from '@nestjs/common';
import { BulkMappingProfileCollectionsService } from './bmpc.service';
import { BulkMappingProfileCollectionsDataService } from './bmpc-data-service';
import { BulkUpdateDataService } from '../../bulk-update/bulk-update-data-service';
import { BulkMappingProfileCollectionsController } from './bmpc.controller';
import { BulkUpdateDataMapper } from '../../bulk-update/bulk-update-data-mapper';
import { UserService } from '../../common/user/user.service';

@Module({
    providers: [
        UserService,
        BulkUpdateDataService,
        BulkUpdateDataMapper,
        BulkMappingProfileCollectionsDataService,
        BulkMappingProfileCollectionsService,
    ],
    controllers: [
        BulkMappingProfileCollectionsController,
    ],
})
export class BulkMappingProfileCollectionsModule {}

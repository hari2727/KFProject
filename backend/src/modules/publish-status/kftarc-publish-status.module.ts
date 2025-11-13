import { Module } from '@nestjs/common';
import { PublishStatusService } from './kftarc-publish-status.service';
import { PublishStatusRepository } from './kftarc-publish-status.repository';
import { KfTarcPublishStatusController } from './kftarc-publish-status.controller';

@Module({
    providers: [
        PublishStatusService,
        PublishStatusRepository,
    ],
    controllers: [
        KfTarcPublishStatusController,
    ],
})
export class KfTarcPublishStatusModule {}

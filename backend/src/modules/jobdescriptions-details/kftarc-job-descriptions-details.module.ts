import { Module } from '@nestjs/common';
import { KfTarcJobDescriptionsDetailsController } from './kftarc-job-descriptions-details.controller';
import { KfTarcJobDescriptionsDetailsService } from './kftarc-job-descriptions-details.service';

@Module({
    providers: [
        KfTarcJobDescriptionsDetailsService,
    ],
    controllers: [
        KfTarcJobDescriptionsDetailsController,
    ],
})
export class KfTarcJobDescriptionsDetailsModule {}

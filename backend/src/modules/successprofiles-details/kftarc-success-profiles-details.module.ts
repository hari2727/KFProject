import { Module } from '@nestjs/common';
import { KfTarcSuccessProfileDetailsController } from './kftarc-success-profiles-details.controller';
import { KfTarcSuccessProfilesDetailsService } from './kftarc-success-profiles-details.service';

@Module({
    controllers: [
        KfTarcSuccessProfileDetailsController,
    ],
    providers: [
        KfTarcSuccessProfilesDetailsService,
    ],
})
export class KfTarcSuccessProfilesDetailsModule {}

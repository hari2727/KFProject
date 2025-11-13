import { Module } from '@nestjs/common';
import { KfTarcProfilesForCompareController } from './kftarc-profiles-for-compare.controller';
import { KfTarcProfilesForCompareRepository } from './kftarc-profiles-for-compare.repository';
import { KfTarcProfilesForCompareService } from './kftarc-profiles-for-compare.service';

@Module({
    providers: [
        KfTarcProfilesForCompareService,
        KfTarcProfilesForCompareRepository,
    ],
    controllers: [
        KfTarcProfilesForCompareController,
    ],
})
export class KfTarcProfilesForCompareModule {}

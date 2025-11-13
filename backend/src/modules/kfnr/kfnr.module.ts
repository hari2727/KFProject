import { Module } from '@nestjs/common';
import {
    KfTarcSuccessProfilesDetailsService
} from '../successprofiles-details/kftarc-success-profiles-details.service';
import { KfnrController } from './kfnr.controller';
import { KfnrRepository } from './kfnr.repository';
import { KfnrService } from './kfnr.service';

@Module({
    providers: [
        KfnrService,
        KfnrRepository,
        KfTarcSuccessProfilesDetailsService,
    ],
    controllers: [
        KfnrController,
    ],
})
export class KfnrModule {}

import { Module } from '@nestjs/common/decorators';
import { KfTarcSpAndJdSearchController } from './kftarc-sp-and-jd-search.controller';
import { KfTarcSpAndJdSearchRepository } from './kftarc-sp-and-jd-search.repository';
import { KfTarcSpAndJdSearchService } from './kftarc-sp-and-jd-search.service';
import { HcmExportModule } from '../../custom-sp-export/custom-sp-export.module';

@Module({
    imports: [HcmExportModule],
    providers: [
        KfTarcSpAndJdSearchService,
        KfTarcSpAndJdSearchRepository,
    ],
    controllers: [
        KfTarcSpAndJdSearchController,
    ]
})
export class KfTarcSpAndJdModule {}

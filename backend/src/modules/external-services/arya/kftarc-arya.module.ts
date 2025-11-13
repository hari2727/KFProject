import { Module } from '@nestjs/common';
import { KfhubCountryRepository } from './country/kftarc-country.repository';
import { KfTarcExcludeKeysService } from './exclude-keys/kftarc-arya-exclude-keys.service';
import { KfTarcAryaController } from './kftarc-arya.controller';
import { KfTarcAryaService } from './kftarc-arya.service';
import { KfhubPeerGroupsRepository } from './peer-groups/kftarc-peer-groups.repository';
import { AryaClient } from './http-client/kftarc-arya-https-client.service';

@Module({
    providers: [
        KfTarcAryaService,
        KfTarcExcludeKeysService,
        AryaClient,
        KfhubPeerGroupsRepository,
        KfhubCountryRepository,
    ],
    controllers: [
        KfTarcAryaController,
    ],
})
export class KfTarcAryaModule {}

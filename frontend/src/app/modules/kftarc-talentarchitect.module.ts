import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KfAuthGuardService, KfCanDeactivateGuardService } from '@kf-products-core/kfhub_lib';
import {
    KfThclSpRolesLoaderService, KfThclSpRolesLoaderServiceToken,
} from '@kf-products-core/kfhub_thcl_lib';
import { TranslateModule } from '@ngx-translate/core';

import { KfTarcComponentsModule } from './components/kftarc.components.module';
import { KfTarcHomeSummaryResolver } from './services/kftarc-home-summary-resolver.service';
import { KfTarcSPDetailResolver } from './services/kftarc-sp-detail-resolver.service';
import { KfTarcTranslationResolver } from './services/kftarc-translation-resolver.service';
import { KfTarcSharedModule } from './shared/kftarc-shared.module';
import { KfTarcRoutesService } from './shared/services/kftarc-routes.service';
import { KfTarcSpLearnDevService } from './services/kftarc-sp-learn-dev.service';
import { KfTarcIGService } from './services/kftarc-sp-ig.service';
import { KfTarcMarketSkillsService } from './services/kftarc-market-skills.service';
import { SpDetailGuard } from './components/macro/success-profile/detail/kftarc-sp-detail.guard';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        KfTarcSharedModule,
        KfTarcComponentsModule,
    ],
    declarations: [],
    exports: [],
    providers: [
        KfTarcRoutesService,
        KfAuthGuardService,
        KfTarcSPDetailResolver,
        KfTarcHomeSummaryResolver,
        KfCanDeactivateGuardService,
        KfThclSpRolesLoaderService,
        { provide: KfThclSpRolesLoaderServiceToken, useClass: KfThclSpRolesLoaderService },
        KfTarcTranslationResolver,
        KfTarcSpLearnDevService,
        KfTarcIGService,
        KfTarcMarketSkillsService,
        SpDetailGuard,
    ]
})
export class KfTarcTalentArchitectModule { }

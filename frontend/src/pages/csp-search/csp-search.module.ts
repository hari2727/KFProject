import { TooltipModule } from 'primeng/tooltip';

import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { KfComponentsModule, KfSharedModule } from '@kf-products-core/kfhub_lib';
import {
    KfButtonModule, KfIconModule, KfProgressBarModule, KfTextModule, KfUploaderModule
} from '@kf-products-core/kfhub_lib/presentation';
import { KfThclComponentsModule, ThclPdfReportModelDownloadModule } from '@kf-products-core/kfhub_thcl_lib';
import {
    ExpansionModule, KfSortModule, KfTableModule, RadioModule, ThclDropdownModule
} from '@kf-products-core/kfhub_thcl_lib/presentation';
import { SearchInputModule } from '@kf-products-core/kfhub_thcl_lib/shared';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { httpLoaderFactory } from '../../app/language-factory';
import { KfTarcSpMatrixService } from '../../app/modules/services/kftarc-sp-matrix.service';
import { SpSearchEffects } from '../csp-search/csp-search-effects';
import { FEATURE_NAME, metaReducers, reducers } from '../csp-search/csp-search-state';
import { CspSearchPage } from '../csp-search/csp-search.page';
import { CspSearchResultComponent } from './custom-sp-search-result/csp-search-result.component';
import { CspSearchRoutingModule } from './csp-search-routing.module';
import { CSpSearchResolver } from '../csp-search/csp-search.resolver';
import { CspSearchFilterComponent } from './custom-sp-search-filter-result/csp-search-result-filter-component';
import { CspNestedDropdown } from './csp-nested-filter/csp-nested-filter';
import { PublishCenterComponent } from './publish-center/publish-center.component';

@NgModule({
    schemas: [],
    imports: [
        KfSharedModule, // TODO delete this import
        KfComponentsModule, // TODO delete this import
        KfThclComponentsModule, // TODO delete this import
        ThclPdfReportModelDownloadModule,

        ExpansionModule,

        CommonModule,
        CdkTableModule,
        KfIconModule,
        KfTextModule,
        KfButtonModule,
        SearchInputModule,
        KfTableModule,
        ThclDropdownModule,
        KfSortModule,
        // ThclSelectModule,
        // ThclOptionModule,
        KfUploaderModule,
        KfProgressBarModule,
        CspSearchRoutingModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            },
            // isolate: true
        }),
        StoreModule.forFeature(FEATURE_NAME, reducers, { metaReducers }),
        EffectsModule.forFeature([
            SpSearchEffects
        ]),
        TooltipModule,
        RadioModule,
    ],
    declarations: [
        CspSearchPage,
        CspSearchResultComponent,
        CspSearchFilterComponent,
        CspNestedDropdown,
        PublishCenterComponent,
    ],
    providers: [
        CSpSearchResolver,
        KfTarcSpMatrixService
    ]
})
export class CspSearchModule {
    constructor() { }
}


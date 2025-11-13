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
import { NestedDropdown } from './nested-filter/nested-filter';
import { SpMatrixPage } from './sp-matrix.page';
import {
    SpPublishToWorkdaysComponent
} from './sp-publish-to-workdays/sp-publish-to-workdays.component';
import { SpSearchFilterComponent } from './sp-search-filter/sp-search-filter.component';
import { SpSearchResultComponent } from './sp-search-result/sp-search-result.component';
import { SpSearchRoutingModule } from './sp-search-routing.module';
import { SpSearchEffects } from './sp-search.effects';
import { SpSearchPage } from './sp-search.page';
import { SpSearchResolver } from './sp-search.resolver';
import { FEATURE_NAME, metaReducers, reducers } from './sp-search.state';

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
        SpSearchRoutingModule,
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
        SpSearchPage,
        SpMatrixPage,
        SpSearchResultComponent,
        SpSearchFilterComponent,
        SpPublishToWorkdaysComponent,
        NestedDropdown
    ],
    providers: [
        SpSearchResolver,
        KfTarcSpMatrixService
    ]
})
export class SpSearchModule {
    constructor() { }
}

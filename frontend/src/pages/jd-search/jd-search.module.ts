import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KfComponentsModule, KfSharedModule } from '@kf-products-core/kfhub_lib';
import {
    KfButtonModule, KfIconModule, KfTextModule
} from '@kf-products-core/kfhub_lib/presentation';
import { KfThclComponentsModule } from '@kf-products-core/kfhub_thcl_lib';
import {
    KfSortModule, KfTableModule, ThclDropdownModule
} from '@kf-products-core/kfhub_thcl_lib/presentation';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { httpLoaderFactory } from '../../app/language-factory';

import { KfTarcComponentsModule } from '../../app/modules/components/kftarc.components.module';
import { JdSearchFilterComponent } from './jd-search-filter/jd-search-filter.component';
import { JdSearchFilterResolver } from './jd-search-filter/jd-search-filter.resolver';
import { JdSearchResultComponent } from './jd-search-result/jd-search-result.component';
import { JdSearchRoutingModule } from './jd-search-routing.module';
import { JdSearchEffects } from './jd-search.effects';
import { JdSearchPage } from './jd-search.page';
import { FEATURE_NAME, metaReducers, reducers } from './jd-search.state';

@NgModule({
    schemas: [],
    imports: [
        KfSharedModule, // TODO delete this import
        KfComponentsModule, // TODO delete this import
        KfThclComponentsModule, // TODO delete this import
        KfTarcComponentsModule, // TODO delete this import
        ReactiveFormsModule,
        CommonModule,
        CdkTableModule,
        KfIconModule,
        KfTextModule,
        KfButtonModule,
        KfTableModule,
        ThclDropdownModule,
        KfSortModule,
        JdSearchRoutingModule,
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
            JdSearchEffects
        ]),
        TooltipModule,
    ],
    declarations: [
        JdSearchPage,
        JdSearchResultComponent,
        JdSearchFilterComponent,
    ],
    providers: [
        JdSearchFilterResolver
    ]
})
export class JdSearchModule {
    constructor() { }
}

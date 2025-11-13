import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KfComponentsModule, KfSharedModule } from '@kf-products-core/kfhub_lib';
import {
    KfButtonModule, KfIconModule, KfTextModule
} from '@kf-products-core/kfhub_lib/presentation';
import { KfThclComponentsModule } from '@kf-products-core/kfhub_thcl_lib';
import {
    SlideToggleModule, ThclDropdownModule, ChipsModule,
} from '@kf-products-core/kfhub_thcl_lib/presentation';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { httpLoaderFactory } from '../../app/language-factory';

import { KfTarcComponentsModule } from '../../app/modules/components/kftarc.components.module';
import { JdDetailEditGuard } from './jd-detail-edit.guard';
import { JdDetailEditPage } from './jd-detail-edit.page';
import { JdDetailEditResolver } from './jd-detail-edit.resolver';
import { JdDetailRoutingModule } from './jd-detail-routing.module';
import { JdDetailEffects } from './jd-detail.effects';
import { JdDetailPage } from './jd-detail.page';
import { JdDetailResolver } from './jd-detail.resolver';
import { FEATURE_NAME, metaReducers, reducers } from './jd-detail.state';
import { JdDetailService } from './jd-detail.service';

@NgModule({
    schemas: [],
    imports: [
        KfSharedModule, // TODO delete this import
        KfComponentsModule, // TODO delete this import
        KfThclComponentsModule, // TODO delete this import
        KfTarcComponentsModule, // TODO delete this import
        ReactiveFormsModule,
        CommonModule,
        KfIconModule,
        KfTextModule,
        KfButtonModule,
        ThclDropdownModule,
        SlideToggleModule,
        JdDetailRoutingModule,
        DragDropModule,
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
            JdDetailEffects
        ]),
        TooltipModule,
        ChipsModule,
    ],
    declarations: [
        JdDetailPage,
        JdDetailEditPage,
    ],
    providers: [
        JdDetailService,
        JdDetailEditGuard,
        JdDetailResolver,
        JdDetailEditResolver,
    ]
})
export class JdDetailModule {
    constructor() { }
}

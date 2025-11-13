import { SharedModule } from 'primeng/api';
// import { SharedModule } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';

import { CommonModule, CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    KfChartBarSeriesModule,
    KfChartBarVerticalSeriesContainerModule,
    KfChartBenchmarkSeriesModule,
    KfChartHalfDonutSeriesModule,
    KfChartHexSeriesModule,
    KfChartModule,
    KfChartPlotModule,
    KfChartTicksModule,
    KfComponentsModule, KfPageComponentsModule, KfSharedModule, KfToggleModule
} from '@kf-products-core/kfhub_lib';
import { KfOutsideModule } from '@kf-products-core/kfhub_lib/directives';
import {
    KfButtonModule, KfIconModule, KfTextModule
} from '@kf-products-core/kfhub_lib/presentation';
import {
    KfISpMatrixLoaderService,
    KfThclComponentsModule, KfThclSharedModule, KfThclSuccessprofileService,
    KfThclTalentArchitectConstantsService,
    ThclPdfReportModelDownloadModule
} from '@kf-products-core/kfhub_thcl_lib';
import { ThclDropdownModule } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { TranslateModule } from '@ngx-translate/core';

import { KfTarcRelatedSpIconPipe } from '../pipes/kftarc-related-sp-icon.pipe';
import { KfTarcJobDescriptionService } from '../services/kftarc-job-description.service';
import { KfTarcHomeComponent } from './macro/home/kftarc-home/kftarc-home.component';
import {
    KfTarcExecGradingPageComponent
} from './macro/kftarc-exec-grading/kftarc-exec-grading-page.component';
import { KfTarcIgModalComponent } from './macro/kftarc-ig-modal/kftarc-ig-modal.component';
import {
    KfTarcMarketDataComponent
} from './macro/success-profile/detail/kftarc-market-data/kftarc-market-data.component';
import {
    KfTarcSkillFilterComponent
} from './macro/success-profile/detail/kftarc-skill-filter/kftarc-skill-filter.component';
import { KfTarcSPDetailComponent } from './macro/success-profile/detail/kftarc-sp-detail.component';
import {
    KfTarcSuccessProfileDetailService
} from './macro/success-profile/detail/kftarc-success-profile-detail.service';
import { KfTarcSPEditComponent } from './macro/success-profile/edit/kftarc-sp-edit.component';
import {
    KftarcProfilesContainerComponent
} from './macro/success-profile/kftarc-profiles-container/kftarc-profiles-container.component';
import {
    JdDraggableCompetencyComponent
} from './micro/jd-draggable-competency/jd-draggable-competency.component';
import { JdTextContainerComponent } from './micro/jd-text-container/jd-text-container.component';
import {
    KfTarcJdDraggableCompetencyComponent
} from './micro/kftarc-jd-draggable-competency/kftarc-jd-draggable-competency.component';
import {
    KfTarcJdSectionCardComponent
} from './micro/kftarc-jd-section-card/kftarc-jd-section-card.component';
import {
    KfTarcJdSectionCompetencyComponent
} from './micro/kftarc-jd-section-competency/kftarc-jd-section-competency.component';
import {
    KfTarcJdSectionHeaderTextComponent
} from './micro/kftarc-jd-section-header-text/kftarc-jd-section-header-text.component';
import {
    KftarcSpHomeCardComponent
} from './micro/kftarc-sp-home-card/kftarc-sp-home-card.component';
import {
    KfTarcSpSalaryRangeComponent
} from './micro/kftarc-sp-salary-range/kftarc-sp-salary-range.component';
import {
    KfTarcSummaryInsightsCardComponent
} from './micro/kftarc-sp-summary-sections/kftarc-summary-insights-card/kftarc-summary-insights-card.component';
import {
    KfTarcSummaryTaglineCardComponent
} from './micro/kftarc-sp-summary-sections/kftarc-summary-tagline-card/kftarc-summary-tagline-card.component';
import { KfTarcSPTilesComponent } from './micro/kftarc-sp-tiles/kftarc-sp-tiles.component';
import {
    KfTarcMarketInsightRawComponent
} from './micro/market-insight/kftarc-market-insight-raw.component';
import {
    KfTarcMarketInsightComponent
} from './micro/market-insight/kftarc-market-insight.component';
import { HttpService } from '../../services/http.service';
import { KfSMCXSurveyModule } from '@kf-products-core/kfhub_lib/tracking';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { KfTarcSpMatrixService } from '../services/kftarc-sp-matrix.service';
import { KftarcCustomProfilesContainerComponent } from './macro/custom-success-profile/kftarc-custom-profiles-container/kftarc-custom-profiles-container.component';
import { KfTarcCustomMarketDataComponent } from './macro/custom-success-profile/detail/kftarc-custom-market-data/kftarc-custom-market-data.component';
import { KfTarcCustomSPDetailComponent } from './macro/custom-success-profile/detail/kftarc-custom-sp-detail.component';
import { KftarcSpInterviewGuideComponent } from './micro/kftarc-sp-interview-guide/kftarc-sp-interview-guide.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        DropdownModule,
        MultiSelectModule,
        ContextMenuModule,
        KfSharedModule,
        KfComponentsModule,
        KfIconModule,
        KfButtonModule,
        KfTextModule,
        KfPageComponentsModule,
        ConfirmDialogModule,
        SharedModule,
        TooltipModule,
        KfThclComponentsModule,
        KfThclSharedModule,
        ThclDropdownModule,
        KfOutsideModule,
        KfToggleModule,
        KfSMCXSurveyModule,
        DragDropModule,
        KfChartModule,
        KfChartBarSeriesModule,
        KfChartBarVerticalSeriesContainerModule,
        KfChartBenchmarkSeriesModule,
        KfChartHalfDonutSeriesModule,
        KfChartHexSeriesModule,
        KfChartPlotModule,
        KfChartTicksModule,
        ThclPdfReportModelDownloadModule,
    ],
    declarations: [
        KfTarcMarketInsightRawComponent,
        KfTarcMarketInsightComponent,
        KfTarcSPDetailComponent,
        KfTarcSPEditComponent,
        KfTarcJdSectionCardComponent,
        JdTextContainerComponent,
        JdDraggableCompetencyComponent,
        KfTarcSummaryTaglineCardComponent,
        KfTarcSummaryInsightsCardComponent,
        KfTarcRelatedSpIconPipe,
        KfTarcHomeComponent,
        KftarcSpHomeCardComponent,
        KftarcProfilesContainerComponent,
        KfTarcExecGradingPageComponent,
        KfTarcIgModalComponent,
        KfTarcMarketDataComponent,
        KfTarcSkillFilterComponent,
        KfTarcJdSectionCompetencyComponent,
        KfTarcJdDraggableCompetencyComponent,
        KfTarcJdSectionHeaderTextComponent,
        KfTarcSPTilesComponent,
        KfTarcSpSalaryRangeComponent,
        KftarcCustomProfilesContainerComponent,
        KfTarcCustomMarketDataComponent,
        KfTarcCustomSPDetailComponent,
        KftarcSpInterviewGuideComponent,
    ],
    exports: [
        KfTarcMarketInsightComponent,
        KfTarcSPDetailComponent,
        KfTarcSPEditComponent,
        KfTarcJdSectionCardComponent,
        JdTextContainerComponent,
        JdDraggableCompetencyComponent,
        KfTarcSummaryTaglineCardComponent,
        KfTarcSummaryInsightsCardComponent,
        KfTarcRelatedSpIconPipe,
        KfTarcHomeComponent,
        KfTarcJdSectionCompetencyComponent,
        KfTarcJdDraggableCompetencyComponent,
        KfTarcJdSectionHeaderTextComponent,
        KfTarcSPTilesComponent,
        KfTarcSpSalaryRangeComponent,
        KfTarcIgModalComponent,
        KftarcSpInterviewGuideComponent,
        KfTarcCustomSPDetailComponent,
    ],
    providers: [
        CurrencyPipe,
        DatePipe,
        UpperCasePipe,
        KfThclTalentArchitectConstantsService,
        KfThclSuccessprofileService,
        KfTarcJobDescriptionService,
        KfTarcSuccessProfileDetailService,
        ThclDropdownModule,
        HttpService,
    ]
})
export class KfTarcComponentsModule { }

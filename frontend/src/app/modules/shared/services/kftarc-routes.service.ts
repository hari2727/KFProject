import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import {
    KfAuthGuardService as AuthGuard, KfCanDeactivateGuardService, KfExternalAppRouterComponent,
    KfIRoutesService, KfProductAuthGuardService as ProductAuthGuard,
    KfSharedConstantsService
} from '@kf-products-core/kfhub_lib';
import {
    KfProduct
} from '@kf-products-core/kfhub_lib/auth';
import {
    KfThclCompareContainerComponent, KfThclCompareEditComponent, KfThclSpAccessResolver
} from '@kf-products-core/kfhub_thcl_lib';

import { KfTarcHomeComponent } from '../../components/macro/home/kftarc-home/kftarc-home.component';
import {
    KfTarcExecGradingPageComponent
} from '../../components/macro/kftarc-exec-grading/kftarc-exec-grading-page.component';
// import { SpSearchPage } from '../../components/macro/success-profile/search/sp-search.page';
import {
    KfTarcSPDetailComponent
} from '../../components/macro/success-profile/detail/kftarc-sp-detail.component';
import {
    KfTarcSPEditComponent
} from '../../components/macro/success-profile/edit/kftarc-sp-edit.component';
import {
    KftarcProfilesContainerComponent
} from '../../components/macro/success-profile/kftarc-profiles-container/kftarc-profiles-container.component';
import { KfTarcHomeSummaryResolver } from '../../services/kftarc-home-summary-resolver.service';
import { KfTarcSPDetailResolver } from '../../services/kftarc-sp-detail-resolver.service';
import { KfTarcTranslationResolver } from '../../services/kftarc-translation-resolver.service';
import { SpDetailGuard } from '../../components/macro/success-profile/detail/kftarc-sp-detail.guard';
import { KfTarcCustomSPDetailComponent } from '../../components/macro/custom-success-profile/detail/kftarc-custom-sp-detail.component';
import { KftarcCustomProfilesContainerComponent } from '../../components/macro/custom-success-profile/kftarc-custom-profiles-container/kftarc-custom-profiles-container.component';
import { KfTarcInitGuard } from '../../../guards/kftarc-init.guard';
import { PublishCenterComponent } from '../../../../pages/csp-search/publish-center/publish-center.component';

@Injectable()
export class KfTarcRoutesService implements KfIRoutesService {
    constructor(
        private sharedConstantsService: KfSharedConstantsService,
    ) { }

    tarcProducts: KfProduct[] = [this.sharedConstantsService.PRODUCT_TARC];

    routes: Route[] = [
        {
            path: 'tarc/home', component: KfTarcHomeComponent, canActivate: [AuthGuard, ProductAuthGuard],
            data: { productsForPath: this.tarcProducts },
            resolve: {
                summary: KfTarcHomeSummaryResolver,
            },
        },
        {
            path: 'tarc/sp', component: KftarcProfilesContainerComponent, canActivate: [AuthGuard, ProductAuthGuard, KfTarcInitGuard],
            resolve: {
                access: KfThclSpAccessResolver,
            },
            runGuardsAndResolvers: 'always',
            data: { productsForPath: this.tarcProducts },
            children: [
                {
                    path: '',
                    loadChildren: () =>
                        import('../../../../pages/sp-search/sp-search.module').then(
                            (m) => m.SpSearchModule
                        ),
                    resolve: {
                        access: KfThclSpAccessResolver,
                        // searchFilters: SpSearchResolver
                    },
                    data: { productsForPath: this.tarcProducts, infiniteScroll: true },
                },
                {
                    path: 'compare',
                    component: KfThclCompareContainerComponent,
                    data: { productsForPath: this.tarcProducts },
                    canDeactivate: [KfCanDeactivateGuardService],
                    children: [
                        {
                            path: 'edit',
                            component: KfThclCompareEditComponent,
                            data: { productsForPath: this.tarcProducts },
                            canDeactivate: [KfCanDeactivateGuardService],
                        },
                    ],
                },
            ],
        },
        // {
        //     path: 'tarc/jd/search',
        //     component: KfTarcJDSearchComponent,
        //     canActivate: [AuthGuard, ProductAuthGuard],
        //     data: { productsForPath: this.tarcProducts, infiniteScroll: true },
        // },
        {
            path: 'tarc/jd/search',
            loadChildren: () =>
                import('../../../../pages/jd-search/jd-search.module').then(
                    (m) => m.JdSearchModule
                ),
            resolve: {
                access: KfThclSpAccessResolver,
            },
            data: { productsForPath: this.tarcProducts, infiniteScroll: true },
            canDeactivate: [KfCanDeactivateGuardService],
        },
        {
            path: 'tarc/execgrading',
            component: KfTarcExecGradingPageComponent,
            canActivate: [AuthGuard],
            resolve: { _empty: KfTarcTranslationResolver },
            data: { productsForPath: this.tarcProducts },
        },
        {
            path: 'tarc/sp/detail/:spDetailId',
            component: KfTarcSPDetailComponent,
            canActivate: [AuthGuard, ProductAuthGuard, SpDetailGuard],
            data: { productsForPath: this.tarcProducts },
            resolve: { spData: KfTarcSPDetailResolver },
            canDeactivate: [KfCanDeactivateGuardService, SpDetailGuard],
        },
        {
            path: 'tarc/sp/detail/:spDetailId/edit',
            component: KfTarcSPEditComponent,
            canActivate: [AuthGuard, ProductAuthGuard],
            data: {
                productsForPath: this.tarcProducts,
                defaultEdit: true,
            },
            resolve: { spData: KfTarcSPDetailResolver, access: KfThclSpAccessResolver },
            canDeactivate: [KfCanDeactivateGuardService, SpDetailGuard],
        },
        {
            path: 'tarc/sp/assmtproj',
            component: KfExternalAppRouterComponent,
            canActivate: [AuthGuard, ProductAuthGuard],
            data: {
                productsForPath: this.tarcProducts,
                externalRoutePath: 'talentacquisition/tacqprojectcreatemain/-1',
            },
        },
        {
            path: 'tarc/sp/tacqprojectsearch',
            component: KfExternalAppRouterComponent,
            canActivate: [AuthGuard],
            data: {
                productsForPath: this.tarcProducts,
                externalRoutePath: 'talentacquisition/tacqprojectredirect/',
            },
        },
        {
            path: 'tarc/sp/tamgprojectsearch',
            component: KfExternalAppRouterComponent,
            canActivate: [AuthGuard],
            data: {
                productsForPath: this.tarcProducts,
                externalRoutePath: 'talentmanagement/tamgprojectredirect/',
            },
        },
        {
            path: 'tarc/jd/detail/:jdDetailId',
            loadChildren: () =>
                import('../../../../pages/jd-detail/jd-detail.module').then(
                    (m) => m.JdDetailModule
                ),
            data: { productsForPath: this.tarcProducts },
            canActivate: [AuthGuard, ProductAuthGuard],
            canDeactivate: [KfCanDeactivateGuardService],
        },
        {
            path: 'tarc/cp', component: KftarcCustomProfilesContainerComponent, canActivate: [AuthGuard, ProductAuthGuard],
            resolve: {
                access: KfThclSpAccessResolver,
            },
            runGuardsAndResolvers: 'always',
            data: { productsForPath: this.tarcProducts },
            children: [
                {
                    path: '',
                    loadChildren: () =>
                        import('../../../../pages/csp-search/csp-search.module').then(
                            (m) => m.CspSearchModule
                        ),
                    resolve: {
                        access: KfThclSpAccessResolver,
                        // searchFilters: SpSearchResolver
                    },
                    data: { productsForPath: this.tarcProducts, infiniteScroll: true },
                },
                {
                    path: 'compare',
                    component: KfThclCompareContainerComponent,
                    data: { productsForPath: this.tarcProducts },
                    canDeactivate: [KfCanDeactivateGuardService],
                    children: [
                        {
                            path: 'edit',
                            component: KfThclCompareEditComponent,
                            data: { productsForPath: this.tarcProducts },
                            canDeactivate: [KfCanDeactivateGuardService],
                        },
                    ],
                },
            ],
        },
        {
            path: 'tarc/cp/detail/:spDetailId',
            component: KfTarcCustomSPDetailComponent,
            canActivate: [AuthGuard, ProductAuthGuard, SpDetailGuard],
            data: { productsForPath: this.tarcProducts },
            resolve: { spData: KfTarcSPDetailResolver },
            canDeactivate: [KfCanDeactivateGuardService, SpDetailGuard],
        },
        {
            path: 'tarc/cp/assmtproj',
            component: KfExternalAppRouterComponent,
            canActivate: [AuthGuard, ProductAuthGuard],
            data: {
                productsForPath: this.tarcProducts,
                externalRoutePath: 'talentacquisition/tacqprojectcreatemain/-1',
            },
        },
        {
            path: 'tarc/cp/tacqprojectsearch',
            component: KfExternalAppRouterComponent,
            canActivate: [AuthGuard],
            data: {
                productsForPath: this.tarcProducts,
                externalRoutePath: 'talentacquisition/tacqprojectredirect/',
            },
        },
        {
            path: 'tarc/cp/tamgprojectsearch',
            component: KfExternalAppRouterComponent,
            canActivate: [AuthGuard],
            data: {
                productsForPath: this.tarcProducts,
                externalRoutePath: 'talentmanagement/tamgprojectredirect/',
            },
        },
        {
            path: 'tarc/cp/search/publish-center',
            component: PublishCenterComponent,
            canActivate: [AuthGuard],
            resolve: { access: KfThclSpAccessResolver },
            data: { productsForPath: this.tarcProducts },
        },
    ];

    getRoutes(): Route[] {
        return this.routes;
    }
}

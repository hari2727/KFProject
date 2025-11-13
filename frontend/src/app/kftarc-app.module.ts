import { NgHttpLoaderModule } from 'ng-http-loader';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import {
    environmentReader,
    KfAuthGuardService, KfAuthService, KfCacheService, KfCanDeactivateGuardService,
    KfComponentsModule, KfCustomMultiPathJsonLoader, KfDialogService, KfGrowlService, KfIdleService,
    KfPageComponentsModule, KfProductAuthGuardService, KfRouteModuleGuardService, KfSharedModule,
    KfToggleModule, KfTranslationService,
} from '@kf-products-core/kfhub_lib';
import {
    KfButtonModule, KfIconModule, KfTextModule
} from '@kf-products-core/kfhub_lib/presentation';
import { KfSMCXSurveyModule } from '@kf-products-core/kfhub_lib/tracking';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIdleModule } from '@ng-idle/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { CoreModule } from './core/core.module';
import { KfTarcAppComponent } from './kftarc-app.component';
import { KfTarcTalentArchitectModule } from './modules/kftarc-talentarchitect.module';
import { KfTarcAppConfig } from './modules/models/kftarc-app-config.model';
import { httpLoaderFactory } from './language-factory';

export const APP_CONFIG = new InjectionToken<KfTarcAppConfig>('kfTarcAppConfig');
export const APP_DI_CONFIG: KfTarcAppConfig = {
    appName: 'kftarc',
};


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], { useHash: true, preloadingStrategy: PreloadAllModules }),
        FormsModule,
        // NgbModule,
        HttpClientModule,
        NgHttpLoaderModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient],
            },
            // isolate: true,
        }),
        NgIdleModule.forRoot(),
        ToastModule,
        DialogModule,
        KfSharedModule,
        KfComponentsModule,
        KfIconModule,
        KfButtonModule,
        KfTextModule,
        KfPageComponentsModule,
        KfTarcTalentArchitectModule,
        CoreModule,
        KfToggleModule,
        KfSMCXSurveyModule,
    ],
    declarations: [
        KfTarcAppComponent,
    ],
    providers: [
        TranslateService,
        MessageService,
        KfAuthGuardService,
        KfProductAuthGuardService,
        KfRouteModuleGuardService,
        KfAuthService,
        KfDialogService,
        KfIdleService,
        KfCanDeactivateGuardService,
        KfCacheService,
        KfTranslationService,
        KfGrowlService,
        CookieService,
    ],
    bootstrap: [
        KfTarcAppComponent,
    ],
})
export class KfTarcAppModule {
    constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'de', 'es-ar', 'ja', 'pl', 'tr', 'zh']);
        translate.setDefaultLang('en');
        translate.use('en');
    }
}

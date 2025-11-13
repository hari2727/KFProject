import { NgModule, Optional, SkipSelf } from '@angular/core';
import { KfThclCoreModule } from '@kf-products-core/kfhub_thcl_lib';
import { CustomRouterStateSerializer } from '@kf-products-core/kfhub_thcl_lib/state';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { metaReducers, reducers } from './core.state';
import { CoreEffects } from './effects/core.effects';

@NgModule({
    imports: [
        KfThclCoreModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreRouterConnectingModule.forRoot(),
        EffectsModule.forRoot([
            CoreEffects,
        ]),
        // StoreDevtoolsModule.instrument({ name: 'Tarc', maxAge: 100, logOnly: false })
    ],
    declarations: [],
    providers: [
        { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
    ],
    exports: [
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import only in root module');
        }
    }
}

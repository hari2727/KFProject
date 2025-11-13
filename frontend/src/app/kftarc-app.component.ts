import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { KfTarcRoutesService } from './modules/shared/services/kftarc-routes.service';
import { Router, NavigationEnd } from '@angular/router';
import {
    KfThclSuccessprofileService,
} from '@kf-products-core/kfhub_thcl_lib';
import { KfIAppHeaderConfig, KfSharedConstantsService } from '@kf-products-core/kfhub_lib';
import _ from 'lodash';

@Component({
    selector: 'kftarc-root',
    templateUrl: 'kftarc-app.component.html',
    styleUrls: ['kftarc-app.component.scss'],
})
export class KfTarcAppComponent implements OnInit {
    private tarcProductId = this.sharedContantService.PRODUCT_TARC.productId;
    subNavigationOptions = [
        {
            id: this.tarcProductId * 10,
            pathname: '/tarc/home',
            page: '',
            label: 'lib.dashboard',
            pathKey: 'dashboard',
        },
        {
            id: this.tarcProductId * 10 + 1,
            pathname: '/tarc/sp',
            page: 'search',
            label: 'lib.successProfiles',
            pathKey: 'successProfiles',
        },
        {
            id: this.tarcProductId * 10 + 3,
            pathname: '/tarc/jd',
            page: 'search',
            label: 'lib.jobDescription',
            pathKey: 'jobDescription',
        },
        {
            id: this.tarcProductId * 10 + 2,
            pathname: '/tarc/cp',
            page: 'search',
            label: 'pm.orgTitle',
            pathKey: 'customProfiles',
        },
    ];
    tarcHeaderConfig: KfIAppHeaderConfig = {
        iconPath: 'pm-icon',
        productTitle: 'lib.pm',
        backgroundPath: 'tarc_bg',
        subNavigation: this.subNavigationOptions,
        collapsedHeaderColors: ['#0c1846', '#6271ae'],
    };

    constructor(
        public moduleRoutesService: KfTarcRoutesService,
        private router: Router,
        private spService: KfThclSuccessprofileService,
        public sharedContantService: KfSharedConstantsService,
    ) { }

    ngOnInit() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            if (event.url === '/myprofile') {
                this.spService.resetCacheDescriptionsData();
            }
        });
    }
}

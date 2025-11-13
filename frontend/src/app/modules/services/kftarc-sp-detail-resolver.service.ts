import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {
    KfThclSuccessprofileService,
} from '@kf-products-core/kfhub_thcl_lib';
import { KfISuccessProfile } from '@kf-products-core/kfhub_lib';
import { KfTarcJobDescriptionService } from './kftarc-job-description.service';
import { HttpService } from '../../services/http.service';
import { KfTarcSuccessProfileDetailService } from '../components/macro/success-profile/detail/kftarc-success-profile-detail.service';

@Injectable()

export class KfTarcSPDetailResolver  {
    constructor(
        private successProfileService: KfThclSuccessprofileService,
        private jobDescriptionService: KfTarcJobDescriptionService,
        private httpService: HttpService,
        private spDetailsService: KfTarcSuccessProfileDetailService,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const url = route.routeConfig.path;
        if (route.params.spDetailId && !url.includes('edit')) {
            const localeFromFilter = this.spDetailsService.getLocaleFromFilter();
            return this.successProfileService.getSuccessProfileDetail(route.params.spDetailId, true, true, undefined, localeFromFilter);
        }
        if (route.params.jdDetailId) {
            if (route.params.jdDetailId === 'new' && route.queryParams.fromSPId) {

                return forkJoin([
                    this.successProfileService.generateJobDescriptionFromSP(route.queryParams.fromSPId),
                    this.httpService.getUniversalCompanyDesc()
                ]);
            }
            return forkJoin([
                this.jobDescriptionService.getSuccessProfileDetail(route.params.jdDetailId)
            ]);
        }
        return null;
    }
}

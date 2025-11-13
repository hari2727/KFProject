import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KfThclSummary } from '@kf-products-core/kfhub_thcl_lib';

@Injectable()
export class KfTarcHomeSummaryResolver  {
    constructor() {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<KfThclSummary> {
        return of({} as KfThclSummary);
    }
}

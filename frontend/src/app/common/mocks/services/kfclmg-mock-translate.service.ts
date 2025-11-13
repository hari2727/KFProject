/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { of as observableOf, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export default class KfMockTranslateService extends TranslateService {
    public get(key: string | string[], interpolateParams?: Object): Observable<any> {
        const result = _.isArray(key) ? { } : null;
        return observableOf(result);
    }
}

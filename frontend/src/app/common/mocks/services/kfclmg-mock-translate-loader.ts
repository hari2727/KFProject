/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { of as observableOf, Observable } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';

export default class KfMockTranslateLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        return observableOf({ });
    }
}

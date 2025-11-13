import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Observable, Observer } from 'rxjs';
import { KfTarcPricedFact } from '../../../models/kftarc-priced-fact.model';
import { TranslateService } from '@ngx-translate/core';
import { KfTarcCurrency } from '../../../models/kftarc-currency.model';

const SUCCESSPROFILE_NA_TRANS_KEY = 'pm.SuccessProfileNA';
const GRADE_LABEL_TRANS_KEY = 'pm.GradeLCase';

@Component({
    selector: 'kftarc-market-insight-raw',
    templateUrl: './kftarc-market-insight-raw.component.html',
    styleUrls: ['./kftarc-market-insight-raw.component.scss'],
})
export class KfTarcMarketInsightRawComponent {
    @Input() pricedFacts: KfTarcPricedFact[];
    @Input() currency: KfTarcCurrency;
    @Input() grade = 0;
    @Input() gradeLabel: string = GRADE_LABEL_TRANS_KEY;

    constructor(
        public translate: TranslateService,
        public currencyPipe: CurrencyPipe
    ) {}

    getCurrency() {
        return this.currency;
    }

    getGrade(): number {
        return this.grade;
    }

    getGradeLabel(): Observable<string> {
        return Observable.create((observer: Observer<string>) => {
            this.translate.get(this.gradeLabel).subscribe((translated: string) => {
                observer.next(translated);
                observer.complete();
            });
        });
    }

    getFactDetails(fact): Observable<string> {
        return Observable.create((observer: Observer<string>) => {
            const low  = fact.marketLow;
            const high = fact.marketHigh;

            if (low < 0 || high < 0) {
                this.translate.get(SUCCESSPROFILE_NA_TRANS_KEY).subscribe((translated: string) => {
                    observer.next(translated);
                    observer.complete();
                });
            } else {
                let retVal = '';
                if (low && high) {
                    const currencyCode = this.currency && this.currency.currencyIsoCode ? this.currency.currencyIsoCode : 'USD';
                    // const lowCurrency = this.currencyPipe.transform(low, currencyCode, 'symbol', '1.0');
                    // const highCurrency = this.currencyPipe.transform(high, currencyCode, 'symbol', '1.0');
                    const lowCurrency = low;
                    const highCurrency = high;
                    retVal = `${lowCurrency  } - ${  highCurrency  } ${  currencyCode}`;
                }

                observer.next(retVal);
                observer.complete();
            }
        });
    }
}

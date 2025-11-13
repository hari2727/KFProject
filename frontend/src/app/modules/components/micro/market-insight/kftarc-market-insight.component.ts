import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Observable, Observer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { KfTarcMarketInsightRawComponent } from './kftarc-market-insight-raw.component';

import { KfTarcPricedResults } from '../../../models/kftarc-priced-results.model';
import { KfTarcPricedFact } from '../../../models/kftarc-priced-fact.model';

import { KfKeyedCollection, KfIpricedResults } from '@kf-products-core/kfhub_lib';
import { KfThclSPSharedService } from '@kf-products-core/kfhub_thcl_lib';

@Component({
    selector: 'kftarc-market-insight',
    templateUrl: './kftarc-market-insight-raw.component.html',
    styleUrls: ['./kftarc-market-insight-raw.component.scss'],
})
export class KfTarcMarketInsightComponent extends KfTarcMarketInsightRawComponent implements OnInit {
    pricingCache: KfKeyedCollection<KfTarcPricedFact[]> = new KfKeyedCollection<KfTarcPricedFact[]>();

    @Input() jobRoleTypeId: string;
    @Input() standardHayGrade: number;
    @Input() countryId: number;

    constructor(
        public spSharedService: KfThclSPSharedService,
        public translate: TranslateService,
        public currencyPipe: CurrencyPipe
    ) {
        super(translate, currencyPipe);
    }

    ngOnInit() {
        this.grade = this.standardHayGrade;

        this.getPricedFacts(this.jobRoleTypeId, this.standardHayGrade, this.countryId)
            .subscribe((pricedFacts: KfTarcPricedFact[]) => {
                this.pricedFacts = pricedFacts;
            });
    }

    getPricedFacts(jobRoleTypeId: string, standardHayGrade: number, countryId: number): Observable<KfTarcPricedFact[]> {
        return Observable.create((observer: Observer<KfTarcPricedFact[]>) => {
            const key: string = this.getKey(jobRoleTypeId, standardHayGrade, countryId);
            if (!this.pricingCache.ContainsKey(key)) {
                this.spSharedService.getPricing(jobRoleTypeId, standardHayGrade, countryId)
                    .subscribe((pricedResults: KfIpricedResults[]) => {
                        const pricedFacts = this.getRelevantPricedFacts(pricedResults);
                        this.pricingCache.Add(key, pricedFacts);
                        observer.next(pricedFacts);
                        observer.complete();
                    });
            } else {
                observer.next(this.pricingCache.Item(key));
                observer.complete();
            }
        });
    }

    getRelevantPricedFacts(pricedResults): KfTarcPricedFact[] {
        return pricedResults[0].pricedFacts.filter((pricedFact: KfTarcPricedFact) => pricedFact.displayType.slice(0, 10) === 'PRICE_CARD');
    }

    getKey(jobRoleTypeId: string, standardHayGrade: number, countryId: number): string {
        return `${  jobRoleTypeId  }_${  standardHayGrade  }_${  countryId}`;
    }
}

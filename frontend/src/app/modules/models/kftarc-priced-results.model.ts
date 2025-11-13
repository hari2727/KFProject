import { KfTarcCurrency } from './kftarc-currency.model';
import { KfTarcPricedFact } from './kftarc-priced-fact.model';

export interface KfTarcPricedResults {
    locationId: number;
    locationName: string;
    numberOfParticipants: number;
    currency: KfTarcCurrency;
    pricedFacts: KfTarcPricedFact[];
}

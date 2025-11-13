import { Injectable } from '@angular/core';
import {
    KfIGrade,
    KfISuccessProfile,
    KfIMarketInsightsResults,
    KfStorageService,
    KfStoreTypeEnum,
} from '@kf-products-core/kfhub_lib';

export interface KfTarcSPViewOptions {
    select: 'select';
    recruit: 'recruit';
    pay: 'pay';
}

@Injectable()
export class KfTarcSuccessProfileDetailService {
    private localeFromFilter = '';
    private originalLocale = '';

    public selectViewOptions: KfTarcSPViewOptions = {
        select: 'select',
        recruit: 'recruit',
        pay: 'pay',
    };

    constructor(
        private storageService: KfStorageService,
    ) {
    }
    processScaricity(res: KfIMarketInsightsResults) {
        let showCandidateScarcity = false;
        let showTopCompetenciesForPerformance = false;
        let showTimeToFill = false;
        if (res) {
            if (res.candidateScarcity) {
                showCandidateScarcity = true;
            }
            if (res.topCompetencies) {
                showTopCompetenciesForPerformance = true;
            }
            if (res.timeToFill) {
                showTimeToFill = true;
            }
        }
        return { showCandidateScarcity, showTopCompetenciesForPerformance, showTimeToFill };
    }

    setLocaleFromFilter(locale: string): void {
        this.storageService.setItem('localeFromFilter', JSON.stringify(locale), KfStoreTypeEnum.SESSION);
    }

    getLocaleFromFilter(): string {
        return JSON.parse(sessionStorage.getItem('localeFromFilter'));
    }
}

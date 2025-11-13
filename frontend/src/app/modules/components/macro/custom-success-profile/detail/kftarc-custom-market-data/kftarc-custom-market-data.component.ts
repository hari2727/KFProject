import { Component, OnDestroy, Input, Output, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { KfIpricedResults, KfIpricedFact, KfISuccessProfile, KfIMarketInsightsResults, KfMarketInsightSalaryRange, KfMixOfRewards, KfIMarketInsightDataInsights, DoubleDonutConfig, KfICountry, KfIDonutDetailedItem, KfIDevelopmentDifficulty, KfChartStyle, KfChartStyleBuilder, KfMarketInsightBaseSalaryData, KfCacheService, KfLoadingControllerService, KfAuthService } from '@kf-products-core/kfhub_lib';
import { DecimalPipe } from '@angular/common';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { KfThclSpMarketInsightsCacheService } from '@kf-products-core/kfhub_thcl_lib';
import { KfTarcMarketSkillsService, KfTarcMarketSkill, KfTarcSkillsFilterItem, KfTarcSkillCompareSections } from '../../../../../services/kftarc-market-skills.service';
import { TranslateService } from '@ngx-translate/core';
import { KfTarcSPViewOptions, KfTarcSuccessProfileDetailService } from '../kftarc-custom-success-profile-detail.service';
import * as _ from 'lodash';
import { KfTarcSPSalaryRangeData } from '../../../../micro/kftarc-sp-salary-range/kftarc-sp-salary-range.component';
import { switchMap } from 'rxjs/operators';
import { isExecLevelProfile, isExecutiveUngraded, renderGrade } from '@kf-products-core/kfhub_thcl_lib/domain';

const SUCCESSPROFILE_NA_TRANS_KEY = 'SuccessProfileNA';

@Component({
    selector: 'kftarc-custom-market-data',
    templateUrl: './kftarc-custom-market-data.component.html',
    styleUrls: ['./kftarc-custom-market-data.component.scss'],
    providers: [DecimalPipe],
})
export class KfTarcCustomMarketDataComponent implements OnDestroy, OnChanges {
    private subscriptions$: Subscription[] = [];

    @Output()
    public bannerDataChange = new EventEmitter<{ bannerFactName: string; bannerFactDetail: string }>();

    @Input() public selectedCountry: KfICountry = null;

    @Input() public successProfile: KfISuccessProfile = null;

    @Input() public viewType = '';

    public donutData: KfIDonutDetailedItem[];
    public scarcityDonutConfig: DoubleDonutConfig = null;

    private gradeStrokeColor = '#ebeff2';
    private gradeFillColor = 'rgba(75, 190, 115, 0.4)';
    private gradeColor = '#4abd73';
    private gradeColors = [this.gradeColor, this.gradeFillColor];
    public gradeStyle = new KfChartStyleBuilder()
        .for(KfChartStyle.arc, (_1, i) => ({
            fill: this.gradeColors[i],
            innerRadius: 55,
            stroke: this.gradeStrokeColor,
            strokeWidth: 1,
        }));
    public gradeData: any = null;

    private pricedResult: KfIpricedResults;

    public salaryRangeFactName: string;
    public salaryRangeData: KfTarcSPSalaryRangeData = null;
    public salaryRangeCurrencyCode: string = null;

    public mixOfRewards: KfMixOfRewards = null;
    public mixOfPayFactName: string;
    public mixOfPayCurrencyCode: string = null;

    public baseSalaryData: any = null;
    public baseSalaryMax: number;
    public baseSalaryDataHasValues = false;

    public marketSalaryCurrencyCode: string = null;
    public marketSalaryFactName: string;

    private reloadOrgSkillsEvent$ = new Subject<true>();
    private reloadCompareSkillsEvent$ = new Subject<true>();

    private myOrgSkills: KfTarcMarketSkill[];
    private compareSkills: KfTarcMarketSkill[];
    private selectedSkillsCompareSection: KfTarcSkillCompareSections = 'market';
    private selectedSkillFilter?: KfTarcSkillsFilterItem[] = null;
    private clientName = '';

    public developmentDifficulty: KfIDevelopmentDifficulty[] = null;

    public selectViewOptions: KfTarcSPViewOptions;

    private donutDataMap = {
        baseSalary: { color: '#566fd6', label: 'pm.baseSalary' },
        shortTermIncentives: { color: '#458dde', label: 'pm.shortTermIncentives' },
        longTermIncentives: { color: '#45b7de', label: 'pm.longTermIncentives' },
        benefits: { color: '#3acdd2', label: 'pm.benefits' },
        totalAllowances: { color: '#32b5a0', label: 'pm.totalAllowances' },
    };

    public hasCustomGradesAccess = false;
    public sessionInfo;
    public renderGrade = renderGrade;
    public kfLabel = this.translate.instant('lib.kornFerry');

    constructor(
        private miCache: KfThclSpMarketInsightsCacheService,
        private decimalPipe: DecimalPipe,
        private cacheService: KfCacheService,
        private translate: TranslateService,
        public spDetailsService: KfTarcSuccessProfileDetailService,
        private skillsService: KfTarcMarketSkillsService,
        private loadingService: KfLoadingControllerService,
        private auth: KfAuthService,
    ) {
        this.selectViewOptions = this.spDetailsService.selectViewOptions;

        this.sessionInfo = this.auth.getSessionInfo();
        const client = this.sessionInfo.Client;
        this.clientName = client.Name;

        const orgSkills$ = this.reloadOrgSkillsEvent$.pipe(
            switchMap(() => this.skillsService.getSkills(
                'ORG_SKILL',
                this.successProfile.title,
                +this.selectedCountry.id,
                { clientNames: this.clientName },
            )),
        );

        const compareSkills$ = this.reloadCompareSkillsEvent$.pipe(
            switchMap(() => {
                let params;
                if (!_.isEmpty(this.selectedSkillFilter)) {
                    if (this.selectedSkillsCompareSection === 'industry') {
                        const filter = this.selectedSkillFilter.map(item => item.id).sort().join(',');
                        params = { industryId: filter };
                    }
                    if (this.selectedSkillsCompareSection === 'peers') {
                        const filter = this.selectedSkillFilter.map(item => item.id).sort().join(',');
                        params = { peerGroupIds: filter };
                    }
                }
                return this.skillsService.getSkills(
                    'MARKET_SKILL',
                    this.successProfile.title,
                    +this.selectedCountry.id,
                    params,
                );
            }),
        );

        const sub1 = combineLatest([
            orgSkills$, compareSkills$,
        ]).subscribe(([orgSkills, compareSkills]) => {
            this.myOrgSkills = orgSkills;
            this.compareSkills = compareSkills;
            this.skillsService.updateDiffs(this.compareSkills, this.myOrgSkills);
        });

        this.subscriptions$.push(sub1);
    }

    ngOnDestroy() {
        for (const sub of this.subscriptions$) {
            sub.unsubscribe();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedCountry || changes.successProfile) {
            this.loadingService.blockOnPendingRequests(
                () => this.updatePricedResults(),
                ['thcl:get-mi-details', 'thcl:get-pricing'],
            );
        }
        if ((changes.successProfile || changes.selectedCountry || changes.viewType)
            && this.successProfile && this.selectedCountry && this.viewType) {
            this.loadMarketData(this.viewType);
            const permissions = _.get(this.sessionInfo, 'user.permissions', {});
            this.hasCustomGradesAccess = permissions.hasCustomGrades;
        }
    }

    private configureGradeArch() {
        if (isExecutiveUngraded(this.successProfile)) {
            this.gradeColors = [this.gradeFillColor, this.gradeColor, this.gradeFillColor];
            const gradeRange = {
                min: this.successProfile.grade.min,
                max: this.successProfile.grade.max,
            };
            this.gradeData = [gradeRange.min - 1, gradeRange.max - 1, 38 - gradeRange.max];
        } else {
            const value = Object.prototype.hasOwnProperty.call(this.successProfile, 'standardHayGrade')
                ? parseInt(this.successProfile.standardHayGrade, 10) : null;
            if (value != null) {
                const min = 1;
                const max = 38;
                this.gradeData = value < 21 ?
                    [value / 20 * 3 / 4, 1 - value / 20 * 3 / 4] : [value - min, max - min - (value - min)];
                this.gradeColors = [this.gradeColor, this.gradeFillColor];
            } else {
                this.gradeData = null;
            }
        }
    }

    private updatePricedResults() {
        if (this.selectedCountry &&
            this.successProfile &&
            this.successProfile.standardHayGrade &&
            this.successProfile.jobRoleTypeId
        ) {
            this.loadPricedResults();
        }
    }

    private loadPricedResults() {
        const countryId = parseInt(this.selectedCountry.id, 10);
        const jobRoleTypeId = this.successProfile.jobRoleTypeId;
        const grade = parseInt(this.successProfile.standardHayGrade, 10);
        const parentJobRoleTypeId = this.successProfile['parentJobRoleTypeId'];

        const subscription$ = (this.miCache.getPricedResults as any)(jobRoleTypeId, grade, countryId, parentJobRoleTypeId)
            .subscribe((pricedResults: KfIpricedResults[]) => {
                this.pricedResult = pricedResults ? pricedResults[0] : null;
                const pricedFacts = pricedResults ? this.getRelevantPricedFacts(pricedResults) : null;
                let bannerFactName = null;
                let bannerFactDetail = null;
                if (pricedFacts) {
                    bannerFactName = null;
                    pricedFacts.forEach((fact: KfIpricedFact) => {
                        fact.factDetail = this.getFactDetails(fact);
                        if (fact.displayTypeId === '1') {
                            bannerFactName = fact.factName;
                            bannerFactDetail = fact.factDetail;
                        }
                    });
                } else {
                    bannerFactName = null;
                    bannerFactDetail = null;
                }
                this.bannerDataChange.emit({ bannerFactName, bannerFactDetail });
                this.cacheService.save({ key: 'pricedResult', value: this.pricedResult });
                this.cacheService.save({ key: 'pricedFacts', value: pricedFacts });
                this.cacheService.save({ key: 'isDevelopmentDifficulty', value: !pricedFacts });
            });
        this.subscriptions$.push(subscription$);
    }

    private loadMarketData(view: string) {
        this.configureGradeArch();
        switch (view) {
            case this.selectViewOptions.select:
                this.getSalaryRange();
                this.getCandidateScarcity();
                this.getDifficultyToDevelop();
                break;
            case this.selectViewOptions.pay:
                this.getMarketSalary();
                this.getMixOfPay();
                break;
            case this.selectViewOptions.recruit:
                this.getMixOfPay();
                this.getSalaryRange();
                this.getCandidateScarcity();
                this.getDifficultyToDevelop();
                break;
        }
    }

    private processSalaryRangeData(averageData: KfMarketInsightSalaryRange): KfTarcSPSalaryRangeData {
        return {
            lowLevel: `${averageData.low}`,
            averageLevel: `${averageData.average}`,
            highLevel: `${averageData.high}`,
            label: 'lib.averageSalary',
        };
    }

    private getSalaryRange() {
        const sub = this.miCache.getSalaryRange(
            this.successProfile.id,
            parseInt(this.selectedCountry.id, 10),
        ).subscribe((res: KfIMarketInsightsResults) => {
            if (res && res.averageMarketCompData
                && res.averageMarketCompData.low !== null
                && res.averageMarketCompData.high !== null
                && res.averageMarketCompData.average !== null) {
                this.salaryRangeData = this.processSalaryRangeData(res.averageMarketCompData);
                this.salaryRangeCurrencyCode = res.averageMarketCompData.currencyCode;
                this.salaryRangeFactName = res.averageMarketCompData.factName;
            } else {
                this.salaryRangeData = null;
            }
        });
        this.subscriptions$.push(sub);
    }

    private getCandidateScarcity() {
        const sub = this.miCache.getCandidateScarcity(
            this.successProfile.id,
            parseInt(this.selectedCountry.id, 10),
            true,
        ).subscribe((res: KfIMarketInsightsResults) => {
            if (res) {
                if (res.candidateScarcity) {
                    this.scarcityDonutConfig = this.processCandidateScarcityData(res.candidateScarcity.dataInsights);
                } else {
                    this.scarcityDonutConfig = null;
                }
            }
        });
        this.subscriptions$.push(sub);
    }

    private getMixOfPay() {
        const sub = this.miCache.getMixOfPay(
            this.successProfile.id,
            parseInt(this.selectedCountry.id, 10),
        ).subscribe((res: KfIMarketInsightsResults) => {
            if (res) {
                this.mixOfRewards = res.mixOfRewards;
                this.mixOfPayFactName = res.mixOfRewards.factName.toLowerCase();
                this.mixOfPayCurrencyCode = res.mixOfRewards.currencyCode;
                this.processMixOfRewardsData(this.mixOfRewards);
            } else {
                this.mixOfRewards = null;
            }
        });
        this.subscriptions$.push(sub);
    }

    private canShowBaseSalary(): boolean {
        if (!this.baseSalaryData) return false;
        let showBaseSalary = false;
        this.baseSalaryData.forEach((datum) => {
            if (datum.values.length > 0) {
                showBaseSalary = true;
            }
        });
        return showBaseSalary;
    }

    private getMarketSalary() {
        const sub = this.miCache.getMarketSalary(
            this.successProfile.id,
            parseInt(this.selectedCountry.id, 10),
        ).subscribe((res: KfIMarketInsightsResults) => {
            if (res && res.marketPercentileCompData) {
                this.baseSalaryData = this.processMarketSalaryData(res.marketPercentileCompData.dataInsights);
                this.marketSalaryCurrencyCode = res.marketPercentileCompData.currencyCode;
                this.marketSalaryFactName = res.marketPercentileCompData.factName;
            } else {
                this.baseSalaryData = null;
            }
            this.baseSalaryDataHasValues = this.canShowBaseSalary();
        });
        this.subscriptions$.push(sub);
    }

    private getDifficultyToDevelop() {
        const sub = this.miCache.getDifficultyToDevelop(
            this.successProfile.id,
            parseInt(this.selectedCountry.id, 10),
        ).subscribe((res: any) => {
            if (res) {
                this.developmentDifficulty = _.slice(res.developmentDifficulty, 0, 3);
            }
        });
        this.subscriptions$.push(sub);
    }

    private getRelevantPricedFacts(pricedResults): KfIpricedFact[] {
        return pricedResults[0].pricedFacts.filter((pricedFact: KfIpricedFact) => pricedFact.displayType.slice(0, 10) === 'PRICE_CARD'
                && pricedFact.marketHigh !== null && pricedFact.marketLow !== null);
    }

    private getFactDetails(fact): string {
        const low = fact.marketLow;
        const high = fact.marketHigh;
        let retVal = '';

        if (low < 0 || high < 0) {
            retVal = SUCCESSPROFILE_NA_TRANS_KEY;
        } else {
            if (low >= 0 && high >= 0) {
                const currencyCode = this.pricedResult.currency && this.pricedResult.currency.currencyIsoCode
                    ? this.pricedResult.currency.currencyIsoCode : 'USD';
                const lowCurrency = low === 0 ? '0' : this.decimalPipe.transform(low, '2.');
                const highCurrency = high === 0 ? '0' : this.decimalPipe.transform(high, '2.');
                retVal = `${currencyCode} ${lowCurrency} - ${highCurrency}`;
            }
        }
        return retVal;
    }

    public checkMarketInsights(): boolean {
        switch (this.viewType) {
            case this.selectViewOptions.select:
                if (this.salaryRangeData || this.scarcityDonutConfig
                    || this.developmentDifficulty
                        && this.developmentDifficulty.length) {
                    return true;
                }
                break;
            case this.selectViewOptions.recruit:
                if (this.salaryRangeData || this.scarcityDonutConfig
                    || this.developmentDifficulty
                        && this.developmentDifficulty.length) {
                    return true;
                }
                break;
            case this.selectViewOptions.pay:
                if (this.baseSalaryDataHasValues || this.mixOfRewards ||
                    this.gradeData && this.successProfile.hasGradeAccess
                        && !isExecLevelProfile(+this.successProfile.standardHayGrade)) {
                    return true;
                }
        }
        return false;
    }

    private processMixOfRewardsData(mixOfRewards) {
        const rewardsData = _.omit(mixOfRewards, 'currencyCode', 'factName');
        const totalRewards = _.reduce(_.map(rewardsData, val => val), (sum, n) => sum + n);
        this.donutData = _.map(rewardsData, (val, key) => (
            {
                name: this.translate.instant(this.donutDataMap[key].label),
                value: val ? val / totalRewards : 0,
                color: this.donutDataMap[key].color,
            }
        ));
    }

    private processMarketSalaryData(dataInsights: KfMarketInsightBaseSalaryData[]): any {
        const ret = [{ values: [], footer: 'Percentile' }];
        let maxValue: number = null;
        dataInsights.forEach((datum) => {
            if (datum.value) {
                ret[0].values.push({
                    value: Math.round(datum.value / 1000),
                    labelBottom: `${datum.percentile.substring(1)}th`,
                    color: '#cedc46',
                });
                maxValue = datum.value > maxValue ? datum.value : maxValue;
            }
        });
        this.baseSalaryMax = Math.round(maxValue / 1000);
        return ret;
    }

    private processCandidateScarcityData(dataInsights: KfIMarketInsightDataInsights[]): DoubleDonutConfig {
        const functionScarcity = dataInsights.find(datum => datum.isParentJobFamilyId);
        if (!functionScarcity) {
            return null;
        }
        const allFunctionsScarcity = dataInsights.find(datum => datum.family.id === 'ALL');
        return {
            outerDonut: {
                label: allFunctionsScarcity.family.name,
                percentage: Math.round(allFunctionsScarcity.scarcityPercentage) / 100,
                color: '#3acdd2',
            },
            innerDonut: {
                label: functionScarcity.family.name,
                percentage: Math.round(functionScarcity.scarcityPercentage) / 100,
                color: '#32b5a0',
            },
        };
    }
}

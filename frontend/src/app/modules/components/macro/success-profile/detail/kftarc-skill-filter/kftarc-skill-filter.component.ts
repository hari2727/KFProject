import { Component, OnInit, OnDestroy, Input, Output, OnChanges, EventEmitter, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { KfTarcSkillsFilterItem, KfTarcSkillCompareSections, KfTarcFiltersChange, KfTarcMarketSkillsService } from '../../../../../services/kftarc-market-skills.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { Dropdown } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { KfLoadingControllerService } from '@kf-products-core/kfhub_lib';

interface FilterState {
    isMarketFilter: boolean;
    isIndustryFilter: boolean;
    isPeerFilter: boolean;
    showIndustries: boolean;
    showPeers: boolean;
    skillsFilterLabel: string;
    industryFilter: string;
    peersFilter: string;
    selectedSkillsCompareSection: KfTarcSkillCompareSections;
    selectedSkillFilter: KfTarcSkillsFilterItem[];
    peersFilterData?: KfTarcSkillsFilterItem[];
}

@Component({
    selector: 'kftarc-skill-filter',
    templateUrl: './kftarc-skill-filter.component.html',
    styleUrls: ['./kftarc-skill-filter.component.scss'],
})
export class KfTarcSkillFilterComponent implements OnInit, OnDestroy, OnChanges, FilterState {
    public minCharCount = 2;

    private stateBackup?: FilterState;

    public isMarketFilter = true;
    public isIndustryFilter = false;
    public isPeerFilter = false;
    public showIndustries = false;
    public showPeers = false;
    public skillsFilterLabel: string;
    public industryFilter = '';
    public peersFilter = '';
    public selectedSkillFilter: KfTarcSkillsFilterItem[] = [];
    public selectedSkillsCompareSection: KfTarcSkillCompareSections = 'market';
    public peersFilterData?: KfTarcSkillsFilterItem[];

    public isChanged = false;
    public isOpen = false;
    public peersFilter$ = new Subject<string>();

    @Input()
    public industriesFilterData?: KfTarcSkillsFilterItem[];

    @Output()
    public filterChange = new EventEmitter<KfTarcFiltersChange>();

    @ViewChild(Dropdown, { static: true }) dd: Dropdown;

    private subs: Subscription[] = [];

    constructor(
        public translate: TranslateService,
        public skillsService: KfTarcMarketSkillsService,
        public loadingService: KfLoadingControllerService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        const sub = this.peersFilter$.pipe(
            filter(item => item.length >= this.minCharCount),
            distinctUntilChanged(),
            debounceTime(250),
            switchMap(search => this.skillsService.getPeersFilterData(search)),
        ).subscribe((peersFilterData) => {
            this.peersFilterData = _.isEmpty(peersFilterData) ? null : peersFilterData;
            if (this.isPeerFilter && this.selectedSkillFilter && this.peersFilterData) {
                this.syncFilterItems(this.peersFilterData);
            }
        });
        this.subs.push(sub);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.industriesFilterData && this.industriesFilterData) {
            this.industryFilter = '';
            this.peersFilter = '';
            this.selectedSkillFilter = [];
            this.selectedSkillsCompareSection = 'market';
            this.updateSkillsFilterLabel();
            this.updateFilters();
        }
    }

    ngOnDestroy() {
        for (const sub of this.subs) {
            sub.unsubscribe();
        }
    }

    backupState() {
        this.stateBackup = _.cloneDeep(_.pick(this, [
            'isMarketFilter',
            'isIndustryFilter',
            'isPeerFilter',
            'showIndustries',
            'showPeers',
            'skillsFilterLabel',
            'industryFilter',
            'peersFilter',
            'selectedSkillFilter',
            'selectedSkillsCompareSection',
            'peersFilterData',
        ]));
    }

    restoreState() {
        _.assign(this, _.cloneDeep(this.stateBackup));
        for (const item of _.filter(_.concat(this.industriesFilterData, this.peersFilterData), itm => itm != null)) {
            item.isSelected = false;
        }
        for (const item of this.selectedSkillFilter || []) {
            item.isSelected = true;
        }
        if (this.isIndustryFilter) {
            this.syncFilterItems(this.industriesFilterData);
        } else if (this.isPeerFilter) {
            this.syncFilterItems(this.peersFilterData);
        }
        this.isChanged = false;
    }

    openFilterDropdown(section: KfTarcSkillCompareSections) {
        if (section === 'industry') {
            if (!this.isIndustryFilter && !this.showIndustries || this.isIndustryFilter && this.showIndustries ||
                this.isIndustryFilter && !this.showIndustries) {
                this.showIndustries = !this.showIndustries;
            }
            this.isIndustryFilter = true;
            this.isPeerFilter = false;
        } else if (section === 'peers') {
            if (!this.isPeerFilter && !this.showPeers || this.isPeerFilter && this.showPeers ||
                this.isPeerFilter && !this.showPeers) {
                this.showPeers = !this.showPeers;
            }
            this.isPeerFilter = true;
            this.isIndustryFilter = false;
        }
        this.isMarketFilter = false;
        if (section !== this.selectedSkillsCompareSection || this.selectedSkillFilter.length === 0) {
            this.isChanged = false;
        } else {
            this.isChanged = true;
        }
    }

    updateSkillsFilter(section: KfTarcSkillCompareSections, item?: KfTarcSkillsFilterItem) {
        this.isChanged = true;
        if (section !== this.selectedSkillsCompareSection) {
            for (const itm of this.selectedSkillFilter) {
                itm.isSelected = false;
            }
            this.selectedSkillFilter = [];
            this.selectedSkillsCompareSection = section;
        }
        if (item) {
            item.isSelected = !item.isSelected;
            const selectedItemIdx = _.findIndex(this.selectedSkillFilter, itm => itm.id === item.id);
            if (selectedItemIdx >= 0 && !item.isSelected) {
                this.selectedSkillFilter.splice(selectedItemIdx, 1);
            } else if (selectedItemIdx < 0 && item.isSelected) {
                // force single select
                if (!_.isEmpty(this.selectedSkillFilter) &&
                    (this.selectedSkillsCompareSection === 'industry' || this.selectedSkillsCompareSection === 'peers')
                ) {
                    _.forEach(this.selectedSkillFilter, flt => flt.isSelected = false);
                    this.selectedSkillFilter = [];
                }
                this.selectedSkillFilter.push(item);
            }
        }
        if (this.selectedSkillFilter.length === 0) {
            this.selectedSkillsCompareSection = 'market';
        }
        this.isPeerFilter = false;
        this.isIndustryFilter = false;
        this.isMarketFilter = false;
        if (this.selectedSkillsCompareSection === 'industry') {
            this.isIndustryFilter = true;
        } else if (this.selectedSkillsCompareSection === 'peers') {
            this.isPeerFilter = true;
        } else {
            this.isMarketFilter = true;
        }
    }

    trackById(item: any) {
        return item.id;
    }

    updateSkillsFilterLabel() {
        switch (this.selectedSkillsCompareSection) {
            case 'market':
                this.skillsFilterLabel = this.translate.instant('pm.overallMarket');
                break;
            case 'industry':
                this.skillsFilterLabel =
                    `${this.translate.instant('pm.industry')}: ${this.selectedSkillFilter[0].name}`;
                break;
            case 'peers':
                this.skillsFilterLabel = `${this.translate.instant('pm.peers')}: ${this.selectedSkillFilter[0].name}`;
                break;
        }
    }

    updateFilters() {
        this.isChanged = false;
        const playload: KfTarcFiltersChange = {
            selectedSkillsCompareSection: this.selectedSkillsCompareSection,
            selectedSkillFilter: this.selectedSkillFilter,
        };
        this.updateSkillsFilterLabel();
        this.backupState();
        this.filterChange.next(playload);
        this.dd.hide();
    }

    industryFilterChange() {
        const regex = this.industryFilter ? this.makeRegex(this.industryFilter) : null;
        if (this.industriesFilterData) {
            this.updateHidden(this.industriesFilterData, regex);
        }
    }

    peersFilterChange() {
        const search = this.peersFilter ? this.peersFilter.trim() : '';
        this.peersFilter$.next(search);
    }

    private makeRegex(str: string = '') {
        return new RegExp(_.escapeRegExp(str.trim()), 'i');
    }

    private updateHidden(items: KfTarcSkillsFilterItem[], regex?: RegExp) {
        for (const item of items) {
            if (regex) {
                item.isHidden = item.name.search(regex) === -1;
            } else {
                item.isHidden = false;
            }
        }
    }

    // the list of peer and backups are dynamic, so if there are fresh
    // filter list items, we need to replace matching ones with
    // currently filtered by ones, since Ui is mutatuing items
    // directly
    private syncFilterItems(filterData: KfTarcSkillsFilterItem[]) {
        const matchingItems = _.intersectionBy(this.selectedSkillFilter, filterData, 'id');
        for (const [idx, item] of _.toPairs(filterData)) {
            const matchingItem = _.find(matchingItems, itm => itm.id === item.id);
            if (matchingItem) {
                filterData[idx] = matchingItem;
            }
        }
    }

    public openChange(isOpen: boolean) {
        this.isOpen = isOpen;
        if (!isOpen) {
            this.restoreState();
        }
    }
}

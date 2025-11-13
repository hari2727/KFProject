import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { KfTarcIGService } from '../../../services/kftarc-sp-ig.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';
import { Subscription, Subject, from } from 'rxjs';
import { concatMap, finalize, takeUntil } from 'rxjs/operators';
import { KfLoadingControllerService, KfTranslationService, environment, KfStorageService, KfAuthService, KfProgressChartConfig, KfGrowlService, KfGrowlMessageType } from '@kf-products-core/kfhub_lib';
import { InterviewGuideTypes, KfBCRecords, KfBCPage, AllRecordLists, buildURL, split, RecordLists, DownloadResponse, RequestData } from '../../../models/kftarc-sp-interview-guide.model';
import { KfThclSPSharedService, fileReportType, IgDownloadType } from '@kf-products-core/kfhub_thcl_lib';
@Component({
    selector: 'kftarc-sp-interview-guide',
    templateUrl: './kftarc-sp-interview-guide.component.html',
    styleUrls: ['./kftarc-sp-interview-guide.component.scss']
})


export class KftarcSpInterviewGuideComponent implements OnInit, OnDestroy {
    @Input() id: number;

    @Input() url: string;

    @Input() compIds: string[] = [];

    @Input() bcRecords: KfBCPage[];

    @Input() skillsRecords: KfBCPage[];

    @Input() visible = false;

    @Input() spName: string;

    @Output() visibleChange = new EventEmitter<boolean>();

    public splits: split[] = [
        { counts: 2 },
        { counts: 3 },
        { counts: 4 },
        { counts: 5 },
        { counts: 6 }
    ];

    public master = null;

    public selectedSplit?: split;

    public selectedSplitValue: number;

    public selectedTabId = 0;

    public fg: UntypedFormGroup;

    public igType = InterviewGuideTypes.MASTER;

    public igFormat = InterviewGuideTypes.PDF;

    subs: Subscription[] = [];

    splitBCRecordsList: KfBCPage[];

    splitSkillsRecordsList: KfBCPage[];

    allSkillsSelected: { [tabId: string]: boolean } = {};

    allBCSelected: { [tabId: string]: boolean } = {};

    clmgTalentArchitectConfig = environment().clmgTalentArchitectConfig;

    public languages: { id: string; name: string }[] = [];

    private destroy$ = new Subject<void>();

    public recordLists: AllRecordLists;

    public hasSelectedRecords = false;

    public categories = [
        {
            label: this.translationService.get('pm.skills'),
            isSelected: true,
        },
        {
            label: this.translationService.get('pm.behavioralCompetencies'),
            isSelected: true,
        }
    ];

    public enableSkill = true;

    public enableBehavioral = true;

    public showTabs = true;

    public tabs: { header: string; content: string }[] = [];

    public searchTerm = '';

    public interviewsCategories = false;

    public firstStepSelected = false;

    public secondStepSelected = false;

    public thirdStepSelected = false;

    public totalBehaviouralComps = 0;

    public totalSkills = 0;

    public checkedSkills = 0;

    public checkedBc = 0;

    public reviewPage = false;

    public splitBarChartData = 1;

    public editButtonClicked = false;

    public openCloseModal = false;

    public barConfigSplit: KfProgressChartConfig = {
        width: window.innerWidth - 250,
        height: 5,
        color: '#007BC7',
        backdropColor: '#E5E5E5',
        split: 2
    };

    public requestsDataPayload: RequestData[] = [];

    constructor(
        private igService: KfTarcIGService,
        private spinner: KfLoadingControllerService,
        public translationService: KfTranslationService,
        public storageService: KfStorageService,
        public authService: KfAuthService,
        private http: HttpClient,
        private growlService: KfGrowlService,
        private spShared: KfThclSPSharedService,
    ) {
        this.fg = new UntypedFormGroup({
            radio: new UntypedFormControl(),
            dd: new UntypedFormControl(),
            language: new UntypedFormControl(),
            igFormat: new UntypedFormControl()
        });
    }

    public ngOnInit(): void {
        this.languages = this.clmgTalentArchitectConfig?.iglanguages;
        this.splitSkillsRecordsList = this.skillsRecords ? JSON.parse(JSON.stringify(this.skillsRecords)) : [];
        this.splitBCRecordsList = this.bcRecords ? JSON.parse(JSON.stringify(this.bcRecords)) : [];
        this.recordLists = {
            skills: {
                originalRecords: JSON.parse(JSON.stringify(this.skillsRecords)),
                splitRecords: this.splitSkillsRecordsList,
            },
            bc: {
                originalRecords: JSON.parse(JSON.stringify(this.bcRecords)),
                splitRecords: this.splitBCRecordsList,
            },
        };
        const sub = this.fg.valueChanges.subscribe((data) => {
            if (data.dd != null) {
                this.selectedSplit = _.find(this.splits, s => s.counts === data.dd);
            } else {
                this.selectedSplit = null;
            }
            this.igType = data.radio;
            this.igFormat = data.igFormat;
        });
        this.subs.push(sub);
        this.resetForm();
        // this.firstStepSelected = true;
        this.fg.controls.igFormat.setValue(InterviewGuideTypes.PDF);
    }

    public ngOnDestroy(): void {
        this.languages = null;
        this.splitSkillsRecordsList = null;
        this.splitBCRecordsList = null;
        this.resetForm();
        this.resetSteps();
        this.recordLists = {
            skills: {
                originalRecords: null,
                splitRecords: null,
            },
            bc: {
                originalRecords: null,
                splitRecords: null,
            },
        };

        for (const sub of this.subs) {
            sub.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    public resetForm(): void {
        this.fg.controls.dd.setValue(2);
        this.fg.controls.radio.setValue(null);
        this.fg.controls.language?.setValue(undefined);
        this.fg.controls.igFormat.setValue(null);
        this.firstStepSelected = false;
        this.resetSteps();
    }

    public visibleHandler($event): void {
        this.visibleChange.next($event);
    }

    public openCloseModalFn(): void {
        this.openCloseModal = true;
    }

    public close(): void {
        this.openCloseModal = false;
        this.visible = false;
        this.visibleChange.next(false);
        this.spinner.spinnerClose();
        this.resetSteps();
        this.resetForm();
        this.interviewsCategories = false;
        this.reviewPage = false;
        this.splitBarChartData = 1;
        this.fg.controls.igFormat.setValue(InterviewGuideTypes.PDF);
        this.uncheckSelectAll(InterviewGuideTypes.Skills, this.recordLists.skills);
        this.uncheckSelectAll(InterviewGuideTypes.BehavioralCompetency, this.recordLists.bc);
        this.recordLists = {
            skills: {
                originalRecords: null,
                splitRecords: null,
            },
            bc: {
                originalRecords: null,
                splitRecords: null,
            },
        };
    }

    private uncheckSelectAll(type, records: RecordLists): void {
        // find the tab with the search term
        if(records.originalRecords && records.originalRecords.length > 0) {
            records.originalRecords.forEach((record, index) => {
                if(type === InterviewGuideTypes.Skills) {
                    records.splitRecords[index].bcCheckBox = false;
                    records.originalRecords[index].bcCheckBox = false;
                }else{
                    records.splitRecords[index].skillCheckBox = false;
                    records.originalRecords[index].skillCheckBox = false;
                }
            });
        }
    }

    public download(): void {
        const result = this.processRecords(this.selectedSplitValue);

        if ((result?.bc?.length || result?.skills?.length)) {
            const bcList = result.bc || []; 
            const skillsList = result.skills || [];        
            for (let i = 0; i < this.selectedSplitValue; i++) {
                this.callDownloadIGAPI(bcList[i], skillsList[i], i);
            }
            this.reviewPage = true;
        }
        
    }  

    public selectCategories(category, skillOrBc): void {
        this.hasSelectedRecords = this.checkAnySplitHasSelected(this.recordLists, this.selectedSplitValue);
        if (this.interviewsCategories && !this.reviewPage) {
            if(skillOrBc === 'skills') {
                category.skillCheckBox = !category.skillCheckBox;
                this.enableSkill = category.skillCheckBox;
                this.enableSkill ?  '' : this.toggleSelectAll(false, InterviewGuideTypes.Skills);
                const allSelected = this.recordLists.skills.originalRecords[this.selectedTabId].records.every((record: any) => record.selected === true);
                this.allSkillsSelected = { ...this.allSkillsSelected, [this.selectedTabId]: allSelected };
            }else{
                category.bcCheckBox = !category.bcCheckBox;
                this.enableBehavioral = category.bcCheckBox;
                this.enableBehavioral ? '' : this.toggleSelectAll(false, InterviewGuideTypes.BehavioralCompetency);
                const allSelected2 = this.recordLists.bc.originalRecords[this.selectedTabId].records.every((record: any) => record.selected === true);
                this.allBCSelected = { ...this.allBCSelected, [this.selectedTabId]: allSelected2 };
            }
        }
    }

    public checkAnySplitHasSelected = (recordLists: AllRecordLists, splitValue: number): boolean => {
        // Iterate through the first `split` ranges
        for (let i = 0; i < splitValue; i += 1) {
            const isBCSelected = recordLists.bc.originalRecords[i]?.records.some((record) => record.selected);
            const isSkillsSelected = recordLists.skills.originalRecords[i]?.records.some((record) => record.selected);

            // If neither BC nor Skills has a selected record in this split, return false
            if (!isBCSelected && !isSkillsSelected) {
                return false;
            }
        }

        // If all splits are valid, return true
        return true;
    };


    public next(): void {
        if (this.fg.controls.radio.value === InterviewGuideTypes.MASTER) {
            this.showTabs = true;
            this.selectedTabId = 0;
        } else if (this.fg.controls.radio.value === InterviewGuideTypes.SPLIT) {
            this.showTabs = true;
        }
        if (this.thirdStepSelected) {
            this.interviewsCategories = true;
            this.splitBarChartData = 2;
        }
        this.totalBehaviouralComps = this.recordLists.bc.originalRecords[this.selectedTabId]?.records?.length || 0;
        this.totalSkills = this.recordLists.skills.originalRecords[this.selectedTabId]?.records?.length || 0;
    }

    public back(): void {
        if (this.reviewPage) {
            this.reviewPage = false;
            return;
        }
        this.tabSelection(0);
        this.removeSearchTerm('bc', this.recordLists.bc);
        this.removeSearchTerm('skills', this.recordLists.skills);
        this.selectedTabId = 0;
        this.interviewsCategories = false;
        this.thirdStepSelected = true;
        this.splitBarChartData = 1;
    }

    public splitValueFunction(item: number): void {
        this.resetSteps();
        this.firstStepSelected = true;
        this.secondStepSelected = true;
        this.fg.controls.language?.setValue(undefined);
        this.selectedSplitValue = item;
        this.tabs = Array.from({ length: item }, (v, i) => ({
            header: (i + 1).toString().padStart(2, '0'), // Generates headers like '01', '02', etc.
            id: i,
            content: `Content ${i + 1}`
        }));
        this.checkedSkills = this.recordLists.skills.originalRecords[this.selectedTabId]?.records?.filter((record) => record.selected).length || 0;
        if (this.recordLists?.bc?.originalRecords?.[this.selectedTabId]) {
            this.checkedBc = this.recordLists.bc.originalRecords[this.selectedTabId].records.filter((record) => record.selected).length;
        } else {
            this.checkedBc = 0;
        }
        this.hasSelectedRecords = this.checkAnySplitHasSelected(this.recordLists, this.selectedSplitValue);
    }

    public tabSelection(tabId: number): void {
        this.selectedTabId = tabId;
        if (this.recordLists?.bc?.originalRecords?.[this.selectedTabId]) {
            this.totalBehaviouralComps = this.recordLists.bc.originalRecords[this.selectedTabId].records.length;
            this.checkedBc = this.recordLists.bc.originalRecords[this.selectedTabId].records.filter((record) => record.selected).length;
        }
        if (this.recordLists?.skills?.originalRecords?.[this.selectedTabId]) {
            this.totalSkills = this.recordLists.skills.originalRecords[this.selectedTabId].records.length;
            this.checkedSkills = this.recordLists.skills.originalRecords[this.selectedTabId].records.filter((record) => record.selected).length;
        }
    }

    // Filter records based on the search term

    public filteredRecords(type: string, searchName?: string, index?: number): void {
        const { originalRecords, splitRecords } = this.recordLists[type];
        if(index !== undefined) {
            this.selectedTabId = index;
        }
        const tabData = originalRecords[this.selectedTabId].records; // Access tab-specific data
        if (searchName) {
            tabData.searchTerm = searchName; // Update search term for the tab
        }else{
            tabData.searchTerm = '';
        }
        const searchTerm = tabData.searchTerm?.toLowerCase() || '';
        // Filter and update splitRecords
        splitRecords[this.selectedTabId].records = tabData.filter((record: any) =>
            record.name.toLowerCase().includes(searchTerm)
        );
        // Check if all records in the current tab are selected
        // Assign the result to a boolean property specific to the selected tab
        if (type === InterviewGuideTypes.Skills) {
            this.splitSkillsRecordsList = splitRecords;
            const allSelected = this.recordLists.skills.originalRecords[this.selectedTabId].records.every((record: any) => record.selected === true);
            this.allSkillsSelected = { ...this.allSkillsSelected, [this.selectedTabId]: allSelected };
        } else {
            this.splitBCRecordsList = splitRecords;
            const allSelected = this.recordLists.bc.originalRecords[this.selectedTabId].records.every((record: any) => record.selected === true);
            this.allBCSelected = { ...this.allBCSelected, [this.selectedTabId]: allSelected };
        }
    }

    public onChangeSearch(name: string,  searchName): void {
        this.filteredRecords(name, searchName);
    }

    // Toggle "Select All" functionality
    public toggleSelectAll(checktoggle: boolean, skillsorBc): void {
        const isChecked = checktoggle;
        if(skillsorBc === InterviewGuideTypes.Skills) {
            this.splitSkillsRecordsList[this.selectedTabId].records.forEach((record) => (record.selected = isChecked));
            this.recordLists.skills.originalRecords[this.selectedTabId].records.forEach((record) => (record.selected = isChecked));
        }else{
            this.splitBCRecordsList[this.selectedTabId].records.forEach((record) => (record.selected = isChecked));
            this.recordLists.bc.originalRecords[this.selectedTabId].records.forEach((record) => (record.selected = isChecked));
        }
        this.calculateCheckedNumber(skillsorBc);
    }

    public logSelectedRecords(checktoggle: boolean, skillsorBc, index): void {
        if(skillsorBc === InterviewGuideTypes.Skills) {
            this.splitSkillsRecordsList[this.selectedTabId].records[index].selected = checktoggle;
            if(this.splitSkillsRecordsList[this.selectedTabId].searchTerm === '') {
                this.recordLists.skills.originalRecords[this.selectedTabId].records[index].selected = checktoggle;
            }
            const allSelected = this.recordLists.skills.originalRecords[this.selectedTabId].records.every((record: any) => record.selected === true);
            this.allSkillsSelected = { ...this.allSkillsSelected, [this.selectedTabId]: allSelected };
        }else{
            this.splitBCRecordsList[this.selectedTabId].records[index].selected = checktoggle;
            if(this.splitBCRecordsList[this.selectedTabId].searchTerm === '') {
                this.recordLists.bc.originalRecords[this.selectedTabId].records[index].selected = checktoggle;
            }
            const allSelected = this.recordLists.bc.originalRecords[this.selectedTabId].records.every((record: any) => record.selected === true);
            this.allBCSelected = { ...this.allBCSelected, [this.selectedTabId]: allSelected };
        }
        this.calculateCheckedNumber(skillsorBc);
    }

    private calculateCheckedNumber(skillsorBc): void {
        if(skillsorBc === InterviewGuideTypes.Skills) {
            this.checkedSkills = this.recordLists.skills.originalRecords[this.selectedTabId].records.filter((record) => record.selected).length;
        }else{
            this.checkedBc = this.recordLists.bc.originalRecords[this.selectedTabId].records.filter((record) => record.selected).length;
        }
        this.hasSelectedRecords = this.checkAnySplitHasSelected(this.recordLists, this.selectedSplitValue);
    }

    public enableGuideFormatStep(splitOrMaster): void {
        if(!this.reviewPage) {
            this.resetSteps();
            this.fg.controls.dd.setValue(2);
            this.splitSkillsRecordsList = this.skillsRecords ? JSON.parse(JSON.stringify(this.skillsRecords)) : null;
            this.splitBCRecordsList = this.bcRecords ? JSON.parse(JSON.stringify(this.bcRecords)) : null;

            this.recordLists = {
                skills: {
                    originalRecords: this.skillsRecords ? JSON.parse(JSON.stringify(this.skillsRecords)) : {},
                    splitRecords: this.splitSkillsRecordsList ? this.splitSkillsRecordsList : null,
                },
                bc: {
                    originalRecords: this.bcRecords ? JSON.parse(JSON.stringify(this.bcRecords)) : {},
                    splitRecords: this.splitBCRecordsList ? this.splitBCRecordsList : null,
                },
            };
            this.fg.controls.language?.setValue(undefined);
            this.igType = splitOrMaster;
            this.fg.controls.igFormat.setValue(InterviewGuideTypes.PDF);
            let splitVal = 1;
            splitOrMaster === InterviewGuideTypes.MASTER ? splitVal = 1 : splitVal = 2;
            this.splitValueFunction(splitVal);
            this.enableLanguageSelectionStep();
            this.firstStepSelected = true;
            this.editButtonClicked = false;
            const totalTabs = this.recordLists.skills?.splitRecords?.length || this.recordLists.bc?.splitRecords?.length || 0;
            for (let i = 0; i < totalTabs; i += 1) {
                this.allSkillsSelected[i] = false;
                this.allBCSelected[i] = false;
            }
        }
    }

    public enableLanguageSelectionStep(): void {
        if(this.fg.controls.igFormat.value !== null && !this.reviewPage) {
            this.firstStepSelected = true;
            this.secondStepSelected = true;
            this.thirdStepSelected = false;
            this.fg.controls.language?.setValue(undefined);
            
        }
    }

    public enableCategorySelectionStep(): void {
        const isLanguageSelected = this.fg.controls.language.value !== null;
        this.thirdStepSelected = isLanguageSelected;
        this.enableBehavioral = isLanguageSelected;
        this.enableSkill = isLanguageSelected;
    }

    private unSelectAllCategories(skillsorBc): void {

        if (skillsorBc === InterviewGuideTypes.Skills) {
            this.splitSkillsRecordsList = this.recordLists.skills.originalRecords || [];
            this.checkedSkills = 0;
        } else {
            this.splitBCRecordsList = this.recordLists.bc.originalRecords || [];
            this.checkedBc = 0;
        }
    }

    private resetSteps(): void {
        this.thirdStepSelected = false;
        this.secondStepSelected = false;
        if(!this.editButtonClicked) {
            this.enableBehavioral = false;
            this.enableSkill = true;
            this.hasSelectedRecords = false;
        }
        this.reviewPage = false;

        this.unSelectAllCategories(InterviewGuideTypes.Skills);
        this.unSelectAllCategories(InterviewGuideTypes.BehavioralCompetency);
    }

    public review(): void {
        window.scrollTo(0, 0);
        this.reviewPage = true;
        this.removeSearchTerm('bc', this.recordLists.bc);
        this.removeSearchTerm('skills', this.recordLists.skills);
        this.selectedTabId = 0;
    }

    private removeSearchTerm(type, records: RecordLists): void {
        // find the tab with the search term
        if (records?.splitRecords && records.splitRecords.length > 0) {
            records.splitRecords.forEach((record, index) => {
                records.splitRecords[index].searchTerm = '';
                this.filteredRecords(type, records.splitRecords[index].searchTerm, index);
            });
        }

    }


    public processRecords = (splitValue: number) => {
        const selectedRecordIds = {
            bc: this.recordLists.bc.splitRecords
                ? this.recordLists.bc.splitRecords
                    .slice(0, splitValue) // Limit to the first `split` arrays
                    .map((page: KfBCPage) =>
                        page.records
                            .filter((record: KfBCRecords) => record.selected)
                            .map((record: KfBCRecords) => record.id) // Extract only `id`
                    )
                : [],
            skills: this.recordLists.skills.splitRecords
                ? this.recordLists.skills.splitRecords
                    .slice(0, splitValue) // Limit to the first `split` arrays
                    .map((page: KfBCPage) =>
                        page.records
                            .filter((record: KfBCRecords) => record.selected)
                            .map((record: KfBCRecords) => record.id) // Extract only `id`
                    )
                : [],
        };

        return selectedRecordIds;
    };

    public callDownloadIGAPI(bcRecord: number[], skillsRecord: number[], splitIndex: number): void {
        const  storedSelectedCountry = this.storageService.getItem('_selectedCountry');
        const storedCountryId = storedSelectedCountry ? JSON.parse(storedSelectedCountry)?.id : 225;
        const data = {
            successProfileId: this.id,
            userId: this.authService.UserId,
            clientId : this.authService.getSessionInfo()?.User?.ClientId,
            locale: this.fg.controls.language?.value,
            countryId: Number(storedCountryId),
            format: this.fg.controls.igFormat.value,
            requestOnly: false,
            skillIds: skillsRecord,
            competencyIds: bcRecord,
            exportName: `${this.spName}_${this.id}_${splitIndex + 1}_IG.${this.fg.controls.igFormat.value}`,
            fileName: `${this.spName}_${this.id}_${splitIndex + 1}_IG`,
            refOnly: true,
        };

        this.requestsDataPayload.push(data);

        if(this.selectedSplitValue === this.requestsDataPayload.length) {
            const downloadType = this.selectedSplitValue > 1 ? IgDownloadType.SPLIT : IgDownloadType.MASTER;
            if (downloadType === IgDownloadType.SPLIT) {
                const message = {
                    severity: 'success',
                    summary: this.translationService.get('pm.splitExportSummary'),
                    detail: this.translationService.get('lib.export.default.start.detail'),
                    life: 12000,
                };
                localStorage.setItem(`_shared_message.${performance.now()}`, JSON.stringify(message));
            }
            for (const req of this.requestsDataPayload) {
                this.spShared.downloadInterviewGuideReport('ig_single_export', req, downloadType);
            }
            this.requestsDataPayload = [];
            setTimeout(() => {
                this.close();
            }, 1500);
        }
    }
    public edit(): void {
        this.reviewPage = false;
        this.interviewsCategories = false;
        this.splitBarChartData = 1;
        this.selectedTabId = 0;
        this.editButtonClicked = true;
    }

}

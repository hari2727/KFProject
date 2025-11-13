import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'kftarc-jd-section-competency',
    templateUrl: './kftarc-jd-section-competency.component.html',
    styleUrls: ['./kftarc-jd-section-competency.component.scss'],
})
export class KfTarcJdSectionCompetencyComponent implements OnInit, OnChanges {
    @Input() public title: string;
    @Input() public sectionName: string;
    @Input() public isDragEnabled = false;
    @Input() public isEditable = false;
    @Input() public sendValue = false;
    @Input() public showHeader = true;
    @Input() public formReInit = false;
    @Input() public competency: any[];
    @Input() public section: any[];
    @Input() public technologySection: any[];
    @Output() itemChanges: EventEmitter<any> = new EventEmitter<any>();
    @Output() competencyCollectionChange: EventEmitter<any> = new EventEmitter<any>();
    public form: UntypedFormGroup = null;
    public data: any[][];
    public isToggle = false;
    public hideForTasks = false;
    @Input() showHideSection: any = {};
    @Output() sectionShowHide: EventEmitter<any> = new EventEmitter<any>();
    @Output() removedItems: EventEmitter<any> = new EventEmitter<any>();
    removedIds = [];

    constructor(private formBuilder: UntypedFormBuilder) {
        this.form = this.formBuilder.group({
            competency: this.formBuilder.array([]),
        });
        if (this.isEditable) {
            this.form.enable();
        } else {
            this.form.disable();
        }
    }

    ngOnInit(): void {
        this.initFormLoad();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('formReInit' in changes) {
            this.initFormLoad();
            this.removedIds = [];
        } else {
            this.checkShowHideTitle();
        }
    }

    public checkShowHideTitle() {
        if (this.sectionName === 'tasks' && this.showHideSection) {
            this.showHideSection.hideSubCategoryNames = false;
            // eslint-disable-next-line no-self-assign
            this.showHideSection.hideSection = this.showHideSection.hideSection;
            this.hideForTasks = true;
        } else if (this.sectionName === 'tasks' && !this.showHideSection) {
            this.showHideSection.hideSubCategoryNames = false;
            this.showHideSection.hideSection = true;
        } else if (this.sectionName !== 'tasks' && this.showHideSection === undefined) {
            this.isToggle = false;
            this.showHideSection = {};
        } else if (this.sectionName !== 'tasks' && (this.showHideSection === null || this.showHideSection === '')) {
            this.showHideSection.hideSection = false;
            this.showHideSection.hideSubCategoryNames = false;
        }
    }

    public initFormLoad() {
        this.isToggle = this.isEditable;
        this.data = [this.competency];
        const formGroups = _.map(this.data, descriptions =>
            _.map(descriptions, description =>
                this.formBuilder.group({
                    name: { disabled: false, value: '' },
                    description: { disabled: false, value: '' },
                    id: { disabled: false, value: '' },
                })
            )
        );

        this.form.controls[this.sectionName] = new UntypedFormArray(_.nth(formGroups, 0));

        const formData = {};
        formData[this.sectionName] = _.nth(this.data, 0);
        this.form.reset(formData);
        this.checkShowHideTitle();
    }

    public showItem(item) {
        return this.isEditable && !this.removedIds.find(id => item.value.id === id);
    }

    public toggleTitle($event): void {
        this.showHideSection.hideSubCategoryNames = $event;
        this.sectionShowHide.emit({ sectionName: this.sectionName, showHideSection: this.showHideSection });
    }

    public toggleSection($event): void {
        this.showHideSection.hideSection = $event;
        this.sectionShowHide.emit({ sectionName: this.sectionName, showHideSection: this.showHideSection });
    }

    public getCompetencyControls(sectionName: string): AbstractControl[] {
        const formArray = <UntypedFormArray>this.form.controls[sectionName];
        return formArray.controls;
    }

    public onRemoveAction(item) {
        const index = item.value.id;
        this.removedIds.push(index);
        let filteredSubCategories;
        let technologyFiltered = false;
        if (this.sectionName === 'technology' || this.sectionName === 'tools') {
            filteredSubCategories = this.section.filter(it => !this.removedIds.includes(+it.code));
        } else if (this.sectionName === 'technical') {
            const isSubCategoryInList = this.section.find(subCategory => subCategory.id === item.value.id);
            if (isSubCategoryInList) {
                filteredSubCategories = this.section.filter(it => !this.removedIds.includes(it.id));
            } else {
                filteredSubCategories = this.technologySection.filter(it => !this.removedIds.includes(+it.code));
                technologyFiltered = true;
            }
        } else {
            filteredSubCategories = this.section.filter(it => !this.removedIds.includes(it.id));
        }
        const sectionName = this.sectionName;
        const event = {
            index,
            sectionName,
            filteredSubCategories,
            technologyFiltered,
            action: 'remove',
        };
        this.competencyCollectionChange.emit({ event, sectionName });
        this.itemChanges.emit(event);
    }

    public onItemChanges(newValue, sectionName: string, item) {
        const index = item.value.id;
        this.itemChanges.emit({ newValue, sectionName, index });
    }

    public onCompetencyCollectionChange(event: any, sectionName: string) {
        this.competencyCollectionChange.emit({ event, sectionName });
    }
}

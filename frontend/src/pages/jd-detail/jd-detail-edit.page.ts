import * as _ from 'lodash';
import * as hash from 'object-hash';
import { MessageService } from 'primeng/api';
import {
    BehaviorSubject,
    combineLatest, forkJoin, forkJoin as observableForkJoin, Observable, Observer, Subject, Subscription,
    timer
} from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    KfAuthService, KfIdleService, KfIJobDescription, KfISuccessProfile, JOB_TITLE_MAX_LENGTH
} from '@kf-products-core/kfhub_lib';
import { SecCodeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import {
    UniversalCompanyDesc
} from '../../app/modules/components/macro/job-description/search/jd-search.model';
import {
    KfTarcJobDescriptionService
} from '../../app/modules/services/kftarc-job-description.service';
import {
    actionCertsSaveUpdateMany, actionMoveCert, actionRemoveCert, actionSectionChange, actionUpsertCert, actionUpsertCerts, actionClearCerts
} from './certs.actions';
import { selectCerts, selectCertsLoadStatus } from './certs.selectors';
import { JdDetailBase } from './jd-detail-base.page';
import {
    actionJobFieldValueChange, actionMoveFlattenListItem, actionMoveSubCtg, actionRemoveItem,
    actionRemoveSubCtg, actionSectionItemValueChange, actionSectionItemValueRemove,
    actionUpdateSubCtg, actionUpdateSubCtgs
} from './jd-detail.actions';
import { Cert, SectionModel } from './jd-detail.model';
import { selectJd } from './jd-detail.selectors';
import { JdDetailService } from './jd-detail.service';
import { State } from './jd-detail.state';
import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';

@Component({
    selector: 'kftarc-jd-detail-edit',
    templateUrl: './jd-detail-edit.page.html',
    styleUrls: ['./jd-detail-edit.page.scss'],
    providers: [],
})
export class JdDetailEditPage extends JdDetailBase  implements OnDestroy, OnInit {
    job: KfIJobDescription;
    changedJob: KfIJobDescription;

    changedCertSection: { certs: Cert[]; hideSection: boolean; hideNames: boolean };
    certsSectionBackupFromForm: { includeSection: boolean; includeSubCategoryNames: boolean; certs: any };

    secCodeEnum = SecCodeEnum;

    private translations: any = {};
    private subs: Subscription[] = [];

    form: UntypedFormGroup;

    readonly inputChangeDelay = 400;

    isNewJd = false;
    isCopyJd = false;
    showDiscardAllModal = false;
    showSaveAllModal = false;
    showLeavingModal = false;
    navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
    // showLeavingNewModal: boolean;
    parentSP: KfISuccessProfile;
    isPristine = true;

    private jobSaved = false;
    savedJob$ = new Subject<number>();

    public readonly jobTitleMaxLength = JOB_TITLE_MAX_LENGTH;

    constructor(
        private fb: UntypedFormBuilder,
        private route: ActivatedRoute,
        private jobDescriptionService: KfTarcJobDescriptionService,
        private advGrowlService: MessageService,
        private translate: TranslateService,
        public authService: KfAuthService,
        public router: Router,
        private location: Location,
        public idleService: KfIdleService,
        private store: Store<State>,
        private jdDetailService: JdDetailService,
    ) {
        super();
    }

    ngOnInit() {
        this.idleService.stopIdleWatch();
        this.idleService.startKeepAlive();

        const keys = ['Error', 'SaveSuccess'];
        const translationObservers = _.map(keys, key => this.translate.get(`pm.jobDescription${key}`));
        const sub1 = observableForkJoin(translationObservers).subscribe(translations =>
            _.forEach(translations, (translation, index) => this.translations[keys[index]] = translation)
        );
        this.subs.push(sub1);

        const snapshot = this.route.snapshot;
        const job: KfIJobDescription = _.cloneDeep(snapshot.data.job[0]);
        this.job = job;

        this.isNewJd = snapshot.params.jdDetailId === 'new';
        this.isCopyJd = snapshot.queryParams.copy === 'true';

        const sectionsModel = this.getSubCtgSectionsModel(job) as SectionModel[];
        const sectionControls = sectionsModel.map(sec => this.buildFormControls(sec));

        const tasksSectionModel = this.getTasksSectionModel(job.sections);
        let tasksSectionControl = this.buildFormControls(tasksSectionModel);

        const toolsSectionModel = this.getToolsSectionModel(job.sections);
        let toolsSectionControl = this.buildFormControls(toolsSectionModel);

        const certSection = _.cloneDeep(snapshot.data.job[2]);
        // For copy jobs, ensure all certs have POST method and new UUIDs
        if (this.isCopyJd) {
            // Clear existing certifications to avoid duplication
            this.store.dispatch(actionClearCerts());
            // Transform certifications with new UUIDs
            certSection.certs = certSection.certs.map(cert => ({
                ...cert,
                code: uuidv4(),
                method: 'POST'
            }));
            // Dispatch transformed certs
            this.store.dispatch(actionUpsertCerts({ certs: certSection.certs }));
            // Restore section settings
            this.store.dispatch(actionSectionChange({
                section: {
                    hideNames: certSection.hideNames,
                    hideSection: certSection.hideSection
                }
            }));
        }
        const certsSectionModel = this.getCertsSectionModel({ ...certSection, code: 'CERTIFICATIONS' });
        let certsSectionControl = this.buildFormControls(certsSectionModel);


        sectionControls.splice(1, 0, tasksSectionControl);
        sectionControls.splice(3, 0, certsSectionControl);
        sectionControls.splice(4, 0, toolsSectionControl);

        sectionsModel.splice(1, 0, tasksSectionModel);
        sectionsModel.splice(3, 0, certsSectionModel);
        sectionsModel.splice(4, 0, toolsSectionModel);

        let initCompanyDesc;
        if (this.isNewJd) {
            initCompanyDesc = snapshot.data.job[1] ? (snapshot.data.job[1] as UniversalCompanyDesc).companyDetails.aboutTheCompany : undefined;
        } else {
            this.parentSP = snapshot.data.job[1];
        }

        this.form = this.fb.group({
            title: ['', [Validators.required]],
            companyDescription: '',
            description: '',
            additionalComments: '',
            sections: this.fb.array(_.compact(sectionControls))
        });
        this.form.patchValue(
            {
                title: job.title,
                companyDescription: initCompanyDesc || job.companyDescription,
                description: job.description,
                additionalComments: job.additionalComments,
                sections: _.compact(sectionsModel)
            },
            { emitEvent: false, onlySelf: true }
        );

        this.form.markAsPristine();

        this.certsSectionBackupFromForm = this.getCertSection();
        if (this.isNewJd) {
            this.store.dispatch(actionJobFieldValueChange({
                value: {
                    description: job.description,
                    id: job.id,
                    jobRoleTypeId: job.jobRoleTypeId,
                    standardHayGrade: job.standardHayGrade,
                    title: job.title,
                    version: _.get(job, 'parentJobDetails.version') ? job.parentJobDetails.version : null,
                },
                path: ['parentJobDetails']
            }));

            if (initCompanyDesc) {
                timer(400).subscribe(() => {
                    this.store.dispatch(actionJobFieldValueChange({ value: initCompanyDesc, path: ['companyDescription'] }));
                });
            }

            const skillsSection = _.compact(sectionsModel).find(sec => sec.code === SecCodeEnum.TchnSkills);
            const subCtgs = skillsSection.subCtgs.map(s => ({ id: s.id, descriptions: [{ name: s.name, description: s.description }] }));
            this.store.dispatch(actionUpdateSubCtgs({ sectionCode: SecCodeEnum.TchnSkills, subCtgs }));
        }


        const changedJobCertsSub =
            combineLatest([
                this.store.pipe(select(selectJd), filter(f => !_.isNil(f))),
                this.store.pipe(select(selectCerts)),
            ]).subscribe(([jd, certs]) => {
                this.changedJob = jd;
                this.changedCertSection = certs;
                this.checkIsPristine();
            });

        this.jdDetailService.subscribeOnLeaveJd();

        forkJoin([
            this.store.pipe(select(selectCertsLoadStatus), filter((status) => status === LoadStatusEnum.SAVED), take(1)),
            this.savedJob$
        ]).subscribe(([status, savedJdId]) => {
            this.jdDetailService.clearJdAndCerts();
            this.isNewJd ? this.router.navigate([`tarc/jd/detail/${savedJdId}`]) : this.router.navigate([`tarc/jd/detail/${savedJdId}`], {state: { restrictAuditCall: 'yes' }});
        });


        this.subs.push(changedJobCertsSub);
    }

    private buildFormControls(sectionModel: SectionModel) {
        let sectionModelCtrl: UntypedFormGroup;
        if (sectionModel) {
            sectionModelCtrl = this.fb.group({
                code: this.fb.control(sectionModel.code),
                includeSection: this.fb.control(''),
                includeSubCategoryNames: this.fb.control(''),
            });

            switch (sectionModel.code) {
                case SecCodeEnum.Tasks:
                    sectionModelCtrl.addControl('tasks', this.fb.array(sectionModel.tasks.map(c => this.fb.group({
                        id: this.fb.control(''),
                        name: this.fb.control(''),
                    }))));
                    break;

                case SecCodeEnum.Tools:
                    sectionModelCtrl.addControl('toolsCommodities', this.fb.array(sectionModel.toolsCommodities.map(c => this.fb.group({
                        code: this.fb.control(''),
                        title: this.fb.control(''),
                        tools: this.fb.array(c.tools.map(t => this.fb.group({ id: this.fb.control(''), title: this.fb.control('') }))),
                    }))));
                    break;

                case SecCodeEnum.Tech:
                    sectionModelCtrl.addControl('technologyCommodities', this.fb.array(sectionModel.technologyCommodities.map(c => this.fb.group({
                        code: this.fb.control(''),
                        title: this.fb.control(''),
                        description: this.fb.control(''),
                    }))));
                    break;

                case 'CERTIFICATIONS':
                    sectionModelCtrl.addControl('certs', this.fb.array(sectionModel.certs.map(c => this.fb.group({
                        method: this.fb.control(this.isCopyJd ? 'POST' : undefined),
                        code: this.fb.control(''),
                        name: this.fb.control('', { validators: [Validators.required], updateOn: 'change' }),
                        description: this.fb.control(''),
                    }))));
                    break;

                default:
                    sectionModelCtrl.addControl('subCtgs', this.fb.array(sectionModel.subCtgs.map(subCtg => {
                        const formGroup = this.fb.group({
                            id: this.fb.control(''),
                            name: this.fb.control(''),
                            description: this.fb.control(''),
                        });

                        return formGroup;
                    })));
                    break;
            }
        }

        return sectionModelCtrl;
    }

    switchFormControlsValidation(secFormGroup: UntypedFormGroup) {
        const { code, includeSection, includeSubCategoryNames } = secFormGroup.value;

        const validators = includeSection && includeSubCategoryNames ? [Validators.required] : null;

        switch (code) {
            case 'CERTIFICATIONS':
                secFormGroup.controls.certs['controls'].map((ctrl: UntypedFormGroup) => {
                    ctrl.controls.name.setValidators(validators);
                    ctrl.controls.name.updateValueAndValidity();
                    ctrl.controls.name.markAsTouched();
                });
                break;
        }
    }

    checkIsPristine() {
        this.isPristine = hash.sha1(this.changedJob) === hash.sha1(this.job) && hash.sha1(this.getCertSection()) === hash.sha1(this.certsSectionBackupFromForm);
    }

    private getCertSectionFormGroup() {
        return (this.form.controls.sections as UntypedFormArray).controls.find((ctrl: UntypedFormGroup) => ctrl.controls.code.value === 'CERTIFICATIONS') as UntypedFormGroup;
    }

    private getCertSection() {
        const { includeSection, includeSubCategoryNames, certs } = this.getCertSectionFormGroup().value;

        return { includeSection, includeSubCategoryNames, certs: certs.map((c: Cert) => ({ name: c.name, description: c.description })) };
    }

    ngOnDestroy() {
        this.idleService.startIdleWatch();
        this.idleService.stopKeepAlive();
        for (const sub of this.subs) {
            sub.unsubscribe();
        }
    }

    public save(): void {
        const fromSPId = this.isNewJd ? this.route.snapshot.queryParams.fromSPId : undefined;

        const spWithFlatSubCtgs = this.flatSubCtgs(_.cloneDeep(this.changedJob));

        this.jobDescriptionService.saveJob(spWithFlatSubCtgs.id, spWithFlatSubCtgs, fromSPId).subscribe((savedJob: KfISuccessProfile) => {
            this.advGrowlService.add({ severity: 'success', detail: '', summary: this.translations.SaveSuccess, });

            this.job = this.changedJob;
            this.isCopyJd = false;
            this.checkIsPristine();

            this.store.dispatch(actionCertsSaveUpdateMany({ jdId: savedJob.id, section: { ...this.changedCertSection, code: 'CERTIFICATIONS' } }));

            this.savedJob$.next(savedJob.id);
            this.savedJob$.complete();
        }, () => this.advGrowlService.add({ severity: 'error', detail: '', summary: this.translations.Error, }));
    }

    flatSubCtgs(sp: KfISuccessProfile) {
        sp.sections.forEach(sec => {
            sec.subCategories = _.flatMap(sec.categories, ctg => ctg.subCategories);
            delete sec.categories;
        });

        return sp;
    }

    get parentSpUrl(): string {
        return `/tarc/sp/detail/${this.job.parentJobDetails && this.parentSP ? this.parentSP.id : this.job.id}`;
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (!this.job.isTemplateJob && this.isPristine && !this.isCopyJd || this.jobSaved) {
            return true;
        }

        return new Observable((observer: Observer<boolean>) => {
            if (!this.showDiscardAllModal) {
                this.showLeavingModal = true;

                this.navigateAwaySelection$.subscribe((choice) => {

                    if (choice && this.isCopyJd) {
                        this.authService.removeJobDescription(this.job.id).subscribe();

                        this.jdDetailService.clearJdAndCerts();
                    }

                    observer.next(choice);
                    observer.complete();
                });

            } else {
                this.showDiscardAllModal = false;

                if (this.isCopyJd) {
                    this.authService.removeJobDescription(this.job.id).subscribe();

                    this.jdDetailService.clearJdAndCerts();
                }

                observer.next(true);
                observer.complete();
            }
        });
    }

    leavePage(choice: boolean): void {
        this.showLeavingModal = false;

        this.navigateAwaySelection$.next(choice);
    }

    onDiscard(discard: boolean): void {
        if (discard) {
            this.location.back();
            return;
        }

        this.showDiscardAllModal = false;
    }

    onSave(save: boolean): void {
        if (save) {
            this.save();
            this.jobSaved = true;
        }
        this.showSaveAllModal = false;
    }

    onShowSaveOrDiscardModal(save: boolean): void {
        if (save) {
            this.showSaveAllModal = true;
            return;
        }
        if (!save && !this.isPristine || this.isCopyJd) {
            this.showDiscardAllModal = true;
            return;
        }
        if (!save || this.isPristine) {
            this.location.back();
        }
    }

    onDropSubCtg(event: { currentIndex: number; previousIndex: number }, sectionCode: SecCodeEnum, sectionIndex: number) {
        const { currentIndex, previousIndex } = event;
        const subCtgsCtrl = this.form.controls.sections.get(`${sectionIndex}.subCtgs`) as UntypedFormArray;

        const control = subCtgsCtrl.at(event.previousIndex);
        subCtgsCtrl.removeAt(event.previousIndex);

        subCtgsCtrl.insert(event.currentIndex, control);

        const subCtgId = control.value.id;

        this.store.dispatch(actionMoveSubCtg({ subCtgId, sectionCode, currentIndex, previousIndex }));
    }

    onRemoveSubCtg(subCtgId: number, sectionCode: SecCodeEnum, sectionIndex: number, subCtgIndex: number) {
        const subCtgsCtrl = this.form.controls.sections.get(`${sectionIndex}.subCtgs`) as UntypedFormArray;
        subCtgsCtrl.removeAt(subCtgIndex);

        this.store.dispatch(actionRemoveSubCtg({ subCtgId, sectionCode }));
    }

    onDropCert(event: { currentIndex: number; previousIndex: number }, sectionIndex: number) {
        const { currentIndex, previousIndex } = event;
        const certCtrls = this.form.controls.sections.get(`${sectionIndex}.certs`) as UntypedFormArray;
        const control = certCtrls.at(event.previousIndex);
        certCtrls.removeAt(event.previousIndex);
        certCtrls.insert(event.currentIndex, control);

        const code = control.value.code;

        this.store.dispatch(actionMoveCert({ code, currentIndex, previousIndex }));
    }

    onCertChange = (cert: Cert) => {
        this.store.dispatch(actionUpsertCert({ cert: { ...cert, method: _.isUndefined(cert.method) || cert.method === 'POST' ? 'POST' : 'PUT' } }));
    };

    onAddCert(sectionIndex: number) {
        const certCtrls = this.form.controls.sections.get(`${sectionIndex}.certs`) as UntypedFormArray;
        const ctrl = this.fb.group({
            method: 'POST',
            code: this.fb.control(uuidv4()),
            name: this.fb.control('', { validators: [Validators.required], updateOn: 'change' }),
            description: '',
            order: certCtrls.length + 1,
        });
        certCtrls.push(ctrl);

        ctrl.controls.name.markAsTouched();
    }

    onRemoveCert(cert: Cert, sectionIndex: number, certIndex: number) {
        const certsCtrl = this.form.controls.sections.get(`${sectionIndex}.certs`) as UntypedFormArray;
        certsCtrl.removeAt(certIndex);

        if (uuidValidate(cert.code)) {
            this.store.dispatch(actionRemoveCert({ code: cert.code }));
        } else {
            this.store.dispatch(actionUpsertCert({ cert: { ...cert, method: 'DELETE' } }));
        }
    }

    onItemRemove(sectionCode: SecCodeEnum, sectionIndex: number, path: Array<string | number>, index: number) {
        const ctrl = this.form.controls.sections.get([sectionIndex, ...path]) as UntypedFormArray;
        ctrl.removeAt(index);

        this.store.dispatch(actionSectionItemValueRemove({ sectionCode, path: [...path, index] }));
    }

    onAddTool(path: string | number[]) {
        const ctrl = this.form.controls.sections.get(path) as UntypedFormArray;
        ctrl.push(this.fb.group({ id: this.fb.control(''), title: this.fb.control('') }));
    }

    onSubCtgChange = _.debounce((subCtg: { id: string; name: string; description: string }, subCtgId: number, sectionCode: SecCodeEnum) => {
        this.store.dispatch(actionUpdateSubCtg({ sectionCode, subCtg: { id: subCtgId, descriptions: [{ name: subCtg.name, description: subCtg.description }] }, }));
    }, this.inputChangeDelay);

    onItemValueChange = _.debounce((value: any, sectionCode: SecCodeEnum | 'CERTIFICATIONS', path: (string | number)[]) => {
        if (sectionCode === 'CERTIFICATIONS') {
            const payload = {};
            payload[path[0] === 'hideSubCategoryNames' ? 'hideNames' : 'hideSection'] = value;
            this.store.dispatch(actionSectionChange({ section: payload }));

            return;
        }
        this.store.dispatch(actionSectionItemValueChange({ value, sectionCode: sectionCode as SecCodeEnum, path }));
    }, this.inputChangeDelay);

    onJobFieldValueChange = _.debounce((value: any, path: (string | number)[]) => {
        const unset = path.some(p => p === 'additionalComments') && _.isEmpty(value) && !_.has(this.job, 'additionalComments');
        this.store.dispatch(actionJobFieldValueChange({ value, path, unset }));
    }, this.inputChangeDelay);

    onRemoveItem(sectionCode: SecCodeEnum, sectionIndex: number, index: number, field: 'tasks' | 'toolsCommodities') {
        const ctrl = this.form.controls.sections.get(`${sectionIndex}.${field}`) as UntypedFormArray;
        ctrl.removeAt(index);

        this.store.dispatch(actionRemoveItem({ sectionCode, index, field }));
    }

    onDropTool(event: { currentIndex: number; previousIndex: number }, sectionCode: SecCodeEnum, sectionIndex: number) {
        const toolsCtrl = this.form.controls.sections.get(`${sectionIndex}.toolsCommodities`) as UntypedFormArray;

        const control = toolsCtrl.at(event.previousIndex);
        toolsCtrl.removeAt(event.previousIndex);

        toolsCtrl.insert(event.currentIndex, control);
    }

    onDropItem(event: { currentIndex: number; previousIndex: number }, sectionCode: SecCodeEnum, sectionIndex: number, field: 'tasks' | 'toolsCommodities') {
        const { currentIndex, previousIndex } = event;
        const ctrl = this.form.controls.sections.get(`${sectionIndex}.${field}`) as UntypedFormArray;

        const control = ctrl.at(event.previousIndex);
        ctrl.removeAt(event.previousIndex);

        ctrl.insert(event.currentIndex, control);

        this.store.dispatch(actionMoveFlattenListItem({ sectionCode, currentIndex, previousIndex, field }));
    }
}

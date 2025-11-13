import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Navigation, Router, NavigationEnd } from '@angular/router';
import {
    KfAuthService, KfIdleService, KfIJobDescription, KfISuccessProfile, callBulkRunner,
    KfISpSection,
} from '@kf-products-core/kfhub_lib';
import {
    KfUser
} from '@kf-products-core/kfhub_lib/auth';
import {
    KfThclSPSharedService, KfThclSuccessprofileService, fileReportType
} from '@kf-products-core/kfhub_thcl_lib';
import { SecCodeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { Store } from '@ngrx/store';

import {
    KfTarcJobDescriptionService
} from '../../app/modules/services/kftarc-job-description.service';
import { JdDetailBase } from './jd-detail-base.page';
import { CertSection, SectionModel } from './jd-detail.model';
import { JdDetailService } from './jd-detail.service';
import { State } from './jd-detail.state';
import { KfISuccessProfileDownloadOptions
} from '@kf-products-core/kfhub_thcl_lib/_deprecated/models/kfthcl-i-download-options.model';
import { KfBCPage, KfBCRecords } from './../../app/modules/models/kftarc-sp-interview-guide.model';

@Component({
    selector: 'kftarc-jd-detail',
    templateUrl: './jd-detail.page.html',
    styleUrls: ['./jd-detail.page.scss'],
    providers: [],
})
export class JdDetailPage extends JdDetailBase implements OnDestroy, OnInit {
    job: KfIJobDescription;

    secCodeEnum = SecCodeEnum;

    hasEditMenuItem = false;
    hasDeleteMenuItem = false;

    isIGEmptyModalOpen = false;
    isIGConfigModalOpen = false;
    behavioralCompetenciesCodes: string[];
    skillsCompetenciesCodes: string[];

    parentSP: KfISuccessProfile;
    showRemoveModal = false;
    jobDescriptionId: number;
    jobDescriptionTitle: string;

    sectionModels: SectionModel[];
    hideTooltip = true;

    private subs: Subscription[] = [];

    public applicationTypeEnum = {
        PM: 'PM',
        JD: 'JD',
    };

    private navigation: Navigation;

    public makeAuditCall = true;
    private isInitialNavigation = true;

    public skillsRecords: KfBCPage[] = [];
    public behavioralCompsRecords: KfBCPage[] = [];
    behavioralCompetenciesSection: KfISpSection;

    constructor(
        private route: ActivatedRoute,
        private jdService: KfTarcJobDescriptionService,
        private spSharedService: KfThclSPSharedService,
        public authService: KfAuthService,
        public router: Router,
        private spService: KfThclSuccessprofileService,
        public idleService: KfIdleService,
        private store: Store<State>,
        private jdDetailService: JdDetailService,
    ) {
        super();
        this.navigation = this.router.getCurrentNavigation();
        if (this.navigation && this.navigation.extras && this.navigation.extras.state && Object.keys(this.navigation.extras.state).length !== 0) {
            this.makeAuditCall = false;
        }
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.isInitialNavigation) {
                    this.isInitialNavigation = false;
                } else {
                    this.ngOnInit();
                }
            }
        });
    }

    ngOnInit() {
        this.idleService.stopIdleWatch();
        this.idleService.startKeepAlive();

        const job: KfISuccessProfile = _.cloneDeep(this.route.snapshot.data.job[0]);
        const certSection: CertSection = _.cloneDeep(this.route.snapshot.data.job[1]);
        this.job = job;

        this.sectionModels = this.getSubCtgSectionsModel(job) as SectionModel[];
        this.sectionModels.splice(1, 0, this.getTasksSectionModel(job.sections));
        this.sectionModels.splice(3, 0, this.getCertsSectionModel({ ...certSection, code: 'CERTIFICATIONS' }));
        this.sectionModels.splice(4, 0, this.getToolsSectionModel(job.sections),);

        this.sectionModels = _.compact(this.sectionModels);

        this.hasEditMenuItem = this.hasRole(job, 'EDIT') || this.isOwner(this.job.id) || this.isAdmin();

        this.hasDeleteMenuItem = this.hasRole(job, 'DELETE') || this.isOwner(this.job.id) || this.isAdmin();

        if (this.job.parentJobDetails) {
            this.getParentSuccessProfile(this.job);
        }
        this.jdDetailService.subscribeOnLeaveJd();

        this.callAuditLog();
    }
    public callAuditLog() {
        const getProfileId = [this.job.id];
        if (this.makeAuditCall) {
            this.spSharedService.callViewAuditLog(this.applicationTypeEnum.PM, this.applicationTypeEnum.JD, getProfileId, true);
        }
    }

    ngOnDestroy() {
        this.idleService.startIdleWatch();
        this.idleService.stopKeepAlive();
        for (const sub of this.subs) {
            sub.unsubscribe();
        }
        this.makeAuditCall = false;
    }

    private get user(): KfUser {
        return this.authService.getSessionInfo().User;
    }

    private get locale(): string {
        const user = this.user;
        return user && user.Locale || 'en';
    }

    public getParentUrl(): string {
        if (this.job.parentJobDetails && this.parentSP) {
            return `/app/tarc/#/tarc/sp/detail/${this.parentSP.id}`;
        }
        return `/app/tarc/#/tarc/sp/detail/${this.job.id}`;
    }

    public downloadInterviewGuide(url: string) {
        this.spService.getSuccessProfileDetail(this.job.id, true, false).subscribe((successProfile: KfISuccessProfile) => {
            this.parentSP = successProfile;
            const behavioralSection = this.parentSP.sections.find(section => section.code === SecCodeEnum.BhvrSkills);
            const skillsSection = this.parentSP.sections.find(section => section.code === SecCodeEnum.TchnSkills);
            this.behavioralCompetenciesCodes = _.reject(_.map(behavioralSection.subCategories, s => s.globalCode), _.isNil);
            this.skillsCompetenciesCodes = _.reject(_.map(skillsSection.subCategories, s => s.globalCode), _.isNil);
            if (this.behavioralCompetenciesCodes?.length > 0 || this.skillsCompetenciesCodes?.length > 0) {
                this.isIGConfigModalOpen = true;
                this.getSkillsAndCompetencies(successProfile);
            } else {
                this.isIGEmptyModalOpen = true;
            }
        });
    }

    public closeIGEmptyModal() {
        this.isIGEmptyModalOpen = false;
    }

    public download(event: MouseEvent, job: KfIJobDescription, format: string) {
        if (callBulkRunner(event, 'success_profile_single_pdf_export', this.authService.getSessionInfo())) {
            this.spSharedService.downloadSuccessProfileReport(job.id, 'JOB_DESCRIPTION', {
                isProfileManager: true,
                excludeSections: [4],
                locale: this.locale,
                format,
                exportName: `Job Description - ${job.title}`,
            } as KfISuccessProfileDownloadOptions);
        } else {
            const fullUrl = `${job.jobExportUrl}&locale=${this.locale}&format=${format}`;
            this.spSharedService.downloadReportWithAudit(fullUrl, job.title, format, fileReportType.PM_JOB_DESCRIPTION);
        }
    }

    editJd() {
        this.router.navigate([`tarc/jd/detail/${this.job.id}/edit`]);
    }

    copyJd() {
        this.jdDetailService.clearJdAndCerts();

        this.jdService.cloneJobDescription(this.job.id)
            .subscribe(clonedJd => {
                this.router.navigate([`tarc/jd/detail/${clonedJd.id}/edit`], { queryParams: { copy: true, sourceJdId: this.job.id }, state: { parentId: this.job.id } });
                this.spSharedService.callViewAuditLog(this.applicationTypeEnum.PM, this.applicationTypeEnum.JD, [clonedJd.id], true);
            });
    }

    private getParentSuccessProfile(job: KfIJobDescription): void {
        const liteSP = true;
        this.spService.getSuccessProfileDetail(job.parentJobDetails.id, true, false, liteSP)
            .subscribe((successProfile: KfISuccessProfile) => {
                this.parentSP = successProfile;
            });
    }

    public getSkillsAndCompetencies(data) {
        const behavioralSection = data.sections
            .find(section => section.code === 'BEHAVIORAL_SKILLS');
        const skillSection = data.sections
            .find(section => section.code === 'TECHNICAL_SKILLS');
        if(this.behavioralCompetenciesCodes?.length > 0) {
            this.behavioralCompetenciesSection = behavioralSection;
            this.behavioralCompsRecords = this.behariouralComListRecords('bc', this.behavioralCompetenciesSection, 6);
        }else{
            this.behavioralCompsRecords = [];
        }
        if(this.skillsCompetenciesCodes?.length > 0) {
            this.skillsRecords =  this.behariouralComListRecords('skills', skillSection, 6);
        }else{
            this.skillsRecords = [];
        }

    }

    private behariouralComListRecords(type: string, behaviouralSection: KfISpSection, page: number): KfBCPage[] {
        const grouped = behaviouralSection.subCategories.reduce((acc, subCat) => {
            if (subCat.globalCode) {
                acc[subCat.globalCode] = acc[subCat.globalCode] || [];
                acc[subCat.globalCode].push({
                    globalCode: subCat.globalCode,
                    name: subCat.descriptions[0].name,
                    id: subCat.id,
                    selected: false,
                });
            }
            return acc;
        }, {}as Record<string, KfBCRecords[]>);

        // Convert grouped records to an array of all records
        const allRecords = Object.values(grouped).flat();

        // Ensure we only return `page` number of entries
        // eslint-disable-next-line @typescript-eslint/no-shadow
        return Array.from({ length: page }, (_, index) => ({
            searchTerm: '', // Empty searchTerm for now
            bcCheckBox: true,
            skillCheckBox: true,
            records: allRecords
        }));
    }

    public removeJobDescription(event): void {
        this.jobDescriptionId = event.id;
        this.jobDescriptionTitle = event.title;
        this.showRemoveModal = true;
    }

    public removeJobDescriptionChoice(choice: boolean): void {
        this.showRemoveModal = false;
        if (choice) {
            this.authService.removeJobDescription(this.job.id).subscribe(() => {
                this.router.navigate(['tarc/jd/search']);
            });
        }
    }

    public isOwner(jobId: number): boolean {
        const user = this.authService.getSessionInfo().User;

        return jobId > 0 && user.UserId === jobId;
    }

    private isAdmin(): boolean {
        const user = this.authService.getSessionInfo().User;

        return user && user.IsAdmin;
    }

    public hasRole(job: { accessRoles?: string; profileType?: string; isTemplateJob?: boolean }, role: 'EDIT' | 'DELETE'): boolean {
        if (!job.accessRoles || !job.profileType) {
            return false;
        }
        return job.accessRoles.includes(role) && !job.isTemplateJob;
    }

    public hover(event) {
        if (event?.srcElement) {
            const element = event.srcElement;
            this.hideTooltip = element.offsetHeight >= element.scrollHeight;
        }
    }
}

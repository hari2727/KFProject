/* eslint-disable @typescript-eslint/dot-notation */
import { concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { KfAuthService, KfIJobDescription, KfCacheService, KfStorageService, KfActiveAppService, KfSpUtilsService, KfGrowlService, KfTranslationService, KfGrowlMessageType, JOB_TITLE_MAX_LENGTH } from '@kf-products-core/kfhub_lib';
import { KfThclTalentArchitectConstantsService, KfThclSuccessprofileService } from '@kf-products-core/kfhub_thcl_lib';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { JobStatusEnum } from '@kf-products-core/kfhub_thcl_lib/domain';

@Injectable()
export class KfTarcJobDescriptionService extends KfThclSuccessprofileService {
    constructor(
        protected translate: TranslateService,
        protected authService: KfAuthService,
        protected cacheService: KfCacheService,
        protected talentArchitectConstants: KfThclTalentArchitectConstantsService,
        protected storageService: KfStorageService,
        public route: ActivatedRoute,
        public router: Router,
        public activeAppService: KfActiveAppService,
        public spUtilsService: KfSpUtilsService,
        public growlService: KfGrowlService,
        public translationService: KfTranslationService,
    ) {
        super(
            translate, authService, cacheService, talentArchitectConstants,
            storageService, route, router, activeAppService, spUtilsService, growlService, translationService);
        this['appConstants'] = {
            getBaseUrl: () => this.talentArchitectConstants.getJobDescriptionBaseUrl(),
            getDetailUrl: id => this.talentArchitectConstants.getJobDescriptionDetailUrl(id),
            getUrl: () => this.talentArchitectConstants.getJobDescriptionsUrl(),
        };
    }

    private buildSubcategories(originalSubcategories: any): any {
        return _.chain(originalSubcategories)
            .map((subCategory) => {
                if (subCategory.dependents) {
                    delete subCategory.dependents;
                }
                const fields = _.pick(subCategory, [
                    'id',
                    'type',
                    'userEdited',
                    'subCategories',
                ]) as any;
                if (!subCategory.descriptions) {
                    return {
                        ...subCategory,
                        level: 8,
                    };
                }
                fields.name = subCategory.descriptions[0].name;
                fields.description = subCategory.descriptions[0].description;
                return {
                    ...fields,
                    level: subCategory.descriptions[0].level,
                };
            })
            .value();
    }

    private buildTasks(originalTasks: any): any {
        return _.chain(originalTasks)
            .map((task) => {
                const fields = _.pick(task, [
                    'id',
                    'userEdited',
                    'name',
                    'isCore',
                ]);
                fields.name = task.name;
                fields.isCore = task.isCore;
                fields.userEdited = true;
                return {
                    ...fields,
                };
            })
            .value();
    }

    private buildTechnologies(originalTechnologies: any): any {
        return _.chain(originalTechnologies)
            .map((technologyCommodity) => {
                const fields = _.pick(technologyCommodity, [
                    'code',
                    'userEdited',
                    'technologies',
                    'title',
                ]);
                fields.title = technologyCommodity.title;
                technologyCommodity.technologies = technologyCommodity.technologies.map((tech: any) => ({
                    id: tech.id,
                    userEdited: true,
                    title: tech.title,
                }));
                fields.technologies = technologyCommodity.technologies;
                fields.userEdited = true;
                return {
                    ...fields,
                };
            })
            .value();
    }

    private buildTools(originalTools: any): any {
        return _.chain(originalTools)
            .map((toolCommodity) => {
                const fields = _.pick(toolCommodity, [
                    'code',
                    'userEdited',
                    'tools',
                    'title',
                ]);
                fields.title = toolCommodity.title;
                toolCommodity.tools = _.chain(toolCommodity.tools).compact().map((tool: any) => ({
                    id: tool.id,
                    userEdited: true,
                    title: tool.title,
                })).value();
                fields.tools = toolCommodity.tools;
                fields.userEdited = true;
                return {
                    ...fields,
                };
            })
            .value();
    }

    private constructEditBody(job: KfIJobDescription, parentId: any, id?: number): any {
        const subSections = _.chain(job.sections)
            .filter(section =>
                _.some(
                    [
                        'RESPONSIBILITY',
                        'BEHAVIORAL_SKILLS',
                        'TECHNICAL_SKILLS',
                        'EDUCATION',
                        'EXPERIENCE',
                        'TECHNOLOGY',
                        'TOOLS',
                        'TASKS',
                    ],
                    code => code === section.code,
                )
            )
            .map((section) => {
                const mappedObject = {
                    id: section.id,
                    hideSection: 1,
                    hideSubCategoryNames: 1,
                };
                if (section.subCategories != null && section.subCategories.length > 0) {
                    const subCategories = this.buildSubcategories(_.compact(section.subCategories));
                    mappedObject['subCategories'] = subCategories;
                    mappedObject.hideSection = section['hideSection'] ? 1 : 0;
                    mappedObject.hideSubCategoryNames = section['hideSubCategoryNames'] ? 1 : 0;
                }
                if (section.tasks && section.tasks.length > 0) {
                    mappedObject['tasks'] = this.buildTasks(_.compact(section.tasks));
                    mappedObject.hideSection = section['hideSection'] ? 1 : 0;
                    mappedObject.hideSubCategoryNames = section['hideSubCategoryNames'] ? 1 : 0;
                }
                if (section.technologyCommodities && section.technologyCommodities.length > 0) {
                    mappedObject['technologyCommodities'] =
                        this.buildTechnologies(_.compact(section.technologyCommodities));
                    // Technologies shall be hidden
                    mappedObject.hideSection = 1;
                    mappedObject.hideSubCategoryNames = 1;
                }
                if (section.toolsCommodities && section.toolsCommodities.length > 0) {
                    mappedObject['toolsCommodities'] =
                        this.buildTools(_.compact(section.toolsCommodities));
                    mappedObject.hideSection = section['hideSection'] ? 1 : 0;
                    mappedObject.hideSubCategoryNames = section['hideSubCategoryNames'] ? 1 : 0;
                }
                return mappedObject;
            })
            .value();
        subSections.forEach((section) => {
            if (section !== undefined && (section as any).subCategories) {
                (section as any).subCategories.forEach((subCategory) => {
                    subCategory.userEdited = true;
                    if (subCategory.dependents && !subCategory.dependents.length) {
                        delete subCategory.dependents;
                    }
                });
            }
        });
        const sections = subSections.filter(item => item !== undefined);
        const formattedJob = _.chain(job).pick<KfIJobDescription>([
            'additionalComments',
            'companyDescription',
            'description',
            'finalizedResponsibilities',
            'grade',
            'status',
            'title',
            'standardHayGrade',
        ])
            .assign({ sections })
            .value();
        (formattedJob as any).parentJobId = parentId;
        formattedJob.finalizedResponsibilities = 1;
        const clientId = this.authService.getSessionInfo().User.ClientId;
        const jdId = id;
        return { job: formattedJob, clientId,  jdId };
    }

    public saveJob(id: number, job: any, newFromSPId: any, isClone?: boolean): Observable<any> {
        const url = this.talentArchitectConstants.getJobDescriptionDetailsUrl(id);
        const parentId = isClone ? job.parentJobDetails.id : newFromSPId;
        const body = this.constructEditBody(job, parentId, id);
        if (newFromSPId || isClone) {
            if (isClone) {
                body.job.title = `${body.job.title} ${this.translate.instant('lib.copyText')}`;
            }
            if (body.job.title.length > JOB_TITLE_MAX_LENGTH) {
                const jobTitleWarningText =  this.translationService.get('lib.jobTitleLengthWarningText', {
                    JOB_TITLE_MAX_LENGTH,
                });
                this.growlService.createInteractiveErrorMessage(
                    jobTitleWarningText, this.translationService.get('pm.copyFailedMessage'), KfGrowlMessageType.ERROR, 'data', 100000);
                return;
            }
            // We set status to Draft or KF Draft for newly created job
            body.job.status = this.evaluateIfKFClient() ? JobStatusEnum.DraftKF : JobStatusEnum.Draft;
            const newJDUrl = this.talentArchitectConstants.postJobDescriptionBaseUrl();
            return this.authService.authHttpCall('post', newJDUrl, body);
        }
        return this.authService.authHttpCall('put', url, body);
    }

    public downloadInterviewGuide(url): Observable<any> {
        return this.authService.authHttpCall('GET', url, null, {});
    }

    cloneJobDescription(jobDescriptionId: number): Observable<KfIJobDescription> {
        return this.getSuccessProfileDetail(jobDescriptionId).pipe(concatMap((jobDescription: KfIJobDescription) => {
            const job = this.getFlattenedSuccessProfile(jobDescription);
            return this.saveJob(jobDescriptionId, job, false, true);
        }));
    }

    getJDPermissions(jobDescriptionId: number): Observable<any> {
        const param = { jobDescriptionId };
        const url = this.talentArchitectConstants.getSPJDPermissionsUrl(param);
        return this.authService.authHttpCall('GET', url, null);
    }

}

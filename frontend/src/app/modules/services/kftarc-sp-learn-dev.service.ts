
import { map } from 'rxjs/operators';
import { KfThclTalentArchitectConstantsService } from '@kf-products-core/kfhub_thcl_lib';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { KfAuthService, KfTRequestLoadingTypes } from '@kf-products-core/kfhub_lib';

export interface KfTarcILearnDevPayload {
    sections: {
        id: number;
        code: string;
        categories: {
            subCategories: {
                id: number;
                descriptions: {
                    name: string;
                }[];
                learningContent: {
                    id: number;
                    name: string;
                    description: string;
                    rank: number;
                }[];
            }[];
        }[];
    }[];
}

export interface KfTarcILearnDevView {
    learningContent: KfTarcICourseInfo[];
}

export interface KfTarcICourseInfo {
    id: number;
    name: string;
    rank: number;
    description: string;
    techComps: string[];
    behComps: string[];
}

@Injectable()
export class KfTarcSpLearnDevService {
    constructor(
        private talentArchitectConstants: KfThclTalentArchitectConstantsService,
        private authService: KfAuthService,
    ) {

    }

    getLearnDev(
        successProfileId: number, requestType: KfTRequestLoadingTypes = 'blocking'): Observable<KfTarcILearnDevView> {
        const requestGroups = ['tarc:get-learning-content'];
        const url = this.talentArchitectConstants.getLearnDevelopmentUrl(successProfileId);
        return this.authService.authHttpCallv2('GET', url, null, { requestGroups, requestType }).pipe(
            map(data => this.convertContent(data)));
    }

    convertContent(data: KfTarcILearnDevPayload): KfTarcILearnDevView {
        if (!data || !data.sections) {
            return { learningContent: [] };
        }
        const courseToCompMapping = new Map<number, KfTarcICourseInfo>();
        const subCategories = _.flatMap(
            data.sections,
            section => _.flatMap(
                section.categories,
                category => _.map(category.subCategories, subCat => ({ ...subCat, type: section.code }))));
        for (const subCat of subCategories) {
            for (const course of subCat.learningContent) {
                const courseInfo = courseToCompMapping.get(course.id) || {
                    ...course,
                    techComps: [] as string[],
                    behComps: [] as string[],
                };
                const subCatName = _.get(subCat, 'descriptions[0].name', '');
                if (subCat.type === 'BEHAVIORAL_SKILLS') {
                    courseInfo.behComps.push(subCatName);
                } else if (subCat.type === 'TECHNICAL_SKILLS') {
                    courseInfo.techComps.push(subCatName);
                }
                courseToCompMapping.set(course.id, courseInfo);
            }
        }
        const learningContentUnsorted: KfTarcICourseInfo[] = [];
        courseToCompMapping.forEach(val => learningContentUnsorted.push(val));
        const learningContent = _.forEach(_.sortBy(learningContentUnsorted, 'rank'), (info) => {
            info.behComps.sort();
            info.techComps.sort();
        });
        return { learningContent };
    }
}

import { Injectable } from '@nestjs/common';
import { KfTarcSpMatrixRepository } from './kftarc-sp-matrix.repository';
import {
    EntityType,
    FilterCategories,
    KfTarcSpMatrixRequestDetails,
    KfTarcSpMatrixResponse,
    PreparedFilterValues,
    PreparedFilterValuesMapper,
} from './kftarc-sp-matrix.interface';
import { DbResponse, KfTarcSuccessProfileMatrixEntity, TotalRecords } from './kftarc-sp-matrix.entity';
import { safeString } from '../../_shared/safety';

@Injectable()
export class KfTarcSpMatrixService {
    constructor(protected kfTarcSpMatrixRepository: KfTarcSpMatrixRepository) { }

    async spMatrix(query: KfTarcSpMatrixRequestDetails.QueryParams): Promise<KfTarcSpMatrixResponse.Response> {
        const pageSize = Math.max(Number(query.pageSize) || 0, 1);
        const pageIndex = Math.max(Number(query.pageIndex) || 0, 0);
        const preparedvalues: PreparedFilterValues = this.groupColumnNamesAndTheirValues(query);
        const matrixProfiles: DbResponse = await this.kfTarcSpMatrixRepository.getPmMatrixProfiles({
            clientId: query.loggedInUserClientId,
            sectionProductId: 1,
            functions: preparedvalues.functions ?? null,
            subFunctions: preparedvalues.subFunctions ?? null,
            profileTypes: preparedvalues.profileTypes ?? null,
            createdBy: preparedvalues.createdBy ?? null,
            locale: query.locale ?? null,
            pageIndex: pageIndex,
            pageSize: pageSize,
            userId: query.userId,
            profileCollections: preparedvalues.profileCollections ?? null,
        });
        if (query.type === EntityType.CAREER_ARCHITECTURE_VIEW_EXPORT) {
            return this.constructExportResponse(matrixProfiles.entries, pageIndex, pageSize, matrixProfiles.amount);
        }
        return this.constructResponse(matrixProfiles.entries, pageIndex, pageSize, matrixProfiles.amount);
    }

    parseStringCoalescedByDelimeter(pipedString: string, delimeter: string): string[] {
        return pipedString.split(delimeter);
    }

    findInvalidPipedValues<T>(values: string[], allowedValuesSet: T): boolean {
        const invalidValues = values.filter(value => !Object.values(allowedValuesSet).includes(value));
        return !!invalidValues.length;
    }

    parseStringAndCheck<T>(pipedString: string, delimeter: string, allowedValuesSet: T): string[] & unknown {
        const parsedValues = this.parseStringCoalescedByDelimeter(pipedString, delimeter);
        if (this.findInvalidPipedValues(parsedValues, allowedValuesSet)) {
            throw new Error(safeString(`Invalid value caught in the piped string: ${pipedString}`));
        }
        return parsedValues;
    }

    groupColumnNamesAndTheirValues(query: KfTarcSpMatrixRequestDetails.QueryParams): PreparedFilterValues {
        const dividedFilterCategories: string[] = this.parseStringAndCheck(query.filterBy, '|', FilterCategories);
        const dividedFilterValues: string[] = this.parseStringCoalescedByDelimeter(query.filterValues, '|');
        return this.prepareFilterCategoriesAndValuesForStoredProc(dividedFilterCategories, dividedFilterValues);
    }

    prepareFilterCategoriesAndValuesForStoredProc(filterCategories: string[], filterValues: string[]): PreparedFilterValues {
        return filterCategories.reduce((acc, category, index) => {
            acc[PreparedFilterValuesMapper[category]] = filterValues[index].split(';').join(',');
            return acc;
        }, {} as PreparedFilterValues);
    }

    constructResponse(matrixProfiles: KfTarcSuccessProfileMatrixEntity[], pageIndex: number, pageSize: number, totalRecords: TotalRecords[]): KfTarcSpMatrixResponse.Response {
        const families: KfTarcSpMatrixResponse.SpMatrixProfileJobFamily[] = [];
        const uniqueFamilies: { [key: string]: KfTarcSpMatrixResponse.SpMatrixProfileJobFamily } = {};
        const uniqueSubFamilies: { [key: string]: KfTarcSpMatrixResponse.SpMatrixProfileJobSubFamily } = {};
        const uniqueJobRoles: { [key: string]: KfTarcSpMatrixResponse.SpMatrixProfileJobRole } = {};

        for (const matrixProfile of matrixProfiles) {
            let family = uniqueFamilies[matrixProfile.JobFamilyID];

            if (!family) {
                family = {
                    id: matrixProfile.JobFamilyID,
                    name: matrixProfile.JobFamilyName,
                    insights: {
                        totalSubFamilies: matrixProfile.SubFunctionsCnt,
                        totalJobRoles: matrixProfile.RolesCnt,
                        totalSuccessProfiles: matrixProfile.SuccessProfileCnt,
                    },
                    jobSubFamilies: [],
                };
                uniqueFamilies[matrixProfile.JobFamilyID] = family;
                families.push(family);
            }

            let subFamily = uniqueSubFamilies[matrixProfile.JobSubFamilyID];

            if (!subFamily) {
                subFamily = {
                    id: matrixProfile.JobSubFamilyID,
                    name: matrixProfile.JobSubFamilyName,
                    jobRoles: [],

                };
                uniqueSubFamilies[matrixProfile.JobSubFamilyID] = subFamily;

                family.jobSubFamilies.push(subFamily);
            }
            let jobRole = uniqueJobRoles[matrixProfile.JobSubFamilyID + '-' + matrixProfile.RoleName];

            if (!jobRole) {
                jobRole = {
                    profileType: matrixProfile.LevelType,
                    jobRoleTypeId: matrixProfile.JobRoleTypeID,
                    name: matrixProfile.RoleName,
                    jobId: matrixProfile.JobID,
                    isExecutive: Boolean(matrixProfile.IsExecutive),
                    totalSuccessProfiles: matrixProfile.RoleSuccessProfileCnt,
                }
                uniqueJobRoles[matrixProfile.JobSubFamilyID + '-' + matrixProfile.RoleName] = jobRole;
                subFamily.jobRoles.push(jobRole)
            }

            if (matrixProfile.LevelType === 'CUSTOM_PROFILE') {
                // if (!sjf.jobRoles[jobRoleIndex].jobs) {
                //     sjf.jobRoles[jobRoleIndex].jobs =(sjf.jobRoles[jobRoleIndex].jobs || []);
                // }
                jobRole.jobs = (jobRole.jobs || []);

                if (matrixProfile.CustomGrade) {
                    jobRole.jobs.push({
                        id: parseInt(matrixProfile.JobID),
                        name: matrixProfile.JobName,
                        shortProfile: matrixProfile.ShortProfile,
                        standardHayGrade: String(matrixProfile.HayReferenceLevel),
                        profileType: matrixProfile.LevelType,
                        levelName: matrixProfile.KFManagementName,
                        subLevelName: matrixProfile.KFLevelName,
                        isExecutive: Boolean(matrixProfile.IsExecutive),
                        totalPoints: matrixProfile.HayPoints,
                        customGrades: { grades: [{ gradeLabel: matrixProfile.CustomGrade.substring(2) }] },
                        ...(matrixProfile.MaxGrade !== null && matrixProfile.MaxGrade !== undefined && {
                            max: matrixProfile.MaxGrade,
                        }),
                        ...(matrixProfile.MinGrade !== null && matrixProfile.MinGrade !== undefined && {
                            min: matrixProfile.MinGrade,
                        })
                    })
                } else {
                    jobRole.jobs.push({
                        id: parseInt(matrixProfile.JobID),
                        name: matrixProfile.JobName,
                        shortProfile: matrixProfile.ShortProfile,
                        standardHayGrade: String(matrixProfile.HayReferenceLevel),
                        profileType: matrixProfile.LevelType,
                        levelName: matrixProfile.KFManagementName,
                        subLevelName: matrixProfile.KFLevelName,
                        isExecutive: Boolean(matrixProfile.IsExecutive),
                        totalPoints: matrixProfile.HayPoints,
                        ...(matrixProfile.MaxGrade !== null && matrixProfile.MaxGrade !== undefined && {
                            max: matrixProfile.MaxGrade,
                        }),
                        ...(matrixProfile.MinGrade !== null && matrixProfile.MinGrade !== undefined && {
                            min: matrixProfile.MinGrade,
                        })
                    })
                }
            } else {
                jobRole.grades = (jobRole.grades || []);
                if (jobRole.grades.findIndex(grade => grade.value === matrixProfile.HayReferenceLevel) === -1) {
                    if (jobRole.grades) {
                        jobRole.grades.push({ value: matrixProfile.HayReferenceLevel, min: matrixProfile.MinGrade, max: matrixProfile.MaxGrade })
                    }
                }

                jobRole.level = (jobRole.level || []);
                if (jobRole.level) {
                    if (jobRole.level.findIndex(level => level.value === matrixProfile.KFManagementName) === -1) {
                        jobRole.level.push({ value: matrixProfile.KFManagementName })
                    }
                }

                jobRole.subLevel = (jobRole.subLevel || []);
                if (jobRole.subLevel) {
                    if (jobRole.subLevel.findIndex(subLevel => subLevel.value === matrixProfile.KFLevelName) === -1) {
                        jobRole.subLevel.push({ value: matrixProfile.KFLevelName })
                    }
                }

                jobRole.shortProfile = (jobRole.shortProfile || []);
                if (jobRole.shortProfile) {
                    if (jobRole.shortProfile.findIndex(shortProfile => shortProfile.value === matrixProfile.ShortProfile) === -1) {
                        jobRole.shortProfile.push({ value: matrixProfile.ShortProfile })
                    }
                }
            }

        }
        return {
            jobFamilies: families,
            paging: {
                pageIndex,
                pageSize,
                totalPages: Math.ceil(totalRecords[0].TotalJobs / pageSize) || 0,
                totalResultRecords: totalRecords[0].TotalJobs || 0,
            },
        };
    }

    constructExportResponse(matrixProfiles: KfTarcSuccessProfileMatrixEntity[], pageIndex: number, pageSize: number, totalRecords: TotalRecords[]): KfTarcSpMatrixResponse.Response {
        const jobFamilies: { [key: string]: KfTarcSpMatrixResponse.SpMatrixProfileJobFamily } = {};
        const jobSubFamilies: { [key: string]: KfTarcSpMatrixResponse.SpMatrixProfileJobSubFamily } = {};
        const jobRoles: { [key: string]: KfTarcSpMatrixResponse.SpMatrixProfileJobRole } = {};

        for (const matrixProfile of matrixProfiles) {
            const familyKey = matrixProfile.JobFamilyID;
            let family = jobFamilies[familyKey];
            if (!family) {
                family = {
                    id: matrixProfile.JobFamilyID,
                    name: matrixProfile.JobFamilyName,
                    insights: {
                        totalSubFamilies: matrixProfile.SubFunctionsCnt,
                        totalJobRoles: matrixProfile.RolesCnt,
                        totalSuccessProfiles: matrixProfile.SuccessProfileCnt,
                    },
                    jobSubFamilies: [],
                };
                jobFamilies[familyKey] = family;
            }

            const subFamilyKey = matrixProfile.JobSubFamilyID;
            let subFamily = jobSubFamilies[subFamilyKey];
            if (!subFamily) {
                subFamily = {
                    id: matrixProfile.JobSubFamilyID,
                    name: matrixProfile.JobSubFamilyName,
                    jobRoles: [],
                };
                jobSubFamilies[subFamilyKey] = subFamily;
                family.jobSubFamilies.push(subFamily);
            }

            const jobRoleKey = matrixProfile.JobSubFamilyID + '-' + matrixProfile.RoleName;
            let jobRole = jobRoles[jobRoleKey];
            if (!jobRole) {
                jobRole = {
                    profileType: matrixProfile.LevelType,
                    jobRoleTypeId: matrixProfile.JobRoleTypeID,
                    name: matrixProfile.RoleName,
                    jobId: matrixProfile.JobID,
                    isExecutive: Boolean(matrixProfile.IsExecutive),
                    totalSuccessProfiles: matrixProfile.RoleSuccessProfileCnt,
                    jobs: [],
                };
                jobRoles[jobRoleKey] = jobRole;
                subFamily.jobRoles.push(jobRole);
            }

            jobRole.jobs.push({
                id: parseInt(matrixProfile.JobID),
                name: matrixProfile.JobName,
                shortProfile: matrixProfile.ShortProfile,
                standardHayGrade: String(matrixProfile.HayReferenceLevel),
                profileType: matrixProfile.LevelType,
                levelName: matrixProfile.KFManagementName,
                subLevelName: matrixProfile.KFLevelName,
                isExecutive: Boolean(matrixProfile.IsExecutive),
                totalPoints: matrixProfile.HayPoints,
                customGrades: matrixProfile.CustomGrade ? {
                    grades: [
                        {
                            gradeLabel: matrixProfile.CustomGrade.substring(2)
                        }
                    ]
                } : undefined,
                ...(matrixProfile.MaxGrade !== null && matrixProfile.MaxGrade !== undefined && {
                    maxGrade: matrixProfile.MaxGrade,
                }),
                ...(matrixProfile.MinGrade !== null && matrixProfile.MinGrade !== undefined && {
                    minGrade: matrixProfile.MaxGrade,
                })
            });
        }
        return {
            jobFamilies: Object.values(jobFamilies),
            paging: {
                pageIndex,
                pageSize,
                totalPages: Math.ceil(totalRecords[0].TotalJobs / pageSize) || 0,
                totalResultRecords: totalRecords[0].TotalJobs || 0,
            },
        };
    }

}

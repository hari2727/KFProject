import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger';
import { Repository } from 'typeorm';
import { KfTarcSuccessProfileSearchEntity } from './kftarc-sp-and-jd-search.entity';
import { KfTarcSpAndJdSearchParams, KfTarcSpAndJdSpResponse } from './kftarc-sp-and-jd-search.interface';
import { AppCode as ec } from '../../../app.const';
import { anyTo01 } from '../../../common/common.utils';
import { MapErrors } from '../../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Loggers } from '../../../_shared/log/loggers';
import { toLocale, toNumber, toStringOr } from '../../../_shared/convert';
import { KfTarcRolesInterface as Kf } from '../../roles/kftarc-roles.interface';
import { TypeOrmHelper } from '../../../_shared/db/typeorm.helper';

@Injectable()
export class KfTarcSpAndJdSearchRepository extends Repository<KfTarcSuccessProfileSearchEntity> {
    protected logger: LoggerService;

    constructor(
        protected sql: TypeOrmHelper,
        protected loggers: Loggers,
    ) {
        super(KfTarcSuccessProfileSearchEntity, sql.dataSource.createEntityManager());
        this.logger = loggers.getLogger(KfTarcSpAndJdSearchRepository.name);
    }

    @MapErrors({ errorCode: ec.SEARCH_FOR_SUCCESS_PROFILES_AND_JOB_DESCRIPTIONS_ERR })
    @LogErrors()
    async getSpsAndJds(searchParams: KfTarcSpAndJdSearchParams): Promise<KfTarcSpAndJdSpResponse.MappedAndCountedDbResponse> {
        this.logger.debug(`getSpsAndJds search parameters: ${JSON.stringify(searchParams)}`);

        const _KFRoleLevel = searchParams.roleLevel;
        const _UAMProfileCollectionID = searchParams.profileCollectionId;

        const result = await this.sql.query(`
                    exec SuccessProfile.dbo.GetPMSearchProfiles
                        ${ _KFRoleLevel ? '@In_KFRoleLevel = :roleLevel,' : '' }
                        ${ _UAMProfileCollectionID ? '@In_UAMProfileCollectionID = :uamProfileCollectionId,' : '' }
                        @in_clientID = :clientId,
                        @in_userId = :userId,
                        @in_locale = :locale,
                        @SectionProductId = :sectionProductId,
                        @In_sortColumn = :sortColumns,
                        @In_sortBy = :sortOrders,
                        @In_searchString = :searchString,
                        @In_Function = :functions,
                        @In_SubFunction = :subFunctions,
                        @In_Grade = :grades,
                        @In_Level = :levels,
                        @In_ProfileType = :profileTypes,
                        @In_Industry = :industries,
                        @In_CreatedBy = :createdBy,
                        @In_pageIndex = :pageIndex,
                        @In_pageSize = :pageSize,
                        @In_profileCollectionIDs = :profileCollections
                `,
            {
                clientId: toNumber(searchParams.clientId),
                userId: toNumber(searchParams.userId),
                locale: toLocale(searchParams.locale),
                sectionProductId: toNumber(searchParams.sectionProductId),
                sortColumns: toStringOr(searchParams.sortColumns) || null,
                sortOrders: toStringOr(searchParams.sortOrders) || null,
                searchString: toStringOr(searchParams.searchString) || null,
                functions: toStringOr(searchParams.functions) || null,
                subFunctions: toStringOr(searchParams.subFunctions) || null,
                grades: toStringOr(searchParams.grades) || null,
                levels: toStringOr(searchParams.levels) || null,
                profileTypes: toStringOr(searchParams.profileTypes) || null,
                industries: toStringOr(searchParams.industries) || null,
                createdBy: toStringOr(searchParams.createdBy) || null,
                roleLevel: toNumber(searchParams.roleLevel),
                uamProfileCollectionId: toNumber(searchParams.profileCollectionId),
                profileCollections: toStringOr(searchParams.profileCollections) || null,
                pageIndex: toNumber(searchParams.pageIndex, 0) || Kf.Defaults.pageIndex,
                pageSize: toNumber(searchParams.pageSize, 0) || Kf.Defaults.pageSize,
            }
        );

        return {
            jobs: this.mapSpsAndJds(result),
            totalRecords: result.length > 0
                ? result[0].TotalRecords
                : 0
        };
    }

    mapSpsAndJds(spsAndJds: KfTarcSuccessProfileSearchEntity[]): KfTarcSpAndJdSpResponse.SpAndJd[] {
        return spsAndJds.map(spAndJd => ({
            id: spAndJd.ClientJobId,
            title: spAndJd.JobName,
            description: spAndJd.JobDescription || '',
            isArchitectJob: Boolean(spAndJd.ArchitectJobFlag),
            levelName: spAndJd.Level,
            familyName: spAndJd.JobFamilyName,
            subFamilyName: spAndJd.JobSubFamilyName,
            status: spAndJd.ClientJobStatusID,
            isProfileInProfileCollection: anyTo01(spAndJd.IsProfileInProfileCollection) === 1,
            isTemplateJob: anyTo01(['true', '1'].includes(String(spAndJd.IsTemplateJob).toLowerCase())) === 1,
            profileType: spAndJd.LevelType,
            jobRoleTypeId: spAndJd.JobRoleTypeID,
            enableProfileMatchTool: !!spAndJd.enableProfileMatchTool,
            totalPoints: spAndJd.Haypoints,
            shortProfile: spAndJd.ShortProfile,
            clientIndustryId: spAndJd.ClientIndustryID,
            jrtDetailId: spAndJd.JRTDetailID,
            jobCode: spAndJd.JobCode,
            grade: this.constructCustomGrade(spAndJd.ReferenceLevel, spAndJd.MinGrade, spAndJd.MaxGrade, spAndJd.CustomGrade),
            source: [
                {
                    id: parseInt(spAndJd.JobSourceID),
                    type: KfTarcSpAndJdSpResponse.SourceType.CREATED_BY,
                    firstName: spAndJd.FirstName,
                    lastName: spAndJd.Name,
                    effectiveDateTime: parseInt(spAndJd.CreatedOn),
                },
                {
                    id: parseInt(spAndJd.PersonId),
                    type: KfTarcSpAndJdSpResponse.SourceType.LAST_MODIFIED_BY,
                    firstName: spAndJd.ModifiedFirstName,
                    lastName: spAndJd.ModifiedLastName,
                    effectiveDateTime: parseInt(spAndJd.ModifiedOn),
                },
            ],
        }) as KfTarcSpAndJdSpResponse.SpAndJd);
    }

    removeEmptyProperties(grade: KfTarcSpAndJdSpResponse.Grade): void {
        Object.keys(grade).forEach(key => {
            if (!grade[key] || (key === 'customGrades' && !grade[key]?.grades)) {
                delete grade[key];
            }
        });
    }

    constructCustomGrade(standardHayGrade: number, minGrade?: string, maxGrade?: string, gradeLabels?: string): KfTarcSpAndJdSpResponse.Grade {
        let customGrades = null;
        if (gradeLabels) {
            //.slice(2) means that grades actually start after ||: ||grade1|||grade2|||grade3
            customGrades = {
                grades: gradeLabels
                    ? gradeLabels
                        .slice?.(2)
                        .split('|||')
                        .map(gradeLabel => ({
                            gradeLabel: gradeLabel,
                        }))
                    : null,
            };
        }
        const grades = {
            standardHayGrade,
            min: minGrade,
            max: maxGrade,
            customGrades,
        };
        this.removeEmptyProperties(grades);
        return grades;
    }
}

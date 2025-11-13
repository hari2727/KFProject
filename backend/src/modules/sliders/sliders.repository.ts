import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import {
    AssessmentRawResponse,
    CustomProfilesRawResponse,
    KfiApiResponseRaw,
    RoleRequirementQA,
    TraitsAndDriversResponse,
    TraitsAndDriversSections,
} from './sliders.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Loggers } from '../../_shared/log/loggers';
import { ExportCommonService } from '../../bulkrunner-modules/export/export.service';
import { toNumber } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class SlidersRepository {
    protected logger: LoggerService;

    constructor(
        protected sql: TypeOrmHelper,
        protected loggers: Loggers,
    ) {
        this.logger = loggers.getLogger(ExportCommonService.name);
    }

    async loadSlidersData(clientId: string, clientJobId: number, slidersData: RoleRequirementQA[]): Promise<void> {
        const sliderColumnNames = ['ucpCode', 'sliderValue'];
        const { sliderQueryFragment, sliderParams } = await this.generateSliderQueryFragment(sliderColumnNames, slidersData);
        const sliderQuery = `
                DECLARE @JobID BIGINT;
                SET @JobID = :baseJobID
                CREATE TABLE #tmpSlider (
                    ucpCode nvarchar(20),
                    sliderValue decimal(15,9)
                )
                INSERT INTO #tmpSlider (
                    ucpCode,
                    sliderValue
                ) VALUES ${sliderQueryFragment}

                DELETE FROM
                    SuccessProfile.dbo.ClientJobDecisionMakingSlider
                WHERE
                    ClientJobID = @JobID;

                INSERT INTO SuccessProfile.dbo.ClientJobDecisionMakingSlider (
                    ClientJobID,
                    DomainCode,
                    DomainQuestionValue,
                    DomainQuestionOrder,
                    CreatedDate
                )
                SELECT
                    @JobID AS ClientJobID,
                    TT.ucpCode,
                    TT.sliderValue,
                    DQ.DomainOrder,
                    GETDATE() AS CreatedDate
                FROM
                    #tmpSlider TT
                INNER JOIN
                    DomainQuestions DQ
                    ON
                        DQ.DomainCode = TT.ucpCode
        `;
        await this.sql.query(sliderQuery, { // todo
            ...sliderParams,
            baseJobID: toNumber(clientJobId)
        });
    }

    async loadSlidersTraitsAndDriversData(
        clientId: string,
        clientJobId: number,
        data: TraitsAndDriversResponse,
    ): Promise<void> {
        const queryRunner = this.sql.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const traitsColumnNames = [
                'ClientJobID',
                'JobSectionID',
                'JobCategoryID',
                'JobSubCategoryID',
                'JobLevelOrder',
                'SectionDetailOrder',
                'JobSubCategoryType',
                'CoherenceLevel',
                'UserEdited',
                'score',
            ];
            const { traitsQueryFragment, traitsParams } = await this.generateClientJobQueryFragment(traitsColumnNames, data, clientJobId);
            const traitsQuery = `
                    Create Table #ClientJobDetailsTemp (
                        ClientJobID bigint,
                        JobSectionID bigint,
                        JobCategoryID bigint,
                        JobSubCategoryID bigint,
                        JobLevelOrder smallint,
                        SectionDetailOrder smallint,
                        JobSubCategoryType varchar(3),
                        CoherenceLevel varchar(10),
                        UserEdited smallint,
                        score decimal(18,14)
                    );
                    INSERT INTO #ClientJobDetailsTemp (
                        ClientJobID,
                        JobSectionID,
                        JobCategoryID,
                        JobSubCategoryID,
                        JobLevelOrder,
                        SectionDetailOrder,
                        JobSubCategoryType,
                        CoherenceLevel,
                        UserEdited,
                        core
                    ) VALUES ${traitsQueryFragment}

                    Delete
                        CJD
                    from
                        SuccessProfile.dbo.ClientJobDetails CJD
                    Inner Join
                        SuccessProfile.dbo.JobSection JS
                            on
                                JS.JobSectionID = CJD.JobSectionID
                                    and
                                JS.JobSectionCode in ('TRAITS', 'DRIVERS')
                    where
                        CJD.ClientJobID = :CJDClientJobID

                INSERT INTO
                    SuccessProfile.dbo.ClientJobDetails (
                        ClientJobID,
                        JobSectionID,
                        JobCategoryID,
                        JobSubCategoryID,
                        JobLevelDetailID,
                        SectionDetailOrder,
                        JobSubCategoryType,
                        CoherenceLevel,
                        UserEdited,
                        ModifyDate,
                        score
                    )

                SELECT DISTINCT
                    TT.ClientJobID,
                    TT.JobSectionID,
                    TT.JobCategoryID,
                    TT.JobSubCategoryID,
                    JLD.JobLevelDetailID,
                    TT.SectionDetailOrder,
                    TT.JobSubCategoryType,
                    TT.CoherenceLevel,
                    TT.UserEdited,
                    GETDATE(),
                    TT.Score
                FROM
                    #ClientJobDetailsTemp TT
                INNER JOIN
                    SuccessProfile.dbo.JobLevelDetail AS JLD
                        ON (
                            TT.JobSubCategoryID = JLD.JobSubCategoryID
                                AND
                            JLD.JobLevelDetailOrder = TT.JobLevelOrder
                        )
            `;
            await this.sql.query(traitsQuery, {
                ...traitsParams,
                CJDClientJobID: toNumber(clientJobId)
            });
            await this.updateNormRegionId(clientJobId);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Error in loading sliders traits and drivers data', e);
            return null;
        } finally {
            await queryRunner.release();
        }
    }

    @LogErrors()
    async getCustomProfiles(clientId: string): Promise<CustomProfilesRawResponse[]> {
        return await this.sql.query(`
                With Jobs as (
                    Select
                        CJ.ClientJobID
                    from
                        SuccessProfile.dbo.ClientJob CJ
                    Inner join
                        SuccessProfile.dbo.Person P
                            on
                                P.PersonID = CJ.JobSourceID
                                    and
                                P.ClientID = :clientId
                    Where
                        CJ.ClientJobStatusID <> 4
                )
                Select
                    CJD.ClientJobID
                from
                    SuccessProfile.dbo.ClientJobDecisionMakingSlider CJD
                Inner join Jobs CJ
                    on
                        CJ.ClientJobID = CJD.ClientJobID
                Group by
                    CJD.ClientJobID Having Count(1) = 24
            `,
            {
                clientId: toNumber(clientId),
            }
        );
    }

    @LogErrors()
    async getJsonForUcpOnProfileId(profileId: number): Promise<KfiApiResponseRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetJobUCPSliderCulturalRanking
                    @InClientJobID = :profileId
            `,
            {
                profileId: toNumber(profileId)
            }
        );
    }

    @LogErrors()
    async updateNormRegionId(clientJobId: number): Promise<void> {
        await this.sql.query(`
                Update CJ
                    Set
                        NormRegionID =
                        Case when
                            NormRegionID in (247, 248)
                                then
                                    249
                                else
                                    NormRegionID
                        End
                    From
                        SuccessProfile.dbo.ClientJob CJ
                    Where
                        ClientJobID = :clientJobId
            `,
            {
                clientJobId: toNumber(clientJobId)
            }
        );
    }

    @LogErrors()
    async getCalculateAssessmentData(clientId: string, clientJobId: number): Promise<AssessmentRawResponse[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetJobUCPSliderCulturalRankingForTRaitsDrivers
                    @InClientID = :clientId,
                    @InClientJobID = :clientJobId
            `,
            {
                clientId: toNumber(clientId),
                clientJobId: toNumber(clientJobId),
            }
        );
    }

    protected async generateClientJobQueryFragment(
        columnNames: string[],
        data: TraitsAndDriversResponse,
        clientJobId: number,
    ): Promise<{ traitsQueryFragment: string; traitsParams: any }> {
        let traitsParams = {};
        let sectionDetailOrder = 1;
        let queryFragment = [];
        let traitsOrder = 1;
        let driversOrder = 1;
        (data.sections || []).map((section: TraitsAndDriversSections) => {
            if (section.code === 'TRAITS') {
                traitsOrder = 1; // Reset order for traits
            } else if (section.code === 'DRIVERS') {
                driversOrder = 1; // Reset order for drivers
            }
            return section.categories.map(category => {
                return category.subCategories.map(subCategory => {
                    const currentOrder = (section.code === 'TRAITS') ? traitsOrder++ : driversOrder++;
                    return subCategory.descriptions.map((description, index) => {
                        const paramNames = columnNames.map(columnName => `${columnName}${sectionDetailOrder}`);
                        const values = [
                            toNumber(clientJobId),
                            toNumber(section.id),
                            toNumber(category.id),
                            toNumber(subCategory.id),
                            description.level,
                            //sectionDetailOrder,
                            toNumber(currentOrder),
                            subCategory.type,
                            null,
                            0,
                            subCategory.descriptions[index].score,
                        ];
                        columnNames.map((columnName, i) => (traitsParams[columnName + sectionDetailOrder] = values[i]));
                        sectionDetailOrder++;
                        queryFragment.push(`(${paramNames.map(param => `:${param}`).join(', ')})`);
                    });
                });
            });
        });
        return { traitsQueryFragment: queryFragment.join(','), traitsParams };
    }

    protected async generateSliderQueryFragment(columnNames: string[], values: RoleRequirementQA[]): Promise<{ sliderQueryFragment: string; sliderParams: any }> {
        let sliderParams = {};
        const sliderQueryFragment = values
            .map((value, index) => {
                const paramNames = columnNames.map(columnName => `${columnName}${index}`);
                const values = [value.ucpCode, value.sliderValue];
                columnNames.map((columnName, i) => (sliderParams[columnName + index] = values[i]));
                return `(${paramNames.map(param => `:${param}`).join(', ')})`;
            })
            .join(',');

        return { sliderQueryFragment, sliderParams };
    }
}

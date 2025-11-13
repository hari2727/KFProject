import { Injectable } from '@nestjs/common';
import { find } from '../../common/common.utils';
import { AppCode } from '../../app.const';
import { AppError } from '../../_shared/error/app-error';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class KfTarcCompareSkillsService {

    constructor(protected sql: TypeOrmHelper) {
    }

    async compareSkills(query, body) {
        // Start time

        const CUSTOM_PROFILES = [];
        const BEST_IN_CLASS = [];
        const OTHER_PROFILES = [];

        const data = await this.getProfilesAndSkills(query.loggedInUserClientId, body.jobTitle, query.locale);

        const mappedDBResult = [];
        data.map(el => {
            const temp = find(mappedDBResult, `ClientJobID`, el.ClientJobID);
            if (!temp.found) {
                const a = {
                    ClientJobID: el.ClientJobID,
                    JobName: el.JobName,
                    ProfileType: el.ProfileType,
                    SkillsName: [el.SkillsName],
                }
                return mappedDBResult.push(a);
            }
            mappedDBResult[temp.index].SkillsName.push(el.SkillsName);
        })

        await Promise.all(mappedDBResult.map(async (el) => {
            if (el.ProfileType === 'CUSTOM_PROFILE') {
                CUSTOM_PROFILES.push(
                    {
                        id: el.ClientJobID,
                        title: el.JobName,
                        profileType: el.ProfileType,
                        skills: await this.compareSkillsWithArya(el.SkillsName, body.skills),
                    })
            } else if (el.ProfileType === 'BEST_IN_CLASS') {
                BEST_IN_CLASS.push(
                    {
                        id: el.ClientJobID,
                        title: el.JobName,
                        profileType: el.ProfileType,
                        skills: await this.compareSkillsWithArya(el.SkillsName, body.skills),
                    }
                )
            } else {
                OTHER_PROFILES.push(
                    {
                        id: el.ClientJobID,
                        title: el.JobName,
                        profileType: el.ProfileType,
                        skills: await this.compareSkillsWithArya(el.SkillsName, body.skills),
                    }
                )
            }
        }));

        let result

        if (CUSTOM_PROFILES.length >= body.outputSPcount) {
            const custom = await this.sortSkills(CUSTOM_PROFILES);

            result = { successProfiles: custom.slice(0, body.outputSPcount) };
        } else if (CUSTOM_PROFILES.length + BEST_IN_CLASS.length >= body.outputSPcount) {

            const custom = await this.sortSkills(CUSTOM_PROFILES);
            const bic = await this.sortSkills(BEST_IN_CLASS);

            result = { successProfiles: [...custom, ...bic].slice(0, body.outputSPcount) };
        } else {
            const custom = await this.sortSkills(CUSTOM_PROFILES);
            const bic = await this.sortSkills(BEST_IN_CLASS);
            const other = await this.sortSkills(OTHER_PROFILES);

            result = { successProfiles: [...custom, ...bic, ...other].slice(0, body.outputSPcount) };
        }

        const listIds = [];
        for (let index = 0; index < body.outputSPcount; index++) {
            result.successProfiles[index] && listIds.push(result.successProfiles[index].id);
        }

        const spDetails = await this.getDetailsQuery(query.loggedInUserClientId, listIds);
        result.successProfiles = result.successProfiles.map(profile => {
            const found = spDetails.find(obj => obj.ClientJobID === profile.id);
            if (found) {
                const mappedDetails = {
                    parentJobDetails: {
                        id: found.ParentJobID,
                        title: found.ParentJobName,
                    },
                    familyId: found.JobFamilyID,
                    familyName: found.JobFamilyName,
                    subFamilyId: found.JobSubFamilyID,
                    subFamilyName: found.JobSubFamilyName,
                    kfLevelMappings: {
                        management: {
                            globalCode: found.LevelCode,
                            label: found.LevelName,
                        },
                        level: {
                            globalCode: found.SubLevelCode,
                            label: found.SubLevelName,
                        }
                    }
                }
                return { ...profile, ...mappedDetails }
            }
        })

        return result;
    }

    async compareSkillsWithArya(spSkills, aryaSkills) {
        return aryaSkills.filter(aryaSkill => {
            if (!spSkills.includes(aryaSkill)) {
                return aryaSkill;
            }
        });
    }

    async sortSkills(data) {
        const sorted = await data.sort((x, y) => {
            if (x.skills.length < y.skills.length) {
                return 1;
            }
            if (x.skills.length > y.skills.length) {
                return -1;
            }
            return x.title > y.title ? 1 : -1;
        })
        return sorted;
    }

    async getProfilesAndSkills(clientId, jobTitle, locale = 'en', totalJobsNeeded = 50) {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GettopProfilesWithMissingSkills
                    :clientId,
                    :jobTitle,
                    :locale,
                    :totalJobsNeeded
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(locale),
                totalJobsNeeded: toNumber(totalJobsNeeded),
                jobTitle: toStringOr(jobTitle),
            }
        );
    }

    @LogErrors()
    async mapSkillsAndProfilesV1(query, body) {
        const skills = body.skills.join('|');

        let dbData = [];
            dbData = await this.getProfilesAndSkillsV1(query.loggedInUserClientId, body.jobTitle, skills, body.outputSPcount, query.locale);

        const mappedDBResult = [];

        if(!dbData.length) {
            throw new AppError('No data', 204, { errorCode: AppCode.SUCCESS });
        }
        dbData.map(el => {
            const temp = find(mappedDBResult, `id`, el.ClientJobID);
            if (!temp.found) {
                return mappedDBResult.push({
                    id: el.ClientJobID,
                    title: el.JobName,
                    profileType: el.ProfileType,
                    skills: [el.SkillsName]
                });
            }
            mappedDBResult[temp.index].skills.push(el.SkillsName);
        });

        const listIds = mappedDBResult.map(el => el.id);

        const spDetails = await this.getDetailsQuery(query.loggedInUserClientId, listIds);

        const resultV1 = mappedDBResult.map(profile => {
            const found = spDetails.find(obj => obj.ClientJobID === profile.id);
            if (found) {
                const mappedDetails = {
                    parentJobDetails: {
                        id: found.ParentJobID,
                        title: found.ParentJobName,
                    },
                    familyId: found.JobFamilyID,
                    familyName: found.JobFamilyName,
                    subFamilyId: found.JobSubFamilyID,
                    subFamilyName: found.JobSubFamilyName,
                    kfLevelMappings: {
                        management: {
                            globalCode: found.LevelCode,
                            label: found.LevelName,
                        },
                        level: {
                            globalCode: found.SubLevelCode,
                            label: found.SubLevelName,
                        }
                    }
                }
                return { ...profile, ...mappedDetails }
            }
        })

        return { successProfiles: resultV1 };
    }

    async getProfilesAndSkillsV1(clientId, jobTitle, skills, outputSPcount, locale = 'en', totalJobsNeeded = 50) {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetProfilesWithMissingSkills
                    :clientId,
                    :jobTitle,
                    :skills,
                    :locale,
                    :totalJobsNeeded,
                    :outputSPcount
            `,
            {
                jobTitle: toStringOr(jobTitle),
                clientId: toNumber(clientId),
                // Stored proc uses XML parser under the hood to process skills,
                // so they should be a valid XML string
                skills: this.escapeXMLString(toStringOr(skills)),
                locale: toLocale(locale),
                totalJobsNeeded: toNumber(totalJobsNeeded),
                outputSPcount: toNumber(outputSPcount)
            },
        );
    }

    async getDetailsQuery(clientId, listOfIds) {
        return await this.sql.query(`
                Select
                    CJ.ClientJobID,
                    CJP.ClientJobID ParentJobID,
                    CJP.JobName ParentJobName,
                    JDM.JobFamilyID,
                    JDM.JobFamilyName,
                    JDM.JobSubFamilyID,
                    JDM.JobSubFamilyName,
                    KM.KFManagementCode LevelCode,
                    KM.KFManagementName LevelName,
                    KFL.KFLevelCode SubLevelCode,
                    KFL.KFLevelName SubLevelName
                from (
                    Select
                        *,
                        substring(JRTDetailID, 1, LEN(JRTDetailID)-4) JobSubFamilyID
                    from
                        SuccessProfile.dbo.ClientJob
                    Where
                        ClientJobID in (${ listOfIds.map(i => toNumber(i)).join(', ') })
                ) CJ
                Left join
                    SuccessProfile.dbo.ClientJob CJP
                        on
                            CJP.ClientJobID = CJ.ParentClientJobID
                INNER JOIN (
                    Select
                        JobFamilyID,
                        JobFamilyName,
                        JobSubFamilyID,
                        JobSubFamilyName
                    from
                        SuccessProfile.dbo.Fn_GetFamilySubFamilyForClient (:clientId, 'en')
                ) JDM
                    ON
                        cj.JobSubFamilyID = jdm.JobSubFamilyID
                Inner join
                    SuccessProfile.dbo.KFLevel KFL
                        on
                            KFL.KFLevelID = CJ.KFLevelID
                Inner join
                    SuccessProfile.dbo.KFManagement KM
                        on KFL.KFManagementID = KM.KFManagementID
            `,
            {
                clientId: toNumber(clientId),
                // listOfIds: listOfIds.map(i => toNumber(i))
            },
        );
    }

    // get 50 profiles ONLY for QA testing
    async getProfiles(query, body) {
        const data = await this.getProfilesAndSkills(query.loggedInUserClientId, body.jobTitle, query.locale);

        const mappedDBResult = [];
        data.map(el => {
            const temp = find(mappedDBResult, `ClientJobID`, el.ClientJobID);
            if (!temp.found) {
                const a = {
                    ClientJobID: el.ClientJobID,
                    JobName: el.JobName,
                    ProfileType: el.ProfileType,
                    SkillsName: [el.SkillsName],
                }
                return mappedDBResult.push(a);
            }
            mappedDBResult[temp.index].SkillsName.push(el.SkillsName);
        })
        return mappedDBResult;
    }

    protected escapeXMLString(input: string): string {
        return input
            .replace(/&/g, '&amp;')
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}

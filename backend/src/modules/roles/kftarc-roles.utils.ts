import { KfTarcRolesInterface as Kf } from './kftarc-roles.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

export class KfRolesUtil {

    @LogErrors()
    getRole(jobRoleTypeId: string, container: Kf.RolesContainer): Kf.Role {
            const index = container.rolesHash[jobRoleTypeId];
            return container.rolesList[index];
    }

    splitJeOrWc(values: string): string[] {
        values = values.replace(/['(',')','%']+/g, '');
        return values.split(' ').filter(o => {
            if (o) {
                return o;
            }
        });
    };

    getJEScoreOptions (type: Kf.JeScoreType): any {
        const { KNOW_HOW, PROBLEM_SOLVING, ACCOUNTABILITY, WORKING_CONDITIONS } = Kf.JeScoreType;

        switch (type) {
            case KNOW_HOW:
                const { PRACTICAL_TECHNICAL_KNOWLEDGE, MANAGERIAL_KNOWLEDGE, COMMUNICATION_INFLUENCING_SKILL } = Kf.KNOW_HOW;
                return {
                    0: PRACTICAL_TECHNICAL_KNOWLEDGE,
                    1: MANAGERIAL_KNOWLEDGE,
                    2: COMMUNICATION_INFLUENCING_SKILL,
                };
            case PROBLEM_SOLVING:
                const { FREEDOM_THINK, PROBLEM_SOLVING_PERCENTAGE, THINKING_CHALLENGE } = Kf.PROBLEM_SOLVING;
                return {
                    0: FREEDOM_THINK,
                    1: THINKING_CHALLENGE,
                    2: PROBLEM_SOLVING_PERCENTAGE,
                };
            case ACCOUNTABILITY:
                const { AREA_IMPACT, FREEDOM_ACT, NATURE_IMPACT } = Kf.ACCOUNTABILITY;
                return {
                    0: FREEDOM_ACT,
                    1: AREA_IMPACT,
                    2: NATURE_IMPACT,
                };
            default:
                return {};
        }
    }

    @LogErrors()
    createJeScores(jeLine: string, workingCondition: string | null, dbResult: any): Kf.JeScore[] {
        const DEFAULT_ARR_LENGTH = 3;
        const WORKING_CONDITIONS_ARR_LENGTH = 4;

            if (!jeLine) {
                return null;
            }
            const data = this.splitJeOrWc(jeLine);
            const result = [];

            const createIndividualJeScore = (array = [], index, loopLength = DEFAULT_ARR_LENGTH): Kf.JeScore => {
                let jeScoreType = null;
                let rationaleDescription = null;
                const { KNOW_HOW, PROBLEM_SOLVING, ACCOUNTABILITY, WORKING_CONDITIONS } = Kf.JeScoreType;
                switch (index) {
                    case 0:
                        jeScoreType = KNOW_HOW;
                        rationaleDescription = dbResult.KHDescription || '';
                        break;
                    case 1:
                        jeScoreType = PROBLEM_SOLVING;
                        rationaleDescription = dbResult.PSDescription || '';
                        break;
                    case 2:
                        jeScoreType = ACCOUNTABILITY;
                        rationaleDescription = dbResult.ACDescription || '';
                        break;
                    case 3:
                        jeScoreType = WORKING_CONDITIONS;
                        rationaleDescription = dbResult.WCDescription || '';
                        break;
                }
                const options = [];
                for (let i = 0; i < loopLength; i++) {
                    const values = this.getJEScoreOptions(jeScoreType);
                    options.push({
                        id: i + 1,
                        code: array[i],
                        type: values[i] || '',
                    });
                }
                return {
                    id: index + 1,
                    jeScoreType,
                    rationaleDescription,
                    points: index === 3 ? array.reduce((a, b) => Number(a) + Number(b), 0) : array[3],
                    options,
                };
            };

            let stage = 0;
            for (let i = 0; i < 3; i++) {
                const input = [data[stage + 0], data[stage + 1], data[stage + 2], data[stage + 3]];
                const output = createIndividualJeScore(input, i);
                result.push(output);
                stage += 4;
            }
            if (workingCondition) {
                const wcData = this.splitJeOrWc(workingCondition);
                const output = createIndividualJeScore(wcData, 3, WORKING_CONDITIONS_ARR_LENGTH);
                result.push(output);
            }

            return result;
    }

    @LogErrors()
    getCommonPropertiesForRoleAndProfile(obj: Kf.databaseDTO): Kf.commonKeys {
            const { JobName, JobFamilyID, JobSubFamilyID, JobRoleTypeID, JobFamilyName, JobSubFamilyName, LevelType } = obj;
            return {
                title: JobName,
                jobFamily: JobFamilyID,
                jobSubFamily: JobSubFamilyID,
                jobRoleTypeId: JobRoleTypeID,
                familyName: JobFamilyName,
                subFamilyName: JobSubFamilyName,
                profileType: LevelType,
            };
    }

    @LogErrors()
    generateRole(obj: Kf.databaseDTO, commonObjProps: Kf.commonKeys): Kf.Role {
            const { MinGrade, MaxGrade } = obj;
            const role: any = {
                ...commonObjProps,
                grade: {
                    min: MinGrade,
                    max: MaxGrade,
                },
                expandable: true,
                profiles: [],
            };
            return role;
    }

    @LogErrors()
    generateSubProfileForRole(obj: Kf.databaseDTO, commonObjProps: Kf.commonKeys): Kf.SubProfile {
            const { HayReferenceLevel = '', ClientJobId = '', ShortProfile, HayPoints, JELineScore = '' } = obj;
            let haypoints = {
                totalPoints: HayPoints,
                jescores: JELineScore ? this.createJeScores(JELineScore, null, obj) : [],
            };
            const role: any = {
                ...commonObjProps,
                id: ClientJobId.toString(),
                shortProfile: ShortProfile,
                haypoints,
                standardHayGrade: HayReferenceLevel.toString(),
            };
            return role;
    }

    @LogErrors()
    generateOtherProfile(obj: Kf.databaseDTO, commonObjProps: Kf.commonKeys): Kf.OtherProfile {
            const { HayReferenceLevel = '', ClientJobId = '', LevelType, MinGrade, MaxGrade } = obj;
            /*If the profile is single BIC profile and is cxo,
              1.grade should be the range.
              2.profileType should be default to BIC
            */
            let cxoProps: any = {};
            const sanitizedLevel = this.sanitizeLevelType(LevelType);

            if (sanitizedLevel === Kf.LevelType.CXO) {
                cxoProps.grade = {
                    min: MinGrade,
                    max: MaxGrade,
                };
                cxoProps.profileType = Kf.LevelType.BIC;
            }
            //for Custom and BOX profiles should be added "shortProfile" and "haypoints"
            let additionalProps: any = {};
            if (sanitizedLevel === Kf.LevelType.CUSTOM || sanitizedLevel === Kf.LevelType.BOX || sanitizedLevel === Kf.LevelType.CXO) {
                const subProfile = this.generateSubProfileForRole(obj, commonObjProps);
                if (subProfile) {
                    additionalProps.shortProfile = subProfile.shortProfile;
                    additionalProps.haypoints = subProfile.haypoints;
                }
            }
            const role: any = {
                ...commonObjProps,
                id: ClientJobId.toString(),
                grade: {
                    standardHayGrade: HayReferenceLevel.toString(),
                },
                expandable: false,
                ...cxoProps,
                ...additionalProps,
            };
            return role;
    }

    @LogErrors()
    updateRoleHash(role: Kf.Role, container: Kf.RolesContainer): void {
            container.rolesList.push(role);
            const hashIndex = container.rolesList.length - 1;
            const { jobRoleTypeId } = role;
            container.currentRole = jobRoleTypeId;
            container.rolesHash[jobRoleTypeId] = hashIndex;
    }


    sanitizeLevelType(input: string): string {
        // check obj leveltype with interface leveltype
        const regex = /[^a-zA-Z]/g;
        const level = input.replace(regex, '').toLowerCase();
        return Kf.MutatedLevelTypeLookup[level]
    }

    @LogErrors()
    groupProfilesUnderRoles(dbData: Kf.databaseDTO[]): Kf.Role[] {
            const rolesDataContainer = {
                rolesList: [],
                rolesHash: {},
                currentRole: null,
            };

            dbData.forEach(obj => {
                const { LevelType } = obj;

                const commonObjProps = this.getCommonPropertiesForRoleAndProfile(obj);
                const sanitizedLevel = this.sanitizeLevelType(LevelType);
                switch (sanitizedLevel) {
                    /* CXO, CUSTOM and BOX profiles are individual profiles and should not be grouped under a ROLE */
                    case Kf.LevelType.CUSTOM:
                    case Kf.LevelType.BOX:
                    case Kf.LevelType.CXO:
                        {
                            const otherProfile = this.generateOtherProfile(obj, commonObjProps);
                            rolesDataContainer.rolesList.push(otherProfile);
                        }
                        break;
                    case Kf.LevelType.ROLE:
                        {
                            const role = this.generateRole(obj, commonObjProps);
                            this.updateRoleHash(role, rolesDataContainer);
                        }
                        break;
                    default: {
                        /*subProfiles that goes under Role*/
                        const subProfile = this.generateSubProfileForRole(obj, commonObjProps);
                        const { jobRoleTypeId } = subProfile;
                        const role = this.getRole(jobRoleTypeId, rolesDataContainer);
                        if (role) {
                            role.profileType = subProfile.profileType;
                            role.profiles.push(subProfile);
                        } else {
 /* These are Single BIC Profiles, No Role Associated to these profiles */
                            const otherProfile = this.generateOtherProfile(obj, commonObjProps);
                            rolesDataContainer.rolesList.push(otherProfile);
                        }
                    }
                }
            });
            return rolesDataContainer.rolesList;
    }
}

/*
ProfileType | Name
 0          | ROLE
 1          | LEVELS
 2          | BEST_IN_CLASS
 3          | O_NET
 4          | CUSTOM_PROFILE
*/

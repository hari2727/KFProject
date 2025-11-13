import { KfPermissions, QueryProps } from '../../common/common.interface';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { options } from '../../common/common.utils';
import { toNumber } from '../../_shared/convert';

export namespace KfTarcRolesInterface {
    export enum JeScoreType {
        KNOW_HOW = 'KNOW_HOW',
        PROBLEM_SOLVING = 'PROBLEM_SOLVING',
        ACCOUNTABILITY = 'ACCOUNTABILITY',
        WORKING_CONDITIONS = 'WORKING_CONDITIONS',
    }

    export enum KNOW_HOW {
        PRACTICAL_TECHNICAL_KNOWLEDGE = 'PRACTICAL_TECHNICAL_KNOWLEDGE',
        MANAGERIAL_KNOWLEDGE = 'MANAGERIAL_KNOWLEDGE',
        COMMUNICATION_INFLUENCING_SKILL = 'COMMUNICATION_INFLUENCING_SKILL',
    }

    export enum PROBLEM_SOLVING {
        FREEDOM_THINK = 'FREEDOM_THINK',
        THINKING_CHALLENGE = 'THINKING_CHALLENGE',
        PROBLEM_SOLVING_PERCENTAGE = 'PROBLEM_SOLVING_PERCENTAGE',
    }

    export enum ACCOUNTABILITY {
        FREEDOM_ACT = 'FREEDOM_ACT',
        AREA_IMPACT = 'AREA_IMPACT',
        NATURE_IMPACT = 'NATURE_IMPACT',
    }

    export enum LevelType {
        CUSTOM = 'CUSTOM_PROFILE',
        BIC = 'BEST_IN_CLASS',
        ROLE = 'ROLE',
        LEVELS = 'LEVELS',
        CXO = 'CXO-PROFILE',
        BOX = 'BOX_PROFILE',
    }

    export enum MutatedLevelTypeLookup {
        customprofile = 'CUSTOM_PROFILE',
        bestinclass = 'BEST_IN_CLASS',
        role = 'ROLE',
        levels = 'LEVELS',
        cxoprofile = 'CXO-PROFILE',
        boxprofile = 'BOX_PROFILE',
        onet = 'O_NET',
    }

    export enum ProfileType {
        ROLE = 0,
        LEVELS = 1,
        BIC = 2,
        O_NET = 3,
        CUSTOM = 4,
        BOX = 5,
    }

    export enum Sort {
        NAME = 'NAME',
        DESC = 'DESC',
        ASC = 'ASC',
    }

    export enum FilterType {
        GRADES = 'GRADES',
        FUNCTIONS = 'FUNCTIONS',
        SUBFUNCTIONS = 'SUBFUNCTIONS',
        PROFILES = 'PROFILE_TYPE',
        ROLE_TYPE = 'ROLE_TYPE',
        VALUE_STREAM = 'VALUE_STREAM',
        PROFILE_COLLECTIONS = 'PROFILE_COLLECTIONS'
    }

    export interface FilterValues {
        grades: string;
        profiles: string;
        subFunctions: string;
        roleTypes: string;
        valueStreams: string;
        profileCollections: string;
    }

    export enum Delimiter {
        COMMA = ',',
        COLON = ';',
        PIPE = '|',
    }

    export enum Defaults {
        pageSize = 20,
        pageIndex = 1,
        locale = 'en',
        section = 1,
    }

    export const NullString = 'NULL';
    export class RolesQueryParams extends QueryProps.Default {
        @IsString()
        @IsOptional()
        searchString: string = '';

        @IsString()
        @IsOptional()
        sortColumn: string = Sort.NAME;

        @IsString()
        @IsOptional()
        sortBy: string = Sort.ASC;

        @IsString()
        @IsOptional()
        filterBy: string = '';

        @IsString()
        @IsOptional()
        filterValues: string = '';

        @IsOptional()
        @Transform(toNumber, options)
        pageIndex: number = 1;

        @IsOptional()
        @Transform(toNumber, options)
        pageSize: number = 20;

        @IsOptional()
        @Transform(toNumber, options)
        boxProfile: number = 0;
    }

    export class databaseDTO {
        LCID?: string;
        PersonId?: string;
        FirstName?: string;
        LastName?: string;
        JobDescription?: string;
        CreatedBy?: string;
        CreatedOn?: string;
        ModifiedOn?: string;
        ClientId?: string;
        CustomGrade?: string;
        ClientJobId: number | null;
        SortField?: string;
        ParentClientJobID: number | null;
        JobRoleTypeID: string;
        JobName: string;
        MinGrade: number | null;
        MaxGrade: number | null;
        Midpoint: number | null;
        HayReferenceLevel: number | null;
        JobFamilyID: string;
        JobFamilyName: string;
        JobSubFamilyID: string;
        JobSubFamilyName: string;
        LevelType: LevelType | string;
        ProfileType: number;
        ShortProfile: string | null;
        HayPoints: number | null;
        JELineScore: null | string;
        TotalRoleNumber: number;
        TotalResultRecords: number;
        TotalShowRecords: number;
    }
    export interface RolesList {
        roles: Role[];
        paging: Paging;
    }

    export interface Paging {
        pageIndex: number;
        pageSize: number;
        totalPages: number;
        totalResultRecords: number;
        totalShowRecords: number;
    }

    export interface Grade {
        standardHayGrade?: string;
        min?: number;
        max?: number;
    }

    export interface Haypoints {
        totalPoints: number;
        min: number;
        max: number;
        jeScores: JeScore[];
    }

    export interface JeScore {
        id: number;
        jeScoreType: JeScoreType;
        points?: number;
        rationaleDescription?: string;
        options: Option[];
    }

    export interface Option {
        id: number;
        type: string;
        code?: string;
    }

    export class commonKeys {
        title: string;
        jobFamily: string;
        jobSubFamily: string;
        jobRoleTypeId: string;
        familyName: string;
        subFamilyName: string;
        profileType: string;
    }

    export class RolesContainer {
        rolesList: Role[];
        rolesHash: object;
        currentRole: null | string;
    }

    export class Role extends commonKeys {
        grade: Grade;
        expandable: boolean;
        profiles?: SubProfile[];
    }

    export class SubProfile extends commonKeys {
        id: string;
        shortProfile: string;
        haypoints: object;
        standardHayGrade: string;
    }

    export class OtherProfile extends commonKeys {
        id: string;
        grade: {
            standardHayGrade: string;
        };
        expandable: boolean;
        profiles?: SubProfile[];
    }
    export interface SuccessProfilesPermissions extends KfPermissions {
    }
    export interface FilterByWithoutLevels {
        filterByWithoutLevel: string;
        filterValuesWithoutLevel: string;
        levelFilter: string;
    }
}

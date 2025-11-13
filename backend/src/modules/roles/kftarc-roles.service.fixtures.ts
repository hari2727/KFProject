import { KfTarcRolesInterface as Kf, KfTarcRolesInterface } from './kftarc-roles.interface';
import { Request } from 'express';
import { KfRestrictions } from '../../common/common.interface';

export namespace GlobalServiceMocks {
    export const defaultQueryParams: Kf.RolesQueryParams = {
        searchString: '',
        sortColumn: '',
        sortBy: '',
        filterBy: '',
        filterValues: '',
        pageIndex: 1,
        pageSize: 20,
        loggedInUserClientId: 23139,
        userId: 23139,
        locale: 'en',
        boxProfile: 0,
    };

    export const queryParamsWithFilters: Kf.RolesQueryParams = {
        searchString: '',
        sortColumn: '',
        sortBy: '',
        filterBy: 'VALUE_STREAM|ROLE_TYPE|PROFILE_TYPE|FUNCTIONS|SUBFUNCTIONS|GRADES',
        filterValues: '1170;1164|1174;1187|0;1;2;3|BB|BBD;BBE;BBF|07;08;09',
        pageIndex: 1,
        pageSize: 20,
        loggedInUserClientId: 23139,
        userId: 23139,
        locale: 'en',
        boxProfile: 0,
    };

    export const queryParamsWithErroraneousFilterBy: Kf.RolesQueryParams = {
        ...queryParamsWithFilters,
        filterBy: 'RoLETYpe|PROFILE_TYPE|FUNCTIONS|SUBFUNCTIONS|GRADES',
        filterValues: '1174;1187|0;1;2;3|BB|BBD;BBE;BBF|07;08;09',
    };

    export const queryParamsWithErroraneousFilterValues: Kf.RolesQueryParams = {
        ...queryParamsWithFilters,
        filterBy: 'PROFILE_TYPE|FUNCTIONS|SUBFUNCTIONS|GRADES',
        filterValues: '0;1;2;3|BB|BBD;BBE;BBF|07;08;09|07;08;09|07;08;09',
    };

    export const queryParamsWithCommonFilters: Kf.RolesQueryParams = {
        searchString: '',
        sortColumn: '',
        sortBy: '',
        filterBy: 'PROFILE_TYPEFUNCTIONSSUBFUNCTIONSGRADES',
        filterValues: '0;1;2;3BBBBD;BBE;BBF07;08;09',
        pageIndex: 1,
        pageSize: 20,
        loggedInUserClientId: 23139,
        userId: 23139,
        locale: 'en',
        boxProfile: 0,
    };

    export const mockRequest = {
        body: {},
        headers: {},
    } as Request;

    mockRequest.headers = {
        authtoken: '',
    };

    export const mockRestrictions: KfRestrictions = { isExec: 0, pointValue: null };

    export const mockPermissions: KfTarcRolesInterface.SuccessProfilesPermissions = {} as KfTarcRolesInterface.SuccessProfilesPermissions;
}

export namespace GetFilterValuesMocks {
    export const expectedFilterObject = {
        grades: '07,08,09',
        profiles: '0,1,2,3',
        subFunctions: "''BBD'' ,''BBE'' ,''BBF'' ",
        roleTypes: '1174,1187',
        valueStreams: '1170,1164',
        profileCollections: ''
    };
    export const EmptyStringsFilterObject = {
        grades: '07,08,09',
        profiles: '0,1,2,3',
        subFunctions: "''BBD'' ,''BBE'' ,''BBF'' ",
        roleTypes: '',
        valueStreams: '',
        profileCollections: ''
    };
}

export namespace ExecStoreProcMocks {
    export const mockDbData = [
        {
            ClientJobId: '92624',
            ParentClientJobID: '92623',
            JobRoleTypeID: 'EGA01',
            JobName: '02.25.2021 CL daily smoke edit',
            MinGrade: 'NULL',
            MaxGrade: 'NULL',
            Midpoint: '14',
            HayReferenceLevel: '14',
            JobFamilyID: 'EG',
            JobFamilyName: 'Engineering',
            JobSubFamilyID: 'EGA',
            JobSubFamilyName: 'General Engineers',
            LevelType: Kf.LevelType.CUSTOM,
            ProfileType: '4',
            ClientId: '12024',
            ShortProfile: 'A3',
            HayPoints: '301',
            JELineScore: 'D+ I 2  175  D 3 29  50  D- N IV+  76      301',
            TotalRoleNumber: '0',
            TotalResultRecords: '2',
            TotalShowRecords: '2',
        },
    ];
}

export namespace GenerateQueryMocks {
    export const mockDbData = [
        {
            ClientJobId: '92624',
            ParentClientJobID: '92623',
            JobRoleTypeID: 'EGA01',
            JobName: '02.25.2021 CL daily smoke edit',
            MinGrade: 'NULL',
            MaxGrade: 'NULL',
            Midpoint: '14',
            HayReferenceLevel: '14',
            JobFamilyID: 'EG',
            JobFamilyName: 'Engineering',
            JobSubFamilyID: 'EGA',
            JobSubFamilyName: 'General Engineers',
            LevelType: Kf.LevelType.CUSTOM,
            ProfileType: '4',
            ClientId: '12024',
            ShortProfile: 'A3',
            HayPoints: '301',
            JELineScore: 'D+ I 2  175  D 3 29  50  D- N IV+  76      301',
            TotalRoleNumber: '0',
            TotalResultRecords: '2',
            TotalShowRecords: '2',
        },
    ];
    export const mockFilters =  {
        grades: '',
        profiles: '',
        subFunctions: '',
        roleTypes: '',
        valueStreams: '',
        profileCollections:''
    }
}

import { ExportOutputLocationConfig, PageDataConfig } from './export.interface';
import { buildPageDataResponse } from './export.util';
import { ContentTypes } from '../../../common/common.const';

export enum ExportType {
    Json = 'json',
    Xlsx = 'xlsx',
}

export const ExportContentType = {
    [ExportType.Json]: ContentTypes.JSON,
    [ExportType.Xlsx]: ContentTypes.XLSX,
};

export enum OutputType {
    Beehive = 'beehive',
    S3 = 's3',
    Inline = 'inline',
}

export enum ExportOutputLocation {
    BHDEV = 'bhdev',
    BHQA = 'bhqa',
    SQ2 = 'sq2',
    PREPROD = 'pp',
    PROD ='pdue',
    PRODEU ='pden'
}

export const ExportOutputLocations: { [target: string]: ExportOutputLocationConfig } = {
    [ExportOutputLocation.BHDEV]: {
        url: 'https://api.int.bhdev.kfddev.com/sp-ext/uploadBicProfiles',
    },
    [ExportOutputLocation.BHQA]: {
        url: 'https://api.int.bhqa.kfddev.com/sp-ext/uploadBicProfiles',
    },
    [ExportOutputLocation.SQ2]: {
        url: 'https://api.int.sq2.kfddev.com/sp-ext/uploadBicProfiles',
    },
    [ExportOutputLocation.PREPROD]: {
        url: 'https://api.kfcareertech-beta.kornferry.com/sp-ext/uploadBicProfiles',
    },
    [ExportOutputLocation.PROD]: {
        url: 'https://api.kfcareertech.kornferry.com/sp-ext/uploadBicProfiles',
    },
    [ExportOutputLocation.PRODEU]: {
        url: 'https://api.kfcareertech.kornferry.eu/sp-ext/uploadBicProfiles',
    },
}

export enum OutputStructureFormat {
    Map = 10,
    UnpackedMap = 11,
    List = 20,
    UnpackedList = 21,
}

export enum ColumnName {
    entityId = 'JobID',
    entityType = 'Success Profile/Job Description',
    profileType = 'Profile Type',
    entityName = 'SP/JD Name',
}

export const S3UploadLocalPath = 'IntelligenceCloudExports';
export const EntityKeyColumnName = ColumnName.entityId;

export const SharedColumnNames = [
    ColumnName.entityName,
    ColumnName.entityType,
    ColumnName.profileType,
    ColumnName.entityName,
];

export const MainPageName = 'Success Profiles';

export const PageDataConfigs: PageDataConfig[] = [
    {
        pageName: MainPageName,
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportSuccessProfiles'
    },
    {
        pageName: 'Responsibility',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportResponsibilities'
    },
    {
        pageName: 'Education',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportEducation'
    },
    {
        pageName: 'Behavioral Comps',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportBehavioralSkills'
    },
    {
        pageName: 'Skills',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportSkills'
    },
    {
        pageName: 'Drivers',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportDrivers'
    },
    {
        pageName: 'General Exp',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportGeneralExp'
    },
    {
        pageName: 'Managerial Exp',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportManagerialExp'
    },
    {
        pageName: 'Traits',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportTraits'
    },
    {
        pageName: 'Cognitive Abilities',
        data: buildPageDataResponse([]),
    },
    {
        pageName: 'Elements Library',
        data: buildPageDataResponse([]),
    },
    {
        pageName: 'Levels Library',
        data: buildPageDataResponse([]),
    },
    {
        pageName: 'UCP Sliders & Cultural Rankings',
        data: buildPageDataResponse([]),
    },
    {
        pageName: 'TimeInRole',
        storedProcedureName: 'SuccessProfile.dbo.GenerateICCustomSPExportTimeInRole'
    },
];

export const XlsxHeaderColor = '#E2F0D9';
export const XlsxColumnDefaultWidth = 60;
export const XlsxColumnWidths: { [columnName: string | ColumnName]: number } = {
    "Behavioral Competency Level Description": 60,
    "Behavioral Competency Name": 60,
    "Bic Profile": 15,
    "Code": 15,
    "Comments": 60,
    "Created On": 30,
    "Description": 60,
    "Driver Level Description": 60,
    "Driver Name": 30,
    "Education": 30,
    "Education Level Description": 60,
    "Function": 60,
    "Function ID": 15,
    "General Experience": 30,
    "General Experience Level Description": 60,
    "Grade": 15,
    "HRLevel": 15,
    "IC Function Code": 30,
    "IC Function Name": 60,
    "IC JRTDetailID": 30,
    "IC Sub Function Code": 30,
    "IC Sub Function Name": 60,
    "IC2 Subfunction": 60,
    "Important?": 15,
    "JELineScore": 60,
    [ColumnName.entityId]: 15,
    "Level": 30,
    "Level Name": 30,
    "Managerial Experience": 30,
    "Managerial Experience Level Description": 60,
    "May 2022 SP Code": 30,
    "Modified On": 30,
    "months_25pctile": 15,
    "months_50pctile": 15,
    "months_75pctile": 15,
    "months_average": 15,
    "Position": 30,
    [ColumnName.profileType]: 30,
    "Responsibility Category": 30,
    "Responsibility Level Description": 60,
    "Responsibility Name": 60,
    "ShortProfile": 15,
    "skillID": 15,
    "SkillName": 30,
    "sp_name": 60,
    "sp_subfamily": 30,
    "sp_subfamily_name": 60,
    [ColumnName.entityName]: 60,
    "StenScore": 15,
    "Sub Function ID": 15,
    "Sub Level Name": 30,
    "Sub-Function": 60,
    [ColumnName.entityType]: 30,
    "Trait Level Description": 60,
    "Trait Name": 30,
    "UniqueID": 30,
    "VersionNo": 15,
    "Work Ladder Code": 30,
};

import { BulkPublishStatusDBResponse } from './bm-mssql.i';
import {
    BmBodyStage,
    BmQueryPropsCompLevels,
    BmQueryPropsComps,
    BmQueryPropsSpsData,
    BmQueryPropsSpsDataDecoded,
    BulkPublishStatusQueryParams,
    BulkPublishStatusResponse,
    SkillsQueryProps
} from './bm.service.i';

const definedOr = (value, orValue) => (typeof value === 'undefined' ? orValue : value);
const getRandomNumber = (min: number = 1, max: number = 100) => Math.round(Math.random() * (max - min));
const getRandomString = (opts?: object) => {
    const { min, max, dict } = Object.assign(
        {
            min: 0,
            max: 100,
            dict: 'abcdefghijklmnopqrstuvwxyz0123456789',
        },
        definedOr(opts, {}),
    );
    const e = '';
    const dl = Math.max(0, dict.length - 1);
    return dl
        ? Array(min + getRandomNumber(min, max))
              .fill(e)
              .reduce(a => a + dict[getRandomNumber(0, dl)], e)
        : e;
};

export const spsDataQuery: BmQueryPropsSpsData = {
    loggedInUserClientId: getRandomNumber(),
    userId: getRandomNumber(),
    locale: 'en',
    pageIndex: '0',
    pageSize: '200',
    searchColumn: 'JOB_TITLE',
    searchString: '',
    sortBy: 'DESC',
    sortColumn: 'JOB_TITLE',
    filterBy: 'GRADE|LEVEL',
    filterValues: 'grade1;grade2|level1',
};

export const spsDataQueryDecoded: BmQueryPropsSpsDataDecoded = {
    loggedInUserClientId: spsDataQuery.loggedInUserClientId,
    userId: spsDataQuery.userId,
    locale: spsDataQuery.locale,
    custGrade: '',
    grade: '',
    level: '',
    pageIndex: +spsDataQuery.pageIndex,
    pageSize: +spsDataQuery.pageSize,
    searchString: '',
    sortBy: 'DESC',
    sortColumn: 'JOB_TITLE',
    subFunction: '',
};

export const spsDataDbMock = [
    {
        ClientJobId: '118091',
        JobTitle: 'Chief Corporate Banking OfficerHead of Corporate Banking COPY',
        Grade: '28',
        MinGrade: '21',
        MaxGrade: '35',
        IsExecutive: '1',
        JobFamilyID: 'CB',
        FunctionName: 'Corporate Banking',
        JobSubFamilyID: 'CBG',
        SubFunctionName: 'Corporate Banking',
        KFManagementID: '2',
        KFManagementName: 'Senior Executive',
        CustomGrade: '',
        Midpoint: '3300',
        GradesetID: '1',
        GradeSetName: 'Korn Ferry Standard Grades',
        TotalProfiles: '1752',
    },
    {
        ClientJobId: '92678',
        JobTitle: 'Head of Banking COPY',
        Grade: '26',
        MinGrade: '',
        MaxGrade: '',
        IsExecutive: '1',
        JobFamilyID: 'BB',
        FunctionName: 'Branch Financial ServicesBanking',
        JobSubFamilyID: 'BBX',
        SubFunctionName: 'General',
        KFManagementID: '2',
        KFManagementName: 'Senior Executive',
        CustomGrade: '||ExampleCUstomGrade',
        Midpoint: '2345',
        GradesetID: '1',
        GradeSetName: 'Korn Ferry Standard Grades',
        TotalProfiles: '1752',
    },
    {
        ClientJobId: '92634',
        JobTitle: 'SeniorTop Business Group Executive',
        Grade: '25',
        MinGrade: '',
        MaxGrade: '',
        IsExecutive: '1',
        JobFamilyID: 'EM',
        FunctionName: 'Executive Management',
        JobSubFamilyID: 'EMA',
        SubFunctionName: 'Corporate ExecutivesC-suite',
        KFManagementID: '2',
        KFManagementName: 'Senior Executive',
        CustomGrade: '',
        Midpoint: '1970',
        GradesetID: '1',
        GradeSetName: 'Korn Ferry Standard Grades',
        TotalProfiles: '1752',
    },
];

export const spsDataDbStreamMock = [{ ResultSet: 'DATA' }, ...spsDataDbMock, { ResultSet: 'ID' }, { ClientJobId: '1' }, { ClientJobId: '2' }];

export const getDatasetFromStream = {
    DATA: spsDataDbMock,
    ID: [{ ClientJobId: 11 }, { ClientJobId: 22 }],
};

export const getDatasetFromStreamParsed = [spsDataDbMock, [{ ClientJobId: 11 }, { ClientJobId: 22 }]];

export const spsIdsDbMock = [
    {
        ClientJobId: 1,
    },
    {
        ClientJobId: 2,
    },
    {
        ClientJobId: 3,
    },
];

export const spsIdsResult = [1, 2, 3];

export const spsIdsResultFiltered = [11, 22];

export const spsDataResult = {
    paging: {
        pageIndex: 0,
        pageSize: 200,
        totalPages: 9,
        totalResultRecords: 1752,
    },
    jobs: [
        {
            id: '118091',
            title: 'Chief Corporate Banking OfficerHead of Corporate Banking COPY',
            levelName: 'Senior Executive',
            familyName: 'Corporate Banking',
            grade: {
                standardHayGrade: '28',
                min: '21',
                max: '35',
            },
        },
        {
            id: '92678',
            title: 'Head of Banking COPY',
            levelName: 'Senior Executive',
            familyName: 'Branch Financial ServicesBanking',
            grade: {
                standardHayGrade: '26',
                customGrades: {
                    gradeSetId: '1',
                    gradeSetName: 'Korn Ferry Standard Grades',
                    grades: [
                        {
                            gradeLabel: 'ExampleCUstomGrade',
                        },
                    ],
                },
            },
        },
        {
            id: '92634',
            title: 'SeniorTop Business Group Executive',
            levelName: 'Senior Executive',
            familyName: 'Executive Management',
            grade: {
                standardHayGrade: '25',
            },
        },
    ],
    allJobsIds: spsIdsResult,
    allJobsIdsByFilters: spsIdsResultFiltered,
};

export const spsDataResultEmpty = {
    paging: {
        pageIndex: 0,
        pageSize: 200,
        totalPages: 0,
        totalResultRecords: 0,
    },
    jobs: [],
    allJobsIds: [],
    allJobsIdsByFilters: [],
};

export const spsMetadata = [
    {
        MethodValueID: 1,
        MethodID: 'FUNCTIONS',
        MethodValueLabel: 'Functions',
        LevelID: 'F0138127',
        LevelName: 'Added Function',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: 'S0138127001',
        JobSubFamilyName: 'Added Subfunction',
        LevelOrder: '',
        Description: 'Custom JobSubFamily',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 1,
        MethodID: 'FUNCTIONS',
        MethodValueLabel: 'Functions',
        LevelID: 'F0138127',
        LevelName: 'Added Function',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: 'S0138127002',
        JobSubFamilyName: 'test270721',
        LevelOrder: '',
        Description: 'Custom JobSubFamily',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 1,
        MethodID: 'FUNCTIONS',
        MethodValueLabel: 'Functions',
        LevelID: 'OS',
        LevelName: 'Ambulatory Services EDITED',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: 'OSB',
        JobSubFamilyName: 'Surgery Centers',
        LevelOrder: '',
        Description: 'Surgery Centers',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 1,
        MethodID: 'FUNCTIONS',
        MethodValueLabel: 'Functions',
        LevelID: 'OS',
        LevelName: 'Ambulatory Services EDITED',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: 'OSX',
        JobSubFamilyName: 'General',
        LevelOrder: '',
        Description: 'General',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 2,
        MethodID: 'GRADES',
        MethodValueLabel: 'Grades',
        LevelID: '4',
        LevelName: 'Reference Level 04',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '4',
        Description: '',
        GradeSetID: '1',
        GradeSetName: 'Korn Ferry Standard Grades',
    },
    {
        MethodValueID: 2,
        MethodID: 'GRADES',
        MethodValueLabel: 'Grades',
        LevelID: '5',
        LevelName: 'Reference Level 05',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '5',
        Description: '',
        GradeSetID: '1',
        GradeSetName: 'Korn Ferry Standard Grades',
    },
    {
        MethodValueID: 2,
        MethodID: 'GRADES',
        MethodValueLabel: 'Grades',
        LevelID: '6',
        LevelName: 'Reference Level 06',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '6',
        Description: '',
        GradeSetID: '1',
        GradeSetName: 'Korn Ferry Standard Grades',
    },
    {
        MethodValueID: 3,
        MethodID: 'LEVELS',
        MethodValueLabel: 'Levels',
        LevelID: '1',
        LevelName: 'CEO',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '1',
        Description: '',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 3,
        MethodID: 'LEVELS',
        MethodValueLabel: 'Levels',
        LevelID: '2',
        LevelName: 'Senior Executive',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '2',
        Description: '',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 3,
        MethodID: 'LEVELS',
        MethodValueLabel: 'Levels',
        LevelID: '4',
        LevelName: 'Mid Level Manager',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '4',
        Description: '',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 3,
        MethodID: 'LEVELS',
        MethodValueLabel: 'Levels',
        LevelID: '5',
        LevelName: 'Front Line Manager',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '5',
        Description: '',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 3,
        MethodID: 'LEVELS',
        MethodValueLabel: 'Levels',
        LevelID: '6',
        LevelName: 'Individual Contributor',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '6',
        Description: '',
        GradeSetID: '',
        GradeSetName: '',
    },
    {
        MethodValueID: 2,
        MethodID: 'CUSTOMGRADESET',
        MethodValueLabel: 'Grades',
        LevelID: '1156129',
        LevelName: 'cust10-19',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '516',
        Description: '',
        GradeSetID: '54429',
        GradeSetName: 'Custom Grades Mine Company',
    },
    {
        MethodValueID: 2,
        MethodID: 'CUSTOMGRADESET',
        MethodValueLabel: 'Grades',
        LevelID: '1156241',
        LevelName: 'Grade - 1s',
        SearchType: 'CHECKBOX',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        LevelOrder: '517',
        Description: '',
        GradeSetID: '54429',
        GradeSetName: 'Custom Grades Mine Company',
    },
];

export const spsMetadataResult = {
    isPublished: true,
    metadata: [
        {
            id: 1,
            name: 'LEVELS',
            options: [
                {
                    id: '1',
                    value: 'CEO',
                },
                {
                    id: '2',
                    value: 'Senior Executive',
                },
                {
                    id: '4',
                    value: 'Mid Level Manager',
                },
                {
                    id: '5',
                    value: 'Front Line Manager',
                },
                {
                    id: '6',
                    value: 'Individual Contributor',
                },
            ],
            value: 'Levels',
        },
        {
            id: 2,
            name: 'GRADES',
            options: [
                {
                    id: '4',
                    name: '4',
                    value: 'Reference Level 04',
                },
                {
                    id: '5',
                    name: '5',
                    value: 'Reference Level 05',
                },
                {
                    id: '6',
                    name: '6',
                    value: 'Reference Level 06',
                },
                {
                    id: '1156129',
                    name: '1156129',
                    value: 'cust10-19',
                },
                {
                    id: '1156241',
                    name: '1156241',
                    value: 'Grade - 1s',
                },
            ],
            value: 'Grades',
        },
        {
            id: 3,
            name: 'FUNCTIONS',
            options: [
                {
                    id: 'F0138127',
                    searchOn: {
                        name: 'SUBFUNCTIONS',
                        subOptions: [
                            {
                                id: 'S0138127001',
                                value: 'Added Subfunction',
                            },
                            {
                                id: 'S0138127002',
                                value: 'test270721',
                            },
                        ],
                    },
                    value: 'Added Function',
                },
                {
                    id: 'OS',
                    searchOn: {
                        name: 'SUBFUNCTIONS',
                        subOptions: [
                            {
                                id: 'OSB',
                                value: 'Surgery Centers',
                            },
                            {
                                id: 'OSX',
                                value: 'General',
                            },
                        ],
                    },
                    value: 'Ambulatory Services EDITED',
                },
            ],
            value: 'Functions',
        },
    ],
};

export const spsMetadataResultEmpty = {
    metadata: [],
    isPublished: false,
};

export const modelVersionMock = {
    ClientID: getRandomNumber(),
    CompetencyModelID: getRandomString(),
    CompetencyModelGUID: getRandomString(),
    CompetencyModelVersion: getRandomString(),
    CompetencyModelStatus: getRandomString(),
    CompetencyModelName: getRandomString(),
    CompetencyModelDescription: getRandomString(),
    LCID: getRandomString(),
    LocaleName: getRandomString(),
};

export const modelVersionResult = {
    modelGuid: modelVersionMock.CompetencyModelGUID,
    modelVersion: modelVersionMock.CompetencyModelVersion,
};

export const competencyModelQuery: BmQueryPropsComps = {
    loggedInUserClientId: getRandomNumber(),
    userId: getRandomNumber(),
    locale: 'en',
    modelguid: getRandomString(),
    modelversion: getRandomString(),
};

export const competencyModelMock = [
    {
        ClientID: '12024',
        FactorId: '3F4416B7-F85E-EB11-AA69-000D3A8E4A18',
        FactorIsActive: '1',
        FactorIsCustom: '1',
        FactorName: 'sac 13.5.22',
        FactorDescription: 'NULL',
        ClusterId: '523CCABE-F85E-EB11-AA69-000D3A8E4A18',
        ClusterIsActive: '1',
        ClusterIsCustom: '1',
        ClusterName: 'sac 13.5.22',
        ClusterDescription: 'NULL',
        CompetencyId: '6CFC3288-84D2-EC11-AA7A-000D3A8E4A18',
        CompetencyIsActive: '1',
        CompetencyIsCustom: '1',
        CompetencyName: 'e2e-8576469484561 bc',
        CompetencyDescription: 'sac 13.5.22',
        JobSubCategoryId: '248974',
    },
    {
        ClientID: '12024',
        FactorId: '3F4416B7-F85E-EB11-AA69-000D3A8E4A18',
        FactorIsActive: '1',
        FactorIsCustom: '1',
        FactorName: 'sac 13.5.22',
        FactorDescription: 'NULL',
        ClusterId: '523CCABE-F85E-EB11-AA69-000D3A8E4A18',
        ClusterIsActive: '1',
        ClusterIsCustom: '1',
        ClusterName: 'sac 13.5.22',
        ClusterDescription: 'NULL',
        CompetencyId: '9D560A9E-8F35-ED11-AA80-000D3A8E4A18',
        CompetencyIsActive: '1',
        CompetencyIsCustom: '1',
        CompetencyName: 'e2e-7689441166661 bc',
        CompetencyDescription: 'Test 1609',
        JobSubCategoryId: '276057',
    },
    {
        ClientID: '12024',
        FactorId: '3F4416B7-F85E-EB11-AA69-000D3A8E4A18',
        FactorIsActive: '1',
        FactorIsCustom: '1',
        FactorName: 'sac 13.5.22',
        FactorDescription: 'NULL',
        ClusterId: '523CCABE-F85E-EB11-AA69-000D3A8E4A18',
        ClusterIsActive: '1',
        ClusterIsCustom: '1',
        ClusterName: 'sac 13.5.22',
        ClusterDescription: 'NULL',
        CompetencyId: '68135A2A-E12F-EC11-AA73-000D3A8E4A18',
        CompetencyIsActive: '1',
        CompetencyIsCustom: '1',
        CompetencyName: 'test 181021',
        CompetencyDescription: 'test competency',
        JobSubCategoryId: '189044',
    },
    {
        ClientID: '12024',
        FactorId: '3F4416B7-F85E-EB11-AA69-000D3A8E4A18',
        FactorIsActive: '1',
        FactorIsCustom: '1',
        FactorName: 'sac 13.5.22',
        FactorDescription: 'NULL',
        ClusterId: '523CCABE-F85E-EB11-AA69-000D3A8E4A18',
        ClusterIsActive: '1',
        ClusterIsCustom: '1',
        ClusterName: 'sac 13.5.22',
        ClusterDescription: 'NULL',
        CompetencyId: '834C9D22-CCBF-EC11-AA79-000D3A8E4A18',
        CompetencyIsActive: '1',
        CompetencyIsCustom: '1',
        CompetencyName: '190422comp',
        CompetencyDescription: 'test',
        JobSubCategoryId: '232973',
    },
    {
        ClientID: '12024',
        FactorId: 'B71A34A0-E8AA-4BD1-946E-143ADA8B69C3',
        FactorIsActive: '1',
        FactorIsCustom: '0',
        FactorName: 'THOUGHT 270721',
        FactorDescription: null,
        ClusterId: '6068CB70-CAA9-4D37-9F36-F6E3024ADC46',
        ClusterIsActive: '1',
        ClusterIsCustom: '0',
        ClusterName: 'Understanding the Business test27',
        ClusterDescription: null,
        CompetencyId: '6A6CF18D-E8EE-EB11-AA70-000D3A8E4A18',
        CompetencyIsActive: '1',
        CompetencyIsCustom: '1',
        CompetencyName: 'test270721 28',
        CompetencyDescription: 'testr',
        JobSubCategoryId: '182339',
    },
    {
        ClientID: '12024',
        FactorId: 'B71A34A0-E8AA-4BD1-946E-143ADA8B69C3',
        FactorIsActive: '1',
        FactorIsCustom: '0',
        FactorName: 'THOUGHT 270721',
        FactorDescription: null,
        ClusterId: '6068CB70-CAA9-4D37-9F36-F6E3024ADC46',
        ClusterIsActive: '1',
        ClusterIsCustom: '0',
        ClusterName: 'Understanding the Business test27',
        ClusterDescription: null,
        CompetencyId: '1D476262-7B6B-411E-AE63-435FD609A751',
        CompetencyIsActive: '1',
        CompetencyIsCustom: '0',
        CompetencyName: 'Financial Acumen 24-02',
        CompetencyDescription: 'Interpreting and applying understanding of key financial indicators to make better business decisions.',
        JobSubCategoryId: '101917',
    },
];

export const competencyModelResult = {
    clientId: competencyModelQuery.loggedInUserClientId,
    factors: [
        {
            clusters: [
                {
                    competencies: [
                        {
                            id: '6CFC3288-84D2-EC11-AA7A-000D3A8E4A18',
                            isActive: true,
                            isCustom: true,
                            name: 'e2e-8576469484561 bc',
                            subCategoryId: 248974,
                            type: 'COMPETENCY',
                        },
                        {
                            id: '9D560A9E-8F35-ED11-AA80-000D3A8E4A18',
                            isActive: true,
                            isCustom: true,
                            name: 'e2e-7689441166661 bc',
                            subCategoryId: 276057,
                            type: 'COMPETENCY',
                        },
                        {
                            id: '68135A2A-E12F-EC11-AA73-000D3A8E4A18',
                            isActive: true,
                            isCustom: true,
                            name: 'test 181021',
                            subCategoryId: 189044,
                            type: 'COMPETENCY',
                        },
                        {
                            id: '834C9D22-CCBF-EC11-AA79-000D3A8E4A18',
                            isActive: true,
                            isCustom: true,
                            name: '190422comp',
                            subCategoryId: 232973,
                            type: 'COMPETENCY',
                        },
                    ],
                    id: '523CCABE-F85E-EB11-AA69-000D3A8E4A18',
                    isActive: true,
                    isCustom: true,
                    name: 'sac 13.5.22',
                    type: 'CLUSTER',
                },
            ],
            id: '3F4416B7-F85E-EB11-AA69-000D3A8E4A18',
            isActive: true,
            isCustom: true,
            name: 'sac 13.5.22',
            type: 'FACTOR',
        },
        {
            clusters: [
                {
                    competencies: [
                        {
                            id: '6A6CF18D-E8EE-EB11-AA70-000D3A8E4A18',
                            isActive: true,
                            isCustom: true,
                            name: 'test270721 28',
                            subCategoryId: 182339,
                            type: 'COMPETENCY',
                        },
                        {
                            id: '1D476262-7B6B-411E-AE63-435FD609A751',
                            isActive: true,
                            isCustom: true,
                            name: 'Financial Acumen 24-02',
                            subCategoryId: 101917,
                            type: 'COMPETENCY',
                        },
                    ],
                    id: '6068CB70-CAA9-4D37-9F36-F6E3024ADC46',
                    isActive: true,
                    isCustom: true,
                    name: 'Understanding the Business test27',
                    type: 'CLUSTER',
                },
            ],
            id: 'B71A34A0-E8AA-4BD1-946E-143ADA8B69C3',
            isActive: true,
            isCustom: true,
            name: 'THOUGHT 270721',
            type: 'FACTOR',
        },
    ],
    id: competencyModelQuery.modelguid,
    locale: 'en',
    version: competencyModelQuery.modelversion,
};

export const competencyLevelQuery: BmQueryPropsCompLevels = {
    loggedInUserClientId: getRandomNumber(),
    userId: getRandomNumber(),
    locale: 'en',
    subCategoryIds: '1234|1234|1234',
};

export const competencyLevelMock = [
    {
        JobSubCategoryID: 102074,
        JobSubCategoryName: 'Agility',
        JobLevelOrder: 6,
        JobLevelDetailDesciprtion: 'Promote an agile.',
        JobLevelLabel: null,
        GlobalSubCategoryCode: null,
        JobSubCategoryDescription: 'Ensure rapid decision-making.',
    },
    {
        JobSubCategoryID: 102074,
        JobSubCategoryName: 'Agility',
        JobLevelOrder: 11,
        JobLevelDetailDesciprtion: 'Set the agile context .',
        JobLevelLabel: 'LEVEL 11',
        GlobalSubCategoryCode: null,
        JobSubCategoryDescription: 'Ensure rapid decision-making.',
    },
    {
        JobSubCategoryID: 102075,
        JobSubCategoryName: 'Connectivity',
        JobLevelOrder: 6,
        JobLevelDetailDesciprtion: 'Champion constant.',
        JobLevelLabel: null,
        GlobalSubCategoryCode: null,
        JobSubCategoryDescription: 'Ensure consistent delivery.',
    },
    {
        JobSubCategoryID: 102075,
        JobSubCategoryName: 'Connectivity',
        JobLevelOrder: 11,
        JobLevelDetailDesciprtion: 'Consciously link leaders.',
        JobLevelLabel: 'LEVEL 11',
        GlobalSubCategoryCode: null,
        JobSubCategoryDescription: 'Ensure consistent delivery.',
    },
    {
        JobSubCategoryID: 102076,
        JobSubCategoryName: 'Discipline and Focus',
        JobLevelOrder: 6,
        JobLevelDetailDesciprtion: 'Promote a series of simple level.',
        JobLevelLabel: null,
        GlobalSubCategoryCode: null,
        JobSubCategoryDescription: 'Provide unequivocal clarity approach.',
    },
    {
        JobSubCategoryID: 102076,
        JobSubCategoryName: 'Discipline and Focus',
        JobLevelOrder: 13,
        JobLevelDetailDesciprtion: 'Drive a simple.',
        JobLevelLabel: 'LEVEL 13',
        GlobalSubCategoryCode: null,
        JobSubCategoryDescription: 'Provide unequivocal clarity approach.',
    },
];

export const competencyLevelResult = {
    subCategories: [
        {
            definition: 'Ensure rapid decision-making.',
            descriptions: [
                {
                    description: undefined,
                    level: 6,
                    levelLabel: null,
                },
                {
                    description: undefined,
                    level: 11,
                    levelLabel: 'LEVEL 11',
                },
            ],
            globalCode: null,
            id: 102074,
            name: 'Agility',
        },
        {
            definition: 'Ensure consistent delivery.',
            descriptions: [
                {
                    description: undefined,
                    level: 6,
                    levelLabel: null,
                },
                {
                    description: undefined,
                    level: 11,
                    levelLabel: 'LEVEL 11',
                },
            ],
            globalCode: null,
            id: 102075,
            name: 'Connectivity',
        },
        {
            definition: 'Provide unequivocal clarity approach.',
            descriptions: [
                {
                    description: undefined,
                    level: 6,
                    levelLabel: null,
                },
                {
                    description: undefined,
                    level: 13,
                    levelLabel: 'LEVEL 13',
                },
            ],
            globalCode: null,
            id: 102076,
            name: 'Discipline and Focus',
        },
    ],
};

export const stagePostBody: BmBodyStage = {
    competencies: [
        {
            competencyId: getRandomNumber(),
            levelId: getRandomNumber(),
            order: getRandomNumber(),
        },
        {
            competencyId: getRandomNumber(),
            levelId: getRandomNumber(),
            order: getRandomNumber(),
        },
    ],
    successProfileIds: [getRandomNumber(), getRandomNumber(), getRandomNumber()],
};

export const itemModificationId = [
    {
        ItemModificationID: getRandomNumber(),
    },
];

export const SkillsQueryMock: SkillsQueryProps = {
    loggedInUserClientId: getRandomNumber(),
    userId: getRandomNumber(),
    locale: 'en',
    preferredClientId: getRandomNumber(),
    preferredLocale: 'en',
};

export const SkillCategoriesResponse = {
    models: {
        categories: [
            {
                id: 1233,
                name: '',
                description: '',
                isCategoryEnabled: true,
                subCategories: [
                    {
                        id: 1234,
                        name: '',
                        order: 0,
                        isCustom: false,
                        definition: '',
                        skillsCount: 2,
                        dependents: [
                            {
                                id: 234,
                                name: '',
                                isCore: true,
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

export const SkillCategoriesDbResponse = [
    {
        JobCategoryID: 1233,
        JobCategoryName: '',
        JobCategoryDescription: '',
        JobSubCategoryID: 1234,
        JobSubCategoryName: '',
        JobSubCategoryDescription: '',
        JobSubCategoryOrder: 0,
        IsCustomJobSubCategory: 0,
        DisplayJobSubCategory: 1,
        JobSubCategoryDependantID: 234,
        JobSubCategoryDependantName: '',
        CoreSupportFlag: true,
        SkillsCount: 2,
        IsCategoryEnabled: true,
        DENSERANK: 1,
        RNK: 1,
    }

]

export const bulkPublishQueryParams: BulkPublishStatusQueryParams = {
    preferredClientId: 23139,
    preferredLocale: 'en-US',
};

export const bulkPublishResponse: BulkPublishStatusResponse = {
    competenciesPublishStatus: false,
    functionsPublishStatus: false,
    responsibilitiesPublishStatus: false,
    skillsPublishStatus: false,
};

export const bulkPublishDBResponse: BulkPublishStatusDBResponse[] = [
    {
        CompetencyModelStatus: 0,
        FamilyModelStatus: 0,
        RespModelStatus: 0,
        SkillModelStatus: 0,
    },
];

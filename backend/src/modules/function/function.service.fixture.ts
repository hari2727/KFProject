import {
    AddJobFamilyResponse,
    FamiliesOnTypeResponseData,
    GetJobFamilyQuery,
    GetJobFamilyResponse,
    JobFamily,
    JobFamilyResponse,
    ProfileStats,
    ProfileStatsQuery,
    ProfileStatsResponse,
    UpdateFamilyStatusQuery,
} from './function.interface';

export const ProfileStatMockRespose: ProfileStats[] = [
    {
        ProfileType: 'BEST_IN_CLASS',
        CreatedBy: null,
        ProfileCreatedByCnt: 0,
    },
    {
        ProfileType: 'CUSTOM_PROFILE',
        CreatedBy: null,
        ProfileCreatedByCnt: 0,
    },
    {
        ProfileType: 'LEVELS',
        CreatedBy: null,
        ProfileCreatedByCnt: 0,
    },
    {
        ProfileType: 'O_NET',
        CreatedBy: null,
        ProfileCreatedByCnt: 0,
    },
];

export const StatsQuey: ProfileStatsQuery = {
    preferredClientId: '23139',
    jobFamilyId: 'PG',
    jobSubFamilyId: null,
    locale: 'en-US',
    loggedInUserClientId: 23139,
    userId: 1234,
};

export const StatsDbResponseMock: ProfileStats[] = [
    {
        ProfileType: 'BEST_IN_CLASS',
        CreatedBy: 'Korn  Ferry',
        ProfileCreatedByCnt: 2,
    },
    {
        ProfileType: 'CUSTOM_PROFILE',
        CreatedBy: null,
        ProfileCreatedByCnt: 0,
    },
    {
        ProfileType: 'LEVELS',
        CreatedBy: null,
        ProfileCreatedByCnt: 0,
    },
    {
        ProfileType: 'O_NET',
        CreatedBy: null,
        ProfileCreatedByCnt: 0,
    },
];

export const MappedApiResponseMock: ProfileStatsResponse[] = [
    {
        profileType: 'BEST_IN_CLASS',
        createdBy: 'Korn  Ferry',
        count: 2,
    },
    {
        profileType: 'CUSTOM_PROFILE',
        createdBy: null,
        count: 0,
    },
    {
        profileType: 'LEVELS',
        createdBy: null,
        count: 0,
    },
    {
        profileType: 'O_NET',
        createdBy: null,
        count: 0,
    },
];

export const FamilyStatusQuery: UpdateFamilyStatusQuery = {
    modelId: '',
    preferredLocale: 'en',
    preferredClientId: '',
    modelVersion: '1.0',
    loggedInUserClientId: 1234,
    userId: 3422,
    locale: '',
};

export const JobFamilyDBResponse: AddJobFamilyResponse[] = [
    {
        JobFamilyID: 'F1032317',
        JobFamilyName: 'Custom Function',
        JobFamilyDescription:
            'Acquire and enable commercial property deals by bringing parties together, supporting negotiations, and providing suitable financial products.',
        IsCustom: 1,
        DisplayFlagID: 1,
        ParentFamilyID: 'WT',
    },
];

export const JobFamilyRequest: JobFamily = {
    families: {
        name: 'Custom Function',
        kfJobFamilyId: 'WT',
        description:
            'Acquire and enable commercial property deals by bringing parties together, supporting negotiations, and providing suitable financial products.',
        createdBy: 26406,
    },
};

export const GetJobFamilyRequest: GetJobFamilyQuery = {
    type: '',
    modelId: '',
    preferredLocale: 'en',
    preferredClientId: '',
    modelVersion: '1.0',
    loggedInUserClientId: 1234,
    userId: 3422,
    locale: '',
};

export const GetJobFamiliesResponse: GetJobFamilyResponse[] = [
    {
        JobFamilyID: 'AE',
        JobFamilyName: 'Asset Management',
        JobFamilyDescription:
            'Management of assets, such as equity, fixed income, property, and derivative funds, or advising on such activities in order to meet specific return goals.',
        JobSubFamilyID: 'AEA',
        JobSubFamilyName: 'Asset Management',
        JobSubFamilyDescription: 'Acquire and enable commercial property deals by bringing parties together, supporting negotiations, and providing suitable financial products.',
        JobRoleTypeID: 'AEA02',
        JobRoleTypeName: 'Commercial Property Product Specialist',
        JobRoleTypeDescription:
            'Acquire and enable commercial property deals by bringing parties together, supporting negotiations, and providing suitable financial products.',
        MinimumPoints: 14,
        MaximumPoints: 18,
    },
];

export const JobFamilyResp: JobFamilyResponse = {
    family: {
        id: 'F1032317',
        name: 'Custom Function',
        description:
            'Acquire and enable commercial property deals by bringing parties together, supporting negotiations, and providing suitable financial products.',
        isCustom: true,
        isActive: true,
        kfJobFamilyId: 'WT',
    },
};

export const FamiliesOnTypeRespData: FamiliesOnTypeResponseData[] = [
    {
        id: 'AE',
        name: 'Asset Management',
        description:
            'Management of assets, such as equity, fixed income, property, and derivative funds, or advising on such activities in order to meet specific return goals.',
        subFamilies: [
            {
                id: 'AEA',
                name: 'Asset Management',
                description:
                    'Acquire and enable commercial property deals by bringing parties together, supporting negotiations, and providing suitable financial products.',
                jobTypes: [
                    {
                        id: 'AEA02',
                        name: 'Commercial Property Product Specialist',
                        description:
                            'Acquire and enable commercial property deals by bringing parties together, supporting negotiations, and providing suitable financial products.',
                    },
                ],
            },
        ],
    },
];

export const JobModelResponseMock = [
    {
        modelId: '',
        modelVersion: '',
        modelName: '',
        modelDescription: '',
        isActive: 1,
        isCustom: 1,
        outputType: '',
        locale: '',
        localName: '',
        isMaster: 1,
    },
];

export const JobClientIndustryDbMock = [
    {
        ClientIndustryID: '',
        ClientIndustryTitle: '',
        JObCategoryID: '',
        FamilySubFamilyModelID: '',
        ClientID: '',
        LCID: '',
        FamilySubFamilyModelVersion: '',
        FamilySubFamilyModelGUID: '',
        FamilySubFamilyModelName: '',
        FamilySubFamilyModelDescription: '',
        FamilySubFamilyModelOrder: '',
        IsActive: '',
        FamilySubFamilyModelCreatedBy: '',
        FamilySubFamilyModelModifiedBy: '',
        FamilySubFamilyModelCreatedOn: '',
        FamilySubFamilyModelModifiedOn: '',
        JobFamilyID: '',
        JobFamilyDescription: '',
        JobFamilyName: '',
        JobFamilyDisplayFlagID: '',
        JobFamilyIsActive: 1,
        JobFamilyOrder: '',
        CustomJobFamily: 1,
        JobFamilyCreatedBy: '',
        JobFamilyModifiedBy: '',
        JobFamilyCreatedOn: '',
        JobFamilyModifiedOn: '',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
        JobSubFamilyDescription: '',
        CustomJobSubFamily: 1,
        JobSubFamilyDisplayFlagID: '',
        JobSubFamilyIsActive: 1,
        JobSubfamilyOrder: '',
        JobSubFamilyCreatedBy: '',
        JobSubFamilyModifiedBy: '',
        JobSubFamilyCreatedOn: '',
        JobSubFamilyModifiedOn: '',
        JobFamilyCount: 1,
        JobSubFamilyCount: 1,
        ParentFamilyID: '',
        ParentSubFamilyID: '',
        JobFamilyOriginalName: '',
        JobFamilyOriginalDescription: '',
        JobSubFamilyOriginalName: '',
        JobSubFamilyOriginalDescription: '',
        JobCategoryID: '',
        JobFamilyOriginalNameEng: '',
        JobFamilyOriginalDescriptionEng: '',
        JobSubFamilyOriginalNameEng: '',
        JobSubFamilyOriginalDescriptionEng: '',
    },
];

export const IndustryResponse = [
    {
        id: '',
        name: '',
        jobFamilies: [
            {
                id: '',
                name: '',
                description: '',
                isCustom: false,
                isActive: true,
                jobsCount: 1,
                originalName: '',
                originalDescription: '',
                kfJobFamilyId: '',
                subFamilies: [
                    {
                        id: '',
                        name: '',
                        description: '',
                        isCustom: false,
                        isActive: true,
                        jobsCount: 1,
                        originalName: '',
                        jobCategoryId: '',
                        originalDescription: '',
                        kfJobSubFamilyId: '',
                    },
                ],
            },
        ],
    },
];

export const UpdateFamilyBody = {
    families: [
        {
            id: '',
            isCustom: false,
            subFamilies: [
                {
                    id: '',
                    isCustom: false,
                    name: '',
                    description: '',
                    isActive: true,
                    jobsCount: 1,
                    originalName: '',
                    jobCategoryId: '',
                    kfJobSubFamilyId: '',
                    originalDescription: '',
                },
            ],
            name: '',
            description: '',
            isActive: true,
            jobsCount: 1,
            originalName: '',
            kfJobFamilyId: '',
            originalDescription: '',
        },
    ],
};
export const FamilesValidation = [
    {
        JobFamilyID: '',
        JobFamilyName: '',
    }
]
export const SubFamilesValidation = [
    {
        JobFamilyID: '',
        JobSubFamilyID: '',
        JobSubFamilyName: '',
    }
]

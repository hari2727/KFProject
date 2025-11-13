import { QueryProps } from '../../common/common.interface';
import { MetadataFilterValues } from './bm.enum';

export interface BmQueryProps extends QueryProps.Default {}

export interface BmQueryPropsSpsData extends BmQueryProps {
    searchColumn?: string;
    searchString: string;
    filterBy: string; //"GRADE|LEVEL",
    filterValues: string; //"grade1;grade2|level1",
    sortColumn: string;
    sortBy: string;
    pageIndex: string;
    pageSize: string;
}

export interface BmQueryPropsComps extends BmQueryProps {
    modelguid: string;
    modelversion: string;
}

export interface BmQueryPropsCompLevels extends BmQueryProps {
    subCategoryIds: string;
}

export interface BmQueryPropsSpsDataDecoded extends BmQueryProps {
    custGrade: string;
    grade: string;
    level: string;
    pageIndex: number;
    pageSize: number;
    searchString: string;
    sortBy: string;
    sortColumn: string;
    subFunction: string;
}

export interface BmBodyStage {
    competencies: {
        competencyId: number;
        levelId: number;
        order: number;
    }[];
    successProfileIds: number[];
}

export module SpsData {
    export interface Response {
        paging: {
            pageIndex: number;
            pageSize: number;
            totalPages: number;
            totalResultRecords: number;
        };
        jobs: SingleJob[];
        allJobsIds: number[];
        allJobsIdsByFilters: number[];
    }

    export interface SingleJob {
        id: string;
        title: string;
        levelName: string;
        familyName: string;
        grade?: Grade;
    }

    export interface Grade {
        standardHayGrade: string;
        customGrades?: {
            gradeSetId: string;
            gradeSetName: string;
            grades: { gradeLabel: string }[];
        };
        min?: string;
        max?: string;
    }
}

export module Metadata {
    export interface Plain {
        id: number;
        name: string;
        value: string;
        options: PlainOption[];
    }

    export interface PlainOption {
        id: string;
        value: string;
        name?: string;
        order?: number;
        gradeIndication?: MetadataFilterValues;
    }

    export interface Nested extends Omit<Plain, 'options'> {
        options: NestedOption[];
    }

    export interface NestedOption extends PlainOption {
        searchOn: {
            name: string;
            subOptions: NestedSubOptions[];
        };
    }

    export interface NestedSubOptions extends PlainOption {}

    export interface Levels extends Plain {}

    export interface Grades extends Plain {}

    export interface Functions extends Nested {}

    export interface Response {
        metadata: (Metadata.Levels | Metadata.Grades | Metadata.Functions)[];
        isPublished: boolean;
    }
}

export module CompetenceModel {
    export interface Model {
        modelGuid: string;
        modelVersion: string;
    }

    export interface Root {
        id: string;
        version: string;
        clientId: number;
        locale: string;
        factors: Factor[];
    }

    export interface CommonNested {
        id: string;
        type: string;
        name: string;
        description?: string;
        isActive: boolean;
        isCustom: boolean;
    }

    export interface Factor extends CommonNested {
        clusters: Cluster[];
    }

    export interface Cluster extends CommonNested {
        competencies: Competency[];
    }

    export interface Competency extends CommonNested {
        subCategoryId: number;
    }
}

export module CompetenciesLevels {
    export interface Response {
        subCategories: SubCategory[];
    }

    export interface SubCategory {
        id: number;
        name: string;
        definition: string;
        globalCode: string;
        descriptions: Level[];
    }

    export interface Level {
        level: number;
        levelLabel: string;
        description: string;
    }
}

export interface SkillsQueryProps extends QueryProps.Default {
    preferredClientId: number;
    preferredLocale: string;
}

export interface BulkPublishStatusQueryParams {
    preferredClientId: number;
    preferredLocale: string;
}

export interface SkillsResponseFromDB {
    JobCategoryID: number;
    JobCategoryName: string;
    JobCategoryDescription: string;
    JobSubCategoryID: number;
    JobSubCategoryName: string | number;
    JobSubCategoryDescription: string;
    JobSubCategoryOrder: number;
    IsCustomJobSubCategory: number;
    DisplayJobSubCategory: number;
    // JobSubCategoryDependantID: number | string;
    // JobSubCategoryDependantName: string;
    CoreSupportFlag: string | boolean;
    SkillsCount: number;
    IsCategoryEnabled: number;
   // DENSERANK: number;
    RNK: number;
    JobSkillComponentId: number;
    JobSkillComponentCode: string;
    JobSkillComponentGUID: string | null;
    JobSkillComponentName: string;
}

export interface SkillDependents {
    // id: number | string;
    // name: string;
    jobSkillComponentId: number;
    jobSkillComponentCode: string;
    jobSkillComponentGUID: string | null;
    jobSkillComponentName: string;
    isCore: boolean | string;
}

export interface SkillSubCategories {
    id: number;
    name: string | number;
    order: number;
    isCustom: boolean;
    definition: string;
    skillsCount: number;
    dependents?: SkillDependents[];
}
export interface SkillCategories {
    id: number;
    name: string;
    description: string;
    isCategoryEnabled: boolean;
    subCategories?: SkillSubCategories[];
}

export interface SkillModels {
    categories: SkillCategories[];
}

export interface SkillsResonse {
    models: SkillModels;
}

export interface BulkPublishStatusResponse {
    functionsPublishStatus: boolean;
    skillsPublishStatus: boolean;
    responsibilitiesPublishStatus: boolean;
    competenciesPublishStatus: boolean;
}

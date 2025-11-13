import { IsString, IsNumber } from 'class-validator';

export namespace KfTarcContentInterface {
    export class ContentBody {
        @IsNumber()
        LearningAssetID: number;
        @IsString()
        LearningAssetName: string;
        @IsString()
        LearningAssetDescription: string;
        @IsNumber()
        JobSectionID: number;
        @IsString()
        JobSectionCode: string;
        @IsString()
        JobSectionname: string;
        @IsNumber()
        JobCategoryID: number;
        @IsString()
        JobCategoryName: string;
        @IsNumber()
        JobSubCategoryID: number;
        @IsString()
        JobSubcategoryCde: string;
        @IsString()
        JobSubCategoryName: string;
        @IsString()
        LevelName: string;
        @IsString()
        SubLevelName: string;
        @IsString()
        rank?: string; // This key is added while processing
    }
    export class RequestBody {
        learningAssets: ContentBody[];
    }
    export enum Skills {
        BEHAVIORAL_SKILLS = 'BEHAVIORAL_SKILLS',
        TECHNICAL_SKILLS = 'TECHNICAL_SKILLS',
    }

    export class GroupById {
        [x: string]: ContentBody[];
    }

    export type RuleResult = {
        result: ContentBody[];
        deleteArrayById: number[];
    };
}

export class KfTarcLearningContentDTO {
    successProfileId: string;
    locale: string;
    userId: number;
    loggedInUserClientId: number;
    clientId: number;

    spCodes: string;
    techComps: string;
    bevComps: string;

    outputType: string;
}

export class KfTarcLearningContentBody {
    outputType: string;

    behCompCodes: string[];

    techCompIds: number[];

    successprofileId: number;
}

export class KfTarcQuery {
    successProfileId: string;
    locale: string;
    userId: number;
    loggedInUserClientId: number;
    clientId: number;
}

export class KfTarcLearningContentRaw {
    JobCategoryID: number;
    JobCategoryName: string | null;
    JobSectionCode:	string | null;
    JobSectionID:	number;
    JobSectionname: string | null;
    JobSubcategoryCde: string | null;
    JobSubCategoryID: number;
    JobSubCategoryName: string | null;
    LearningAssetDescription: string | null;
    LearningAssetID: number;
    LearningAssetName: string | null;
    LevelName: string | null;
    SubLevelName: string | null;
}

export class KfTarcLearningAssetsByCompsRoleLevelsRaw {
    CourseID: string;
    GlobalSubCategoryCode: string;
    JobCategoryID: number;
    JobCategoryName: string;
    JobSectionCode: string;
    JobSectionID: number;
    JobSectionname: string;
    JobSubcategoryCde: string;
    JobSubcategoryID: number;
    JobSubCategoryName: string;
    LearningAssetDescription: string;
    LearningAssetID: number;
    LearningAssetName: string;
    MessageToDisplay: string;
    ModalityDurationDirectURLImage: string;		
}
export class KfTarcLearningContentResponse {
    learningAssets: KfTarcLearningContentRaw[];
}

export class KfTarcLearningContentCatergory {
    id: number;
    name: string;
    subCategories?: KfTarcLearningContentSubCategory[];
}

export class KfTarcLearningContentSubCategory{
    id: number;
    spCode: string;
    globalCode: string;
    descriptions: [
        {
            name: string;
        }
    ];
    learningContent?: KfTarcCreateLearningContentMapping[];
}

export class KfTarcCreateLearningContentMapping {
    id: number;
    name: string
    description: string;
    rank: number;
}

export class KfTarcHandleLearningContentResponse {
    sections: KfTarcLearningContentCatergory[];
}

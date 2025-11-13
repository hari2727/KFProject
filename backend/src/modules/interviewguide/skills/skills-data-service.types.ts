export interface GetIGSpecificSkillDetailSqlDTO {
    ClientId: number;
    JobSubCategoryCode: string;
    JobSubCategoryName: string;
    JobSubCategoryID: number;
    JobSubCategoryDescription: string;
    ItemType: string;
    ItemCode: string;
    ItemDescription: string;
    LevelData: string;
    JobSubCategoryIGSkillDetailsID: number;
    JobLevelDetailOrder: number;
    IsCustomIGData: number;
    ItemEnabled: number;
    LastModifiedDate?: any;
    Status: string;
}

export interface GetIGSkillsDetailsCountSqlDTO {
    ClientId: number;
    JobSubCategoryID: number;
    JobSubCategoryCode: string;
    JobSubCategoryName: string;
    JobSubCategoryDescription: string;
    IsCustomJobSubCategory: number;
    Questionare: number;
    Positive_Behaviour: number;
    Negative_Behaviour: number;
    LastModifiedDate: any;
}

export interface GetSuccessProfileIGSkillQuestionSqlDTO {
    JobSubCategoryID: number;
    ItemType: string;
    ItemDescription: string;
}

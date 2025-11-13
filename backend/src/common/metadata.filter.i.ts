export interface KfFilterMetadataDTO {
    MethodValueID: number;
    MethodID: string;
    MethodValueLabel: string;
    LevelID: string;
    LevelName: string;
    SearchType: string;
    JobSubFamilyID: string;
    JobSubFamilyName: string;
    LevelOrder?: string | null;
    Description?: string;
    GradeSetID: number;
    GradeSetName: string;
}

export interface KfFilterMetadata {
    id: number;
    name: string;
    value: string;
    selectionType: string;
    hasSubOptions: boolean;
    optionId: string | number;
    optionName: string;
    optionValue: string;
    optionType: string;
    optionDescription?: string;
    optionOrder: number;
    subOptionId?: string | number;
    subOptionName?: string;
    subOptionValue?: string;
}

export interface KfFiltersResponse {
    metadata?: KfFilterItem[];
}

export interface KfFilterItem {
    id: string;
    name: string;
    value: string;
    searchType: string;
    searchOn: KfFilterItemConfig[],
}

export interface KfFilterItemConfig {
    id: number;
    name: string;
    selectionType: string;
    value: string;
    options: KfFilterItemOption[];
}

export interface KfFilterItemOption {
    id: string | number;
    name: string;
    value: string;
    type: string;
    description?: string;
    order: number;
    searchOn?: {
        name: string;
        subOptions: KfFilterItemSubOption[];
    };
}

export interface KfFilterItemSubOption {
    id: string | number;
    name: string;
    value: string;
    order: number;
}

export enum Delimiter {
    COMMA = ',',
    COLON = ';',
    PIPE = '|',
}

export type KFFilterExtract = {
    filterBy: string | null;
    filterValues: string | null;
    specific: { [ filterName: string ]: string | null };
};

export interface KfCategoryNode {
    color: string;
    id: string;
    name: string;
    subCategoryCount?: number;
}

export interface KfSubCategoryNode {
    name: string;
    description: string;
    parentId: string;
    parentNode?: KfCategoryNode;
}

export enum SkillsBarChartWidth {
    default = 362,
    recruit = 263,
    pay = 263,
    select = 362,
}

export const MAX_COMPETENCIES = {
    RESPONSIBILITY: 5,
    TECHNICAL_SKILLS: 3,
    BEHAVIORAL_SKILLS: 3,
    TRAITS: 5,
    DRIVERS: 3,
    TASKS: 5,
    TOOLS: 3,
    TECHNOLOGY: 3,
};

export const TREE_MAP_COLOR_PALETTE = ['#566FD6', '#458DDE', '#45B7DE', '#32B5A0', '#32B561'];

export enum KfEditSuccessProfileOptionsEnum {
    STANDARD = 'Standard',
    COLLABORATIVE = 'Collaborative'
}

export enum KfSuccessProfileStatus {
    collabEdit = 'COLLAB_EDIT'
}

export enum KFUcpCollabStatusEnum {
    NavigateToUCP = '5'
}

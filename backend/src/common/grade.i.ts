export interface RawProfileGradeInfo {
    CustomGrade?: string | null;
    Grade?: number;
    GradeSetID?: number;
    GradeSetName?: string;
    MaxGrade?: number | null;
    MidPoint?: number | null;
    MinGrade?: number | null;
}


export interface ProfileGradeInfo {
    standardHayGrade: number;
    customGrades: {
        gradeSetId: number | string;
        gradeSetName: string,
        grades?: {
            gradeLabel: string;
        }[]
    };
    minGrade?: number;
    maxGrade?: number;
    midPoint?: number;
}

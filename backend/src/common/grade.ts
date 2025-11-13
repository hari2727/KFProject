import { ProfileGradeInfo, RawProfileGradeInfo } from "./grade.i";

export const buildProfileGradeInfo = (dto: RawProfileGradeInfo): ProfileGradeInfo => {
    const grades = dto.CustomGrade
        ? dto.CustomGrade.slice(2).split('|||').map(gradeLabel => ({ gradeLabel }))
        : null;

    return {
        standardHayGrade: dto.Grade,
        customGrades: grades
            ? {
                gradeSetId: dto.GradeSetID,
                gradeSetName: dto.GradeSetName,
                grades,
            }
            : undefined,
        minGrade: dto.MinGrade,
        maxGrade: dto.MaxGrade,
        midPoint: dto.MidPoint,
    };
}

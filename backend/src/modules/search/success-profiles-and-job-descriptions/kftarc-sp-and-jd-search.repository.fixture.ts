import { KfTarcSuccessProfileSearchEntity } from './kftarc-sp-and-jd-search.entity';
import { KfTarcSpAndJdSearchParams, KfTarcSpAndJdSpResponse } from './kftarc-sp-and-jd-search.interface';

const getNextNumber = (
    base => (): number =>
        base++
)(new Date().getTime());

export const getNumber = (): number => getNextNumber();
export const getString = (): string => getNextNumber().toString(36);
export const getBoolean = (): boolean => Boolean(getNextNumber() % 2);
export const getRandomNumber = (min: number = 1, max: number = 100): number => Math.round(Math.random() * (max - min));
export const nullifyRandomProperty = (obj: object): string => {
    const len = Object.keys(obj).length;
    const propertyName = Object.keys(obj)[getRandomNumber(0, len - 1)];
    obj[propertyName] = null;
    return propertyName;
}

export const generateArrayFilledWithResultsOfCallback = <T>(cb: () => T, min?: number, max?: number) => new Array(getRandomNumber(min, max)).fill('').map((_, i) => cb());

export const getSpsAndJdsSearchParams = (): KfTarcSpAndJdSearchParams => ({
    clientId: getNumber(),
    sectionProductId: getNumber(),
    sortColumns: getString(),
    sortOrders: getString(),
    searchString: getString(),
    functions: getString(),
    subFunctions: getString(),
    grades: getString(),
    levels: getString(),
    profileTypes: getString(),
    industries: getString(),
    createdBy: getString(),
    locale: getString(),
    pageIndex: getNumber(),
    pageSize: getNumber(),
    userId: getNumber(),
    profileCollections: getString(),
    roleLevel: getNextNumber(),
    profileCollectionId: getNextNumber(),
});

export const getGradeLabels = (): {
    gradeLabel: string;
}[] => {
    return generateArrayFilledWithResultsOfCallback((): { gradeLabel: string } => ({ gradeLabel: getString() }));
};

export const getGrade = (): KfTarcSpAndJdSpResponse.Grade => ({
    standardHayGrade: getNumber(),
    min: getString(),
    max: getString(),
    customGrades: {
        grades: getGradeLabels(),
    },
});

export const getSourceType = (): KfTarcSpAndJdSpResponse.SourceType => {
    return Object.values(KfTarcSpAndJdSpResponse.SourceType)[(getRandomNumber(1, 2) - 1)];
};

export const getSource = (): KfTarcSpAndJdSpResponse.Source => ({
    id: getNumber(),
    type: getSourceType(),
    firstName: getString(),
    lastName: getString(),
    effectiveDateTime: getNumber(),
});

export const getSpAndJd = (): KfTarcSpAndJdSpResponse.SpAndJd => ({
    id: getNumber(),
    title: getString(),
    description: getString(),
    isArchitectJob: getBoolean(),
    levelName: getString(),
    familyName: getString(),
    subFamilyName: getString(),
    status: getString(),
    isProfileInProfileCollection: getBoolean(),
    isTemplateJob: getBoolean(),
    profileType: getString(),
    jobRoleTypeId: getString(),
    enableProfileMatchTool: getBoolean(),
    totalPoints: getNumber(),
    shortProfile: getString(),
    clientIndustryId: getNumber(),
    grade: getGrade(),
    source: generateArrayFilledWithResultsOfCallback(getSource),
    jrtDetailId: getString(),
});

export const getSuccessProfileSearchEntity = (): KfTarcSuccessProfileSearchEntity => ({
    ClientJobId: getNumber(),
    PersonId: getNumber().toString(),
    FirstName: getString(),
    Name: getString(),
    JobName: getString(),
    JobDescription: getString(),
    CreatedOn: getNumber().toString(),
    ModifiedOn: getNumber().toString(),
    Level: getString(),
    ReferenceLevel: getNumber(),
    JobFamilyName: getString(),
    JobSubFamilyName: getString(),
    ClientJobStatusID: getString(),
    IsProfileInProfileCollection: getNextNumber(),
    IsTemplateJob: getBoolean(),
    JobSourceID: getNumber().toString(),
    ModifiedFirstName: getString(),
    ModifiedLastName: getString(),
    LevelType: getString(),
    JobRoleTypeID: getString(),
    enableProfileMatchTool: getNumber(),
    MinGrade: getString(),
    MaxGrade: getString(),
    Haypoints: getNumber(),
    CustomGrade: getString(),
    ShortProfile: getString(),
    ClientIndustryID: getNumber(),
    ArchitectJobFlag: getNumber(),
    TotalRecords: getNumber(),
    JRTDetailID: getString(),
});

// export const getSpsAndJdsSearchResponse = ( successProfileSearchEntity: KfTarcSuccessProfileSearchEntity[]): KfTarcSpAndJdSpResponse.MappedAndCountedDbResponse => ({ jobs: this.mapSpsAndJds(result), totalRecords: result.length > 0 ? result[0].TotalRecords : 0 });

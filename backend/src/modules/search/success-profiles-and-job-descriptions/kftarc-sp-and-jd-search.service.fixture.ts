import { EntityType, FilterCategories, KfTarcSpAndJdSearchRouteDetails, KfTarcSpAndJdSpResponse, SearchColumn } from './kftarc-sp-and-jd-search.interface';

const getNextNumber = (
    base => (): number =>
        base++
)(new Date().getTime());

export const getNumber = (): number => getNextNumber();
export const getString = (): string => getNextNumber().toString(36);
export const getBoolean = (): boolean => Boolean(getNextNumber() % 2);
export const getRandomNumber = (min: number = 1, max: number = 100): number => Math.round(Math.random() * (max - min));
export const generateArrayFilledWithResultsOfCallback = <T>(cb: () => T) => new Array(getRandomNumber()).fill('').map((_, i) => cb());

const delimeters: string[] = ['|', ',', ';'];
export const getStringCoalescedByDelimeter = (str: string): [string, string, number] => {
    const maxNumberOfDelimeters = str.length - 1;
    let numberOfDelimeters = getRandomNumber(str.length > 1 ? 1 : 0, maxNumberOfDelimeters);
    numberOfDelimeters = str.length % numberOfDelimeters === 0 ? numberOfDelimeters - 1 : numberOfDelimeters;
    let step = Math.floor(str.length / numberOfDelimeters);
    if (step === str.length) {
        step = getRandomNumber(0, str.length - 1);
    }
    const delimeter = delimeters[getRandomNumber(0, delimeters.length - 1)];
    let resultStr: string = str.substring(0, step);
    let i = step;
    while (i < str.length - step) {
        resultStr = resultStr.concat(delimeter, str.substring(i, i + step));
        i += step;
    }
    return [resultStr, delimeter, numberOfDelimeters];
};

export enum AllowedValuesTestSet {
    X = 'X',
    Y = 'Y',
    Z = 'Z',
}

export enum FilterValuesTestSet {
    A = 'AA',
    B = 'BB',
    C = 'CC',
    D = 'DD',
    E = 'EE',
    X = 'XX',
    Y = 'YY',
    Z = 'ZZ',
}

export const getStringBasedOnAllowedValuesSet = <T>(allowedValuesSet: T): string => {
    const allowedValues = Object.values(allowedValuesSet);
    const strLength = getRandomNumber();
    let str: string = '';
    for (let i = 0; i < strLength; i++) {
        str += allowedValues[getRandomNumber(0, allowedValues.length - 1)];
    }
    return str;
};

export const getFilterValues = <T>(allowedValuesSet: T, length: number): string => {
    const allowedValues = Object.values(allowedValuesSet);
    let str: string = '';
    const minLength = allowedValues.length > length ? length : allowedValues.length;
    for (let i = 0; i < minLength; i++) {
        const repeatTimes = 3;
        const toAdd = allowedValues[i];
        str += toAdd.repeat(repeatTimes);
    }
    return str;
};

export const getFilterCategories = <T>(allowedValuesSet: T): string => {
    const allowedValues = Object.values(allowedValuesSet);
    let strLength = getRandomNumber(1, allowedValues.length - 1);
    while (strLength === 0) {
        strLength = getRandomNumber(1, allowedValues.length - 1);
    }
    let str: string = '';
    for (let i = 0; i < strLength; i++) {
        str += allowedValues[i];
        if (i !== strLength - 1) {
            str += '|';
        }
    }
    return str;
};

export const getValuesCoalescedByDelimiter = (str: string, delimiter?: string): [string, string, number] => {
    let i = 1;
    delimiter = delimiter ?? delimeters[getRandomNumber(0, delimeters.length - 1)];
    let resultStr: string = str.substring(0, 1);
    while (i < str.length) {
        resultStr += str.substring(i, i + 1);
        i++;
    }
    const numberOfDelimeters = resultStr.split(delimiter).length - 1;
    return [resultStr, delimiter, numberOfDelimeters];
};

export const getFilterValuesCoalescedByDelimiter = (str: string, delimiter: string): [string, string, number] => {
    let i = 1;
    delimiter = delimiter ?? delimeters[getRandomNumber(0, delimeters.length - 1)];
    let resultStr: string = str.substring(0, 1);
    while (i < str.length) {
        if (str.substring(i, i + 1) !== str.substring(i - 1, i)) {
            resultStr += delimiter;
        }
        if (i % 2 === 0 && i % 6 !== 0) {
            resultStr += ';';
        }
        resultStr += str.substring(i, i + 1);
        i++;
    }
    const numberOfDelimeters = resultStr.split('|').length - 1;
    return [resultStr, delimiter, numberOfDelimeters];
};

export const getParsedString = (str: string): { parsedStr: string[]; delimiter: string } => {
    const [finalStr, delimiter, numberOfDelimeters] = getValuesCoalescedByDelimiter(str);
    return { parsedStr: finalStr.split(delimiter), delimiter: delimiter };
};

export const getParsedStringForFilter = (str: string, delim?: string): { parsedStr: string[]; delimiter: string } => {
    const [finalStr, delimiter, numberOfDelimeters] = getFilterValuesCoalescedByDelimiter(str, delim);
    return { parsedStr: finalStr.split(delimiter), delimiter: delimiter };
};

export const getParsedFilterCategories = (str: string, delimiter: string): { parsedStr: string[]; delimiter: string } => {
    return { parsedStr: str.split(delimiter), delimiter: delimiter };
};

export const mixInvalidValuesToString = (str: string): string => {
    const numberOfInvalidValues = getRandomNumber(1, str.length - 1);
    let step = Math.floor(str.length / numberOfInvalidValues);
    let resultStr: string = str.substring(0, step);
    let i = 0;
    let randSum = 0;
    while (i < str.length - step) {
        const rand = getRandomNumber().toString();
        randSum += rand.length;
        resultStr = resultStr.concat(rand, str.substring(i + 1, i + 1 + step));
        i += step;
    }
    return resultStr;
};

export const getQueryParams = (): KfTarcSpAndJdSearchRouteDetails.QueryParams => {
    return {
        type: EntityType[Object.values(EntityType)[getRandomNumber(0, 1)]],
        searchColumn: SearchColumn.JOB_TITLE,
        searchString: getString(),
        filterBy: 'GRADES|LEVELS|FUNCTIONS|SUBFUNCTIONS',
        filterValues: 'grade 01;grade 02|level1|F111111|S111111001;S111111002;S111111003',
        sortColumn: 'GRADES|FUNCTIONS|CREATED_BY|MODIFIED_ON',
        sortBy: 'asc|desc|asc|asc',
        pageIndex: getNumber(),
        pageSize: getNumber(),
        userId: getNumber(),
        loggedInUserClientId: getNumber(),
        locale: getString(),
    };
};

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
    return Object.values(KfTarcSpAndJdSpResponse.SourceType)[getRandomNumber(1, 2) - 1];
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

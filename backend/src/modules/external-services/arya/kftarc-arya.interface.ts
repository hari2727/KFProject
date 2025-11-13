import { IsDefined, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class KfTarcAryaSkillCompareDto {
    spid: string;

    skills: string[];
}

export enum KfTarcAryaSkillsEnum {
    ORGANIZATION = 'ORG_SKILL',
    MARKET = 'MARKET_SKILL',
    JOB_TITLES = 'JOB_TITLES',
}

export class KfTarcAryaBasicParams {
    @IsNumberString()
    @IsOptional()
    topCount: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    spName: string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    countryId: string;

    @IsOptional()
    @IsString()
    clientNames: string;

    @IsOptional()
    @IsString()
    industryId: string;
}

export class KfTarcAlternativeJobsParams {
    @IsNumberString()
    @IsOptional()
    topCount: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    spName: string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    countryId: string;
}
export class KfTarcAryaSkills extends KfTarcAryaBasicParams {
    @IsEnum(KfTarcAryaSkillsEnum)
    @IsString()
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    peerGroupIds: string;
}
export class KfTarcAryaMetadata {
    type: string;
}

export class KfTarcArayPeerGroups {
    @IsOptional()
    @IsString()
    searchString: string;

    @IsNumberString()
    @IsOptional()
    topCount: string;
}

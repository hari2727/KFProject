import { ArrayNotEmpty, Equals, IsArray, IsDefined, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { QueryProps } from '../../common/common.interface';
import { options } from '../../common/common.utils';
import { toNumber } from '../../_shared/convert';

export class ExperienceProps extends QueryProps.Default {
    @IsNumber()
    @IsNotEmpty()
    @Transform(toNumber, options)
    successProfileId: number;
}

export class BoolParams {
    mockData: boolean;
    experience: boolean;
}

export class ExperienceBody {
    @IsArray()
    @ArrayNotEmpty()
    sections: any[];
}

export enum QueryValues {
    TYPE = 'CRITICAL_EXPERIENCE',
    OUTPUTTYPE = 'METADATA',
}

export enum QueryParamKeys {
    type = 'type',
    outputType = 'outputType',
    successProfileId = 'successProfileId',
}

export class GETAPIValidParams extends QueryProps.Default {
    @IsDefined()
    @IsNotEmpty()
    @Transform(toNumber, options)
    @IsNumber()
    @ValidateIf(params => params.outputType === undefined && params.type === undefined)
    successProfileId: number;

    @ValidateIf(params => params.successProfileId === undefined)
    @Equals(QueryValues.OUTPUTTYPE)
    outputType: QueryValues.OUTPUTTYPE;

    @ValidateIf(params => params.successProfileId === undefined)
    @Equals(QueryValues.TYPE)
    type: QueryValues.TYPE;
}

export enum RequestType {
    POST = 'POST',
    PUT = 'PUT',
}

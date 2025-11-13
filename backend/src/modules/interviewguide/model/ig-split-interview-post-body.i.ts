import { IsArray, IsString } from 'class-validator';

export class IgSplitInterviewPostBody {
    @IsString()
    masterUrl: string;
    @IsArray()
    compData: string[];
}



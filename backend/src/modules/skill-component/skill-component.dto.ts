import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { QueryProps } from '../../common/common.interface';
import { ComponentBulkOperation } from './skill-component.const';

export class ModelQuery extends QueryProps.Default {
    @ApiProperty({ example: '20B4BA29-8050-48BD-8623-46FC14B7E165' })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => String(value ?? ''))
    @Transform(({ value }) => value?.trim())
    public readonly modelGUID: string;

    @ApiProperty({ example: '1.0' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => String(value ?? ''))
    @Transform(({ value }) => value?.trim())
    public readonly modelVersion: string;
}

export class SkillCoreComponent {
    @Expose()
    name: string;

    @Expose()
    isCore: number;
}

export class SkillListItemResponse {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    categoryName: string;

    @Expose()
    isCustom: number;

    @Expose()
    isActive: number;

    @Expose()
    successProfilesNumber: number;

    @Expose()
    coreComponent: SkillCoreComponent;
}

export class ComponentListItemResponse {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    code?: string;

    @Expose()
    guid?: string;

    @Expose()
    isCustom: number;

    @Expose()
    successProfilesNumber: number;

    @Expose()
    skillsIds: number[];
}

export class ComponentUpdateDTO {
    @ApiProperty({ example: 147869 })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'KSC00000572' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: '20B4BA29-8050-48BD-8623-46FC14B7E165' })
    @IsString()
    guid: string;

    @ApiProperty({ example: 'Apple iWork' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 1 | 0 })
    @IsNumber()
    isActive: number;

    @ApiProperty({ example: 1 | 0 })
    @IsNumber()
    isCore: number;

    @ApiProperty({ example: 'en' })
    @IsNotEmpty()
    @IsString()
    locale: string;

    // @ApiProperty({ example: 1 | 0 })
    // @IsNumber()
    // isDeleted: number;

    @ApiProperty({
        example: `${ComponentBulkOperation.ADD} | ${ComponentBulkOperation.EDIT}`,
    })
    @IsEnum(ComponentBulkOperation)
    @IsNotEmpty()
    operationType: string;
}

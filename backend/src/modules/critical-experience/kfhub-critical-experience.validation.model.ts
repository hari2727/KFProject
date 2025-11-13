import {
    IsNotEmpty,
    IsNumber,
    IsString,
    IsBoolean,
    ValidateNested,
    IsOptional,
    ValidateIf,
    IsArray,
    Equals,
    IsDefined,
    ArrayNotEmpty,
    IsInstance,
    Validate,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ArrayShouldContain, isNumberOrSting } from '../../common/common.validators';
import { Util } from './kfhub-critical-experience.util';
import { RequestType } from './kfhub-critical-experience.interface';

namespace COMMON {
    class Years {
        @IsDefined()
        @IsNumber()
        @IsNotEmpty()
        id: number;
    }

    export class CategoryProps {
        @IsInstance(Years, { message: 'Years must be an object {}' })
        @ValidateNested({ each: true })
        @Type(() => Years)
        years: Years;

        @IsBoolean()
        @IsDefined()
        isCore: boolean;

        @IsBoolean()
        @IsDefined()
        userEdited: boolean;

        @IsDefined()
        @IsNotEmpty()
        @IsNumber()
        @ValidateIf(params => params.name === undefined || params.description === undefined)
        id: number;

        @ValidateIf(params => params.id === undefined)
        @IsString()
        @IsNotEmpty()
        name: string;

        @ValidateIf(params => params.id === undefined)
        @IsString()
        @IsNotEmpty()
        @IsDefined()
        description: string;
    }

    export namespace CustomExperience {
        export namespace Put {
            class Option {
                @IsDefined()
                @IsNumber()
                @IsNotEmpty()
                id: number;
            }
            class AugOption extends Option {
                @IsDefined()
                @IsString()
                @IsNotEmpty()
                value: string;
            }
            export class Scope {
                @IsArray()
                @ArrayNotEmpty()
                @ValidateNested({ each: true })
                @Type(() => Option)
                options: Option[];
            }

            export class EditedScope extends Scope {
                @Type(() => AugOption)
                // @ts-ignore
                options: AugOption[];
            }
        }
        export namespace Post {
            class Option {
                @IsDefined()
                @IsString()
                @IsNotEmpty()
                value: string;
            }
            export class Scope {
                @IsArray()
                @ArrayNotEmpty()
                @ValidateNested({ each: true })
                @Type(() => Option)
                options: Option[];
            }
        }
    }

    export namespace DefaultExperience {
        class SubOption {
            @IsNotEmpty()
            @IsDefined()
            @isNumberOrSting({ message: 'should be either number or string' })
            id: string | number;
        }

        class Option {
            @IsOptional()
            @IsString()
            @IsNotEmpty()
            value?: string;

            @IsDefined()
            @IsNotEmpty()
            @isNumberOrSting({ message: 'should be either number or string' })
            @ValidateIf(option => option.value === undefined)
            id: string | number;

            @ValidateNested({ each: true })
            @IsOptional()
            @IsArray()
            @ArrayNotEmpty()
            @Validate(ArrayShouldContain, [SubOption])
            @Type(() => SubOption)
            subOptions?: SubOption[];
        }

        export class Scope {
            @IsArray()
            @ArrayNotEmpty()
            @ValidateNested({ each: true })
            @Validate(ArrayShouldContain, [Option])
            @Type(() => Option)
            options: Option[];
        }
    }
}

const getScope = params => {
    const { id, userEdited } = params.newObject;
    if (id === undefined) {
        switch (Util.reqType) {
            case RequestType.POST:
                return COMMON.CustomExperience.Post.Scope;
            case RequestType.PUT:
                if (userEdited) {
                    return COMMON.CustomExperience.Put.EditedScope;
                }
                return COMMON.CustomExperience.Put.Scope;
        }
    }
    return COMMON.DefaultExperience.Scope;
};

class Category extends COMMON.CategoryProps {
    @IsInstance(Object, { message: 'scope must be an object' })
    @ValidateNested({ each: true })
    @Type(getScope)
    scope: COMMON.DefaultExperience.Scope;
}

export class ValidationModel {
    @IsDefined()
    @IsNumber()
    id: number;

    @IsArray({ message: 'value should be an array' })
    @ValidateNested({ each: true })
    @ArrayNotEmpty()
    @Validate(ArrayShouldContain, [Category])
    @Type(() => Category)
    categories: Category[];
}

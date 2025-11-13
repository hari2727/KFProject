import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function isNonPrimitiveArray(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'isNonPrimitiveArray',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return Array.isArray(value) && value.reduce((a, b) => a && typeof b === 'object' && !Array.isArray(b), true);
                },
            },
        });
    };
}

@ValidatorConstraint({ async: true })
export class IsNumberOrStingConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return typeof value === 'string' || typeof value === 'number';
    }
}

export function isNumberOrSting(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNumberOrStingConstraint,
        });
    };
}

@ValidatorConstraint()
export class ArrayShouldContain implements ValidatorConstraintInterface {
    validate(input: any[], validationArguments: ValidationArguments) {
        let returnValue = true;
        if (input) {
            input.map(i => {
                const condition = i instanceof validationArguments.constraints[0];
                if (!condition) {
                    returnValue = false;
                }
            });
        }
        return returnValue;
    }
}

import { HttpStatus } from '@nestjs/common';
import { AppError } from './app-error';
import { MapErrorOptions } from './map-error.options';

export function MapAnyErrors(options?: MapErrorOptions | undefined) {

    return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
        const method = descriptor.value;

        descriptor.value = function () {
            try {
                const value = method.apply(this, arguments);
                if (value instanceof Promise) {
                    return value.catch((e: any) => {
                        throw new AppError(
                            options?.message ?? e?.message ?? e,
                            options?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
                            {
                                cause: e?.cause ?? e,
                                errorCode: e?.errorCode ?? options?.errorCode
                            }
                        );
                    });
                }
                return value;

            } catch (e: any) {
                throw new AppError(
                    options?.message ?? e?.message ?? e,
                    options?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
                    {
                        cause: e?.cause ?? e,
                        errorCode: e?.errorCode ?? options?.errorCode
                    }
                );
            }
        };

    };
}

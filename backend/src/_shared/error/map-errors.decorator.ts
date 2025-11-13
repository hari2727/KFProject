import { HttpStatus } from '@nestjs/common';
import { AppError } from './app-error';
import { MapErrorOptions } from './map-error.options';
import { isManagedError } from './error';

/*
Maps only unintentional or malformed exceptions
 */
export function MapErrors(options?: MapErrorOptions | undefined) {

    return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
        const method = descriptor.value;

        descriptor.value = function () {
            try {
                const value = method.apply(this, arguments);
                if (value instanceof Promise) {
                    return value.catch(e => {
                        if (isManagedError(e)) {
                            throw e;
                        }
                        throw new AppError(
                            options?.message ?? (e.message || e),
                            options?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
                            {
                                cause: e,
                                errorCode: options?.errorCode
                            }
                        );
                    });
                }
                return value;

            } catch (e: any) {

                if (isManagedError(e)) {
                    throw e;
                }
                throw new AppError(
                    options?.message ?? (e.message || e),
                    options?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
                    {
                        cause: e,
                        errorCode: options?.errorCode
                    }
                );
            }
        };
    };
}

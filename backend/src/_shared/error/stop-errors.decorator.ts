import { isManagedError } from './error';

/*
Stops only unintentional or malformed exceptions
 */
export function StopErrors() {

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
                    });
                }
                return value;

            } catch (e: any) {

                if (isManagedError(e)) {
                    throw e;
                }
            }
        };
    };
}

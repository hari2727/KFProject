export function StopAnyErrors() {

    return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
        const method = descriptor.value;

        descriptor.value = function () {
            try {
                const value = method.apply(this, arguments);
                if (value instanceof Promise) {
                    return value.catch(e => null);
                }
                return value;

            } catch (e: any) {
            }
        };
    };
}

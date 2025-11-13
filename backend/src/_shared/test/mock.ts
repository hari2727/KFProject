import { MockedModule } from './mock.i';

const mapToMocks = (overrides: Record<string, any>, registry: Record<string, jest.Mock>): Record<string, any> => {
    const result: Record<string, any> = {};

    for (const key in overrides) {
        const value = overrides[key];
        const mock =
            (typeof value === 'function' && 'mock' in value) ? value :
                typeof value === 'function' ? jest.fn(value) :
                    jest.fn().mockReturnValue(value);
        result[key] = mock;
        registry[key] = mock;
    }

    return result;
}

export const mockModule = <T extends Record<string, any>>(moduleName: string, overrides: Partial<T> = {}): MockedModule => {
    const internalMocks: Record<string, jest.Mock> = {};

    jest.mock(moduleName, () => {
        try {
            const actual = jest.requireActual<T>(moduleName);
            return {
                ...actual,
                ...mapToMocks(overrides, internalMocks),
            };
        } catch {
            return mapToMocks(overrides, internalMocks);
        }
    });

    return {
        reset: () => {
            for (const fn of Object.values(internalMocks)) {
                fn.mockReset();
            }
        },
        unmock: () => {
            jest.unmock(moduleName);
        },
    };
};

export const mockInstance = <T extends object>(base: new (...args: any[]) => T, overrides: Partial<jest.Mocked<T>> = {}): jest.Mocked<T> => {
    const instance = Object.create(base.prototype) as jest.Mocked<T>;

    const propertyNames = new Set<string>();

    let proto = base.prototype;
    while (proto && proto !== Object.prototype) {
        for (const key of Reflect.ownKeys(proto)) {
            if (typeof key === 'string') {
                propertyNames.add(key);
            }
        }
        proto = Object.getPrototypeOf(proto);
    }

    for (const key of propertyNames) {
        const descriptor = Object.getOwnPropertyDescriptor(base.prototype, key);
        const isMethod = descriptor?.value instanceof Function;
        const isGetter = descriptor?.get instanceof Function;

        if (isMethod) {
            // @ts-ignore
            instance[key as keyof T] = jest.fn();
        } else if (isGetter) {
            Object.defineProperty(instance, key, {
                get: jest.fn(),
                configurable: true,
                enumerable: true,
            });
        }
    }

    Object.assign(instance, overrides);

    return instance;
};

export const mockValue = <T>(value: T): jest.Mock<() => T> => {
    return jest.fn().mockReturnValue(value);
}

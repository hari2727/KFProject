import { mockModule, mockInstance } from '../test/mock';
/*
const typeormMock = mockModule<typeof import('typeorm')>('typeorm', {
    getRepository: jest.fn().mockReturnValue({ find: jest.fn() }),
});
*/
import { getConfigServiceMock } from './config.service.fixture';
import { ConfigService } from './config.service';

class A {
    constructor(public config: ConfigService) {
    }

    heyYou(value: string): string {
        return value.toUpperCase();
    }
}

class B {
    constructor(public a: A) {
    }
}

describe('ConfigService', () => {

    const config = getConfigServiceMock();

    const a = mockInstance(A, {
        // @ts-ignore
        config: {
            get: (a: any) => 'mocked'
        },
        heyYou: jest.fn().mockImplementation((a: string) => {
            return 111;
        })
    });

    /*
        typeormMock.reset();
        typeormMock.unmock();
    */

    const b = new B(a);

    test('sample', () => {
        expect(b.a.config.get('smth')).toBe('mocked');
    });

    test('heyYou', () => {
        const me = 'me';
        expect(b.a.heyYou(me)).toBe(111);
    });

})

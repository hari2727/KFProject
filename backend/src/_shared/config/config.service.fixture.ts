import { ConfigService } from './config.service';
import { mockInstance } from '../test/mock';

export const defaultConfigServiceMocks: Partial<jest.Mocked<ConfigService>> = {
    get: jest.fn().mockReturnValue('mocked')
}

export const getConfigServiceMock = (overrides: Partial<jest.Mocked<ConfigService>> = defaultConfigServiceMocks): jest.Mocked<ConfigService> => {
    return mockInstance(ConfigService, overrides);
};

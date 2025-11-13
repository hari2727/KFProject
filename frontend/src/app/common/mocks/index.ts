// Mock model imports

// Mock service imports
import { SUCCESS_PROFILE_MOCK } from './models/successProfile';
import KfMockTranslateLoader from './services/kfclmg-mock-translate-loader';
import KfMockTranslateService from './services/kfclmg-mock-translate.service';

export const mocks = {
    models: {
        SUCCESS_PROFILE_MOCK,
    },
    services: {
        translateLoader: KfMockTranslateLoader,
        translate: KfMockTranslateService,
    },
};

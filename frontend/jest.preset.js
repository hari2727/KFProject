// const nxPreset = require('@nrwl/jest/preset');
module.exports = {
    //   ...nxPreset,
    testMatch: ['**/+(*.)+(spec|test).+(ts)'],
    transform: {
        '^.+\\.(ts|html)$': 'ts-jest',
    },
    resolver: '@nrwl/jest/plugins/resolver',
    moduleFileExtensions: ['ts', 'js', 'html'],
    //   coverageReporters: ['text', 'cobertura'],
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: [
        '**/*.ts',
        '!**/{index,public_api}.ts',
        '!**/*.{enum,model,module}.ts',
    ],
    setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js',
    ],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.(html|svg)$',
            astTransformers: {
                before: [
                    'jest-preset-angular/build/InlineFilesTransformer',
                    'jest-preset-angular/build/StripStylesTransformer',
                ],
            },
        },
    },
};

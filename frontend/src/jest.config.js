const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.spec.json');

module.exports = {
    name: 'Kfhub Tarc Application',
    displayName: {
        name: 'kfhub_tarc_app',
        color: 'blue',
    },
    preset: '../jest.preset.js',
    coverageDirectory: '<rootDir>/../coverage/kfhub_app',

    modulePaths: ['<rootDir>'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

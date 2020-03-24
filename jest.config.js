const { pathsToModuleNameMapper } = require('ts-jest/utils')
const tsconfig = require('./tsconfig.json')

module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
    '\\.css': 'identity-obj-proxy',
    '\\.(jpe?g|png)': '<rootDir>/test/assets-mock',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  collectCoverageFrom: ['<rootDir>/{lib,src}/**/*.{ts,tsx}'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
}

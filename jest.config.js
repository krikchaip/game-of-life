const { pathsToModuleNameMapper } = require('ts-jest/utils')
const tsconfig = require('./tsconfig.json')

module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
    '\\.css': 'identity-obj-proxy',
    '\\.(jpe?g|png)': '<rootDir>/test/assets-mock',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
}

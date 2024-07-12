// jest.config.integration.ts

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '.*\\.e2e-spec\\.ts$',
    moduleFileExtensions: ['js', 'json', 'ts'],
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverage: true,
    coverageDirectory: './coverage',
    coverageReporters: ['lcov', 'text', 'text-summary'],
    verbose: true,
  };
  
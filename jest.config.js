module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@Shared/(.)*$': '<rootDir>/src/app/shared/$1',
  },
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.app.json',
        ignoreCodes: ['TS151001'],
      },
    ],
  },
  collectCoverage: true,
};

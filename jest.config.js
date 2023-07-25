/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ["<rootDir>"],
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"],
  verbose: true, 
  forceExit: true, 
  //clearMocks: true
};

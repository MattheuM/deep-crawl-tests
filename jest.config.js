// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  
  moduleFileExtensions: [
    'js',
    'ts',
    'json'
  ],  
  preset: "jest-puppeteer",
  

  
  testEnvironment: 'node',


  testMatch: [
    '**/?(*.)+(spec|tests).ts?(x)',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  
};

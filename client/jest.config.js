module.exports = {
  preset: 'jest-puppeteer',
  roots: ['src/tests'],
  testTimeout: 300000,
  collectCoverage: false,
  coverageDirectory: '<rootDir>/test-reports/coverage',
  coverageReporters: ['text', 'json', 'html'],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Project-comic-app',
        outputPath: 'test-reports/index.html',
        includeFailureMsg: true,
      },
    ],
  ],
};

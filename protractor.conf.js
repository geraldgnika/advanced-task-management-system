exports.config = {
  framework: 'jasmine',
  specs: ['./e2e/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--no-sandbox', '--disable-gpu', "--user-data-dir=C:/Temp/ChromeDevSession"],
      binary: './webdriver/chromedriver.exe'
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new require('jasmine-spec-reporter').SpecReporter());
  },
  browserTimeout: 60000,
  // chromeOptions: {
  //   args: ['--headless']
  // }
};

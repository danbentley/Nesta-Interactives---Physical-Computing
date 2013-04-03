// Karma configuration
// Generated on Tue Mar 19 2013 12:10:12 GMT+0000 (GMT)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  REQUIRE,
  REQUIRE_ADAPTER,

  'js/lib/jquery.min.js',
  'js/lib/jquery.transit.min.js',
  // jasmine-jquery.js
  {
    pattern: 'test/fixtures/*.html',
    watched: true,
    included: false,
    served: true
  },
  {
    pattern: 'css/*.css',
    watched: true,
    included: false,
    served: true
  },
  { pattern: 'js/src/*.js', included: false },
  { pattern: 'test/*.test.js', included: false },
  'test/helpers/*.js',
  'js/test-main.js'
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;


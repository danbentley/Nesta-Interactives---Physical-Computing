var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return /\.test\.js$/.test(file);
});

require({
  // Karma serves files from '/base'
  baseUrl: '/base/js',
  paths: {
    'jquery.transit.min': 'lib/jquery.transit.min',
  },
  // ask requirejs to load these files (all our tests)
  deps: tests,
  // start test run, once requirejs is done
  callback: window.__karma__.start
});


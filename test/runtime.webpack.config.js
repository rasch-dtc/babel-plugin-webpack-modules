
var path = require('path');

module.exports = {
  resolve: {
    modules: [
      'screens',
      'components',
      'shared',
      'node_modules',
    ],
    alias: {
      'my-absolute-test-lib': path.join(__dirname, 'assets/le-test-lib'),
      'my-relative-test-lib': './assets/le-test-lib/',
      'my-root-folder-lib': './fixtures/'
    }
  }
};

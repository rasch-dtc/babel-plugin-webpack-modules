
import { resolve, sep } from 'path';
import findUp from 'find-up';

function getConfig(configPath, findConfig) {
  var conf;
  if(!findConfig) {
    // Get webpack config
    conf = require(resolve(process.cwd(), configPath));
  } else {
    conf = require(findUp.sync(configPath));
  }

  return conf;
}

// injects Webpack's `modulesDirectories` into Node.js module resolver
function injectModulesDirectories(modulesDirectories) {
  modulesDirectories = modulesDirectories.filter(x => x !== 'node_modules');

	// instrument Module._nodeModulePaths function
	// https://github.com/nodejs/node/blob/master/lib/module.js#L202
  const originalFindPaths = require('module')._findPath;

  require('module')._findPath = function(request, paths) {
    paths.map(function(aPath) {
      var parts = aPath.split(sep);
      if (parts[parts.length - 1] === 'node_modules') {
        parts[parts.length - 1] = '';
        return parts.join(sep);
      }
    })
		.filter(function(aPath) {
  return aPath;
		})
		.forEach(function(aPath) {
  modulesDirectories.forEach(function(modulesDir) {
    paths.push(aPath + modulesDir);
  });
		});

    return originalFindPaths(request, paths);
  };
}

export default function({ types: t }) {
  return {
    visitor: {
      CallExpression(path, { file: { opts: { filename: filename } }, opts: { config: configPath = 'webpack.config.js', findConfig: findConfig = false } = {} }) { // eslint-disable-line no-unused-vars
        // Get webpack config
        const conf = getConfig(configPath, findConfig);

        // If the config comes back as null, we didn't find it, so throw an exception.
        if(conf === null) {
          throw new Error('Cannot find configuration file: ' + configPath);
        }

        // exit if there's no modules config
        if(!conf.resolve || (!conf.resolve.modules && !conf.resolve.modulesDirectories)) {
          return;
        }

        const { callee: { name: calleeName }, arguments: args } = path.node;

        // Exit if it's not a require statement
        if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
          return;
        }

        // Get the webpack modules config
        const modulesConf = conf.resolve.modules ? conf.resolve.modules : conf.resolve.modulesDirectories;

        injectModulesDirectories(modulesConf);
      }
    }
  };
}

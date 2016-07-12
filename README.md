
# babel-plugin-webpack-modules

This Babel 6 plugin allows you to use webpack modules in Babel.

This plugin is simply going to take the modules or modulesDirectories defined in your webpack config and inject them into Node.js module resolver. It is especially useful when you rely on webpack modules to keep import paths nicer (and sometimes more consistent depending on your project configuration) but you can't use webpack in a context, for example for unit testing.

## Example
With the following `webpack.config.js`:
```js
module.exports = {
    ...
    resolve: {
        modules: [
          'screens',
          'components',
          'shared',
          'node_modules'
        ]
    }
    ...
};
```
A javascript file could be written like:
```js
import MyImport from 'MyImport';
```
instead of :
```js
import MyImport from '../../../components/MyImport';
```
## Install

```shell
npm install --save-dev babel-plugin-webpack-modules
```

Add it as a plugin to your `.babelrc` file. You can optionally add a path to a config file, for example:
```
{
   "presets":[ "react", "es2015", "stage-0" ],
   "env": {
    "test": {
      "plugins": [
        [ "babel-plugin-webpack-modules", { "config": "./webpack.config.test.js" } ]
      ]
    }
  }
}
```
In this case, the plugin will only be run when `NODE_ENV` is set to `test`.

It is also possible to pass a findConfig option, and the plugin will attempt to find the nearest configuration file within the project using [find-up](https://github.com/sindresorhus/find-up). For example:
```
{
   "presets":[ "react", "es2015", "stage-0" ],
   "env": {
    "test": {
      "plugins": [
        [ "babel-plugin-webpack-modules", {
            "config": "webpack.config.test.js",
            "findConfig": true
          } ]
      ]
    }
  }
}
```

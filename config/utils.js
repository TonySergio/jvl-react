var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

function getExclude(options) {
  return function (filePath) {
    if (/node_modules/.test(filePath)) {
      return true;
    }
    if (options.cssModulesWithAffix) {
      if (/\.module\.(css|less|sass|scss)$/.test(filePath)) return true;
    }
    if (options.cssModulesExcludes) {
      for (const exclude of options.cssModulesExcludes) {
        if (filePath.indexOf(exclude) > -1) return true;
      }
    }
  }
}


exports.cssLoaders = function (options) {

  const cssModulesConfig = {
    modules: true,
    //localIdentName:  process.env.NODE_ENV === 'production' ? '[local]___[hash:base64:5]' : '[name]__[local]___[hash:base64:5]'
  };


  options = options || {}

  const { cssModules } = options;


  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
      importLoaders: 1,
      ...(cssModules ? cssModulesConfig : {}),
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader'
      })
    } else {
      return ['style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', {
          javascriptEnabled: true,
          modules: true,
          cssModules: true,
          less: true
    }),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

exports.styleLoaders = function (options) {
  var output = [];

  var exclude = getExclude(options);

  var loadersForNodeModules = exports.cssLoaders({
    ...options,
    ...{
      cssModules: true,
      cssModulesWithAffix: true,
      cssModulesExcludes: true
    },
  });

  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
      exclude
    });

    var loaderModules = loadersForNodeModules[extension];

    output.push({
      test:  new RegExp('\\.module\\.' + extension + '$'),
      use: loaderModules
    })
  }



  for (var extension in loadersForNodeModules) {
    var loader = loadersForNodeModules[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
      include: /node_modules/
    });

    // output.push({
    //   test:  new RegExp('\\.module\\.' + extension + '$'),
    //   use: loader
    // })
  }


  return output
}

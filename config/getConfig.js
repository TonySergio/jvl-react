var path = require("path");
var assert = require("assert");
var autoprefixer = require('autoprefixer');
var defaultBrowsers = require('./browsers').default;

exports.default = function getConfig(opts = {}) {
  //assert(opts.cwd, 'opts.cwd must be specified');

  var extname = path.extname;

  const isDev = process.env.NODE_ENV === 'development';


  const postcssOptions = {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'), // eslint-disable-line
      autoprefixer({
        browsers: opts.browserslist || defaultBrowsers,
        flexbox: 'no-2009',
      }),
      ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []),
    ],
  };
  const cssModulesConfig = {
    modules: true,
    localIdentName: isDev
      ? '[name]__[local]___[hash:base64:5]'
      : '[local]___[hash:base64:5]',
  };
  const lessOptions = {
    ...(opts.lessLoaderOptions || {}),
  };
  const cssOptions = {
    importLoaders: 1,
    ...(isDev
      ? {}
      : {
        minimize: !(
          process.env.CSS_COMPRESS === 'none' ||
          process.env.COMPRESS === 'none' ||
          process.env.NO_COMPRESS
        )
          ? {
            // ref: https://github.com/umijs/umi/issues/164
            minifyFontValues: false,
          }
          : false,
        sourceMap: !opts.disableCSSSourceMap,
      }),
    ...(opts.cssLoaderOptions || {}),
  };

  function getCSSLoader(opts = {}) {
    const {cssModules, less, sass, sassOptions} = opts;

    let hasSassLoader = true;
    try {
      require.resolve('sass-loader');
    } catch (e) {
      hasSassLoader = false;
    }

    return [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          ...cssOptions,
          ...(cssModules ? cssModulesConfig : {}),
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: postcssOptions,
      },
      ...(less
        ? [
          {
            loader: require.resolve('less-loader'),
            options: lessOptions,
          },
        ]
        : []),
      ...(sass && hasSassLoader
        ? [
          {
            loader: require.resolve('sass-loader'),
            options: sassOptions,
          },
        ]
        : []),
    ];
  }

  function exclude(filePath) {
    if (/node_modules/.test(filePath)) {
      return true;
    }
    if (opts.cssModulesWithAffix) {
      if (/\.module\.(css|less|sass|scss)$/.test(filePath)) return true;
    }
    if (opts.cssModulesExcludes) {
      for (const exclude of opts.cssModulesExcludes) {
        if (filePath.indexOf(exclude) > -1) return true;
      }
    }
  }


  const cssRules = [
    ...(opts.cssModulesExcludes
      ? opts.cssModulesExcludes.map(file => {
        return {
          test(filePath) {
            return filePath.indexOf(file) > -1;
          },
          use: getCSSLoader({
            less: extname(file).toLowerCase() === '.less',
            sass:
              extname(file).toLowerCase() === '.sass' ||
              extname(file).toLowerCase() === '.scss',
            sassOptions: opts.sass,
          }),
        };
      })
      : []),
    ...(opts.cssModulesWithAffix
      ? [
        {
          test: /\.module\.css$/,
          use: getCSSLoader({
            cssModules: true,
          }),
        },
        {
          test: /\.module\.less$/,
          use: getCSSLoader({
            cssModules: true,
            less: true,
          }),
        },
        {
          test: /\.module\.(sass|scss)$/,
          use: getCSSLoader({
            cssModules: true,
            sass: true,
            sassOptions: opts.sass,
          }),
        },
      ]
      : []),
    {
      test: /\.css$/,
      exclude,
      use: getCSSLoader({
        cssModules: !opts.disableCSSModules,
      }),
    },
    {
      test: /\.css$/,
      include: /node_modules/,
      use: getCSSLoader(),
    },
    {
      test: /\.less$/,
      exclude,
      use: getCSSLoader({
        cssModules: !opts.disableCSSModules,
        less: true,
      }),
    },
    {
      test: /\.less$/,
      include: /node_modules/,
      use: getCSSLoader({
        less: true,
      }),
    },
    {
      test: /\.(sass|scss)$/,
      exclude,
      use: getCSSLoader({
        cssModules: !opts.disableCSSModules,
        sass: true,
        sassOptions: opts.sass,
      }),
    },
    {
      test: /\.(sass|scss)$/,
      include: /node_modules/,
      use: getCSSLoader({
        sass: true,
        sassOptions: opts.sass,
      }),
    },
  ];


  return cssRules;
}

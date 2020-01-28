const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const pack = require('./package.json');

const banner = `
  ${pack.name} v${pack.version} - ${pack.description}

  ${pack.repository}

  Copyright (c) 2020 ${pack.author.name} - Released under ${pack.license} license.
`;

const common = {
  mode: 'none',
  devtool: 'none',
  entry: {
    'ujs-actions': './src/simpleujs.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'ujs_actions'
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {loader: 'babel-loader'}
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner,
      entryOnly: true
    })
  ]
};


//
// UMD for browser
//
const umdVersion = merge(common, {
  output: {
    filename: 'ujs-actions.js',
    libraryTarget: 'umd'
  }
});

//
// UMD for browser (minified version)
//
const umdMinifiedVersion = merge(common, {
  output: {
    filename: 'ujs-actions.min.js',
    libraryTarget: 'umd'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false
    })]
  }
});

//
// CommonJS2 for builders
//
const commonjs2Version = merge(common, {
  output: {
    filename: 'ujs-actions.common.js',
    libraryTarget: 'commonjs2'
  }
});

//
// Development
//
const developmentVersion = merge(common, {
  devtool: 'inline-source-map',
  output: {
    filename: 'ujs-actions.dev.js',
    libraryTarget: 'umd'
  }
});

module.exports = [
  umdVersion,
  umdMinifiedVersion,
  commonjs2Version,
  developmentVersion
];

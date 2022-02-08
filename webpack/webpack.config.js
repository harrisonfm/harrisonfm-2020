const path = require('path');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const plugins = require('./plugins');
const loaders = require('./loaders');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: isDev ? 'inline-source-map' : false,
  stats: { warnings: false }, // Hide warnings
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'scripts/index.js',
  },
  module: {
    rules: loaders,
  },
  resolve: {
    extensions: ['.js', '.css', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      "~": path.resolve(__dirname, '../src')
    },
  },
  plugins,
  optimization: {
    minimize: !isDev,
    minimizer: isDev
      ? []
      : [new TerserPlugin()],
  },
};

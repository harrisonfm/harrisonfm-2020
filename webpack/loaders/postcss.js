const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  test: /\.css$/i,
  use: [MiniCssExtractPlugin.loader, 'css-loader'],
};
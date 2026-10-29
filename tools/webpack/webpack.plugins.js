const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { inDev } = require('./webpack.helpers');

module.exports = [
  inDev() && new webpack.HotModuleReplacementPlugin(),
  inDev() && new ReactRefreshWebpackPlugin(),
].filter(Boolean);

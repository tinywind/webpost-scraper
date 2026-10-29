const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

module.exports = {
  module: {
    // The isolated renderer cannot execute the Node asset relocation runtime.
    rules: rules.filter(rule => rule.use?.loader !== '@vercel/webpack-asset-relocator-loader'),
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      // Custom Aliases
      ...require('./webpack.aliases'),
    },
  },
  optimization: {
    runtimeChunk: false, // 'single'
  },
  stats: 'minimal',
  /**
   * Fix: Enable inline-source-map to fix following:
   * Dev tools: unable to load source maps over custom protocol
   */
  devtool: 'inline-source-map',
};

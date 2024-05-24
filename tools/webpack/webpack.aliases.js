const { createWebpackAliases } = require('./webpack.helpers');

// Export aliases
module.exports = createWebpackAliases({
  '@assets': 'assets',
  '@pages': 'src/renderer/pages',
  '@components': 'src/renderer/components',
  '@common': 'src/common',
  '@main': 'src/main',
  '@renderer': 'src/renderer',
  '@src': 'src',
  '@styles': 'src/renderer/styles',
});

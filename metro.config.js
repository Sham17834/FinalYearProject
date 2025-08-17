// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  assetExts: [
    ...config.resolver.assetExts,
    'onnx',
    'json',
    'bin'
  ],
  sourceExts: [
    ...config.resolver.sourceExts,
    'js',
    'jsx',
    'json',
    'ts',
    'tsx',
  ]
};

module.exports = config;
module.exports = {
  // ... other config options ...
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      path: require.resolve('path-browserify'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      http: require.resolve('stream-http'),
      fs: require.resolve('browserify-fs'),
    },
  },
};
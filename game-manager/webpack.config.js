module.exports = {
  mode: 'development',
  target: 'web',
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules'],
  },
  output: {
    globalObject: 'this',
  },
};
//     // fallback: {
//     //   // buffer: require.resolve('empty'),
//     //   // crypto: require.resolve('empty'),
//     //   // stream: require.resolve('empty'),
//     //   // zlib: require.resolve('empty'),
//     //   // querystring: require.resolve('empty'),
//     //   // path: require.resolve('empty'),
//     //   // url: require.resolve('empty'),
//     //   // util: require.resolve('empty'),
//     //   // http: require.resolve('empty'),
//     //   // fs: require.resolve('empty'),
//     //   // vm: require.resolve('empty'),
//     //   // assert: require.resolve('empty'),
//     //   // https: require.resolve('empty'),
//     //   // os: require.resolve('empty'),
//     //   // mime: require.resolve('empty'),
//     //   // send: require.resolve('empty'),
//     //   // express: require.resolve('empty'),
//     //   buffer: require.resolve('buffer/'),
//     //   crypto: require.resolve('crypto-browserify'),
//     //   stream: require.resolve('stream-browserify'),
//     //   zlib: require.resolve('browserify-zlib'),
//     //   querystring: require.resolve('querystring-es3'),
//     //   path: require.resolve('path-browserify'),
//     //   url: require.resolve('url/'),
//     //   util: require.resolve('util/'),
//     //   http: require.resolve('stream-http'),
//     //   fs: require.resolve('browserify-fs'),
//     //   vm: require.resolve("vm-browserify"),
//     //   assert: require.resolve("assert/"),
//     //   https: require.resolve("https-browserify"),
//     //   os: require.resolve("os-browserify"),
//     //   indexedDB: require.resolve('idb'),
//     // },

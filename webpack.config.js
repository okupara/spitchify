//I'm considering how I config when I want to build server-side program.
module.exports = {
  entry: {
    'background': './src/background.js',
    'content': './src/content/index.jsx'
  },
  output: {
    path: './chrome_extension/',
    filename: '[name].js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.js(x?)$/,
        exclude: [/node_modules/],
        loader: 'babel',
        query: {
          presets: ['es2016', 'es2017', 'react', 'stage-3'],
          plugins: ['babel-plugin-transform-es2015-modules-commonjs']
        }
      }
    ]
  }
}

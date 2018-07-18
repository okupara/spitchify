const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    content: "./src/content.ts",
    background: "./src/background.ts"
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader"
      } /*,
      {
        test: /\.worker\.js/,
        exclude: [/node_modules/, /dist/],
        use: {
          loader: 'worker-loader',
          options: { inline: true }
        }
      }*/,
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract(
          Object.assign({
            fallback: {
              loader: require.resolve("style-loader"),
              options: {
                hmr: false
              }
            },
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                  minimize: true,
                  sourceMap: false
                }
              }
            ]
          })
        )
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   template: path.join(process.cwd(), 'public', 'index.html')
    // }),
    // new ExtractTextPlugin({
    //   filename: 'index.css'
    // })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  }
};

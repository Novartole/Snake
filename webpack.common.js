const path = require("path"),
      fs = require("fs"),
      { CleanWebpackPlugin } = require("clean-webpack-plugin"),
      HtmlWebpackPlugin = require("html-webpack-plugin");      

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  entry: path.resolve(appDirectory, "src", "index.ts"),
  resolve: {

    extensions: [".tsx", ".ts", ".js"]

  },
  output: {
    path: path.resolve(appDirectory, "docs"),
    filename: "js/bundle.js"
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        use: "ts-loader"
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      
      template: path.resolve(appDirectory, "public", "index.html")

    })
  ]
};
const { merge } = require("webpack-merge"),
      common = require("./webpack.common.js"),
      path = require("path"),
      fs = require("fs");      

const appDirectory = fs.realpathSync(process.cwd());

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(appDirectory, "docs"),    
    hot: true,
    open: true,
    port: 8080
  }  
});
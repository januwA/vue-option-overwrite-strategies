process.env.NODE_ENV = "production";

// 最小化生产
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const shared = require("./shared");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyFilePlugin = require("webpack-copy-file-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, "../../src/optionOverwriteStrategies.ts"),
  module: {
    rules: shared.rules,
  },
  resolve: shared.resolve,
  optimization: {
    // 压缩js,css文件
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyFilePlugin(
      [
        "README.md",
        "package.json",
        "LICENSE",
        "CHANGELOG.md",
        "./dist/src/optionOverwriteStrategies.d.ts",
      ].map((f) => path.resolve(__dirname, "../../", f))
    ),
  ],
  output: {
    filename: "vue-option-overwrite-strategies.js",
    path: path.resolve(__dirname, "../../build"),
    libraryTarget: "umd",
    globalObject: "this",
  },
};

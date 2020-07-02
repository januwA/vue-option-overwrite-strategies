const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const util = require("./util");
const tsConfig = require("../../tsconfig.json");

const isDevMode = process.env.NODE_ENV === "development";
/**
 * 在[dev/prod.config.js]中公用的配置
 */
module.exports = {
  entry: {
    main: util.getEntryMain(),
  },
  output: {
    filename: "[name]-[hash].js",
    path: util.getOutputPath(tsConfig),

    // 如果发布第三方包，可以启动下面这三个配置
    // library: "packageName",
    libraryTarget: "umd",
    globalObject: "this",
  },

  rules: [
    {
      // See also: https://github.com/microsoft/TypeScript-Babel-Starter
      // 如果你想要.d.ts文件，那么ts-loader可能来的更直接点
      test: /\.tsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "ts-loader",
      },
    },
    {
      test: /\.styl$/,
      use: [
        // 该插件将CSS提取到单独的文件中
        // https://webpack.js.org/plugins/mini-css-extract-plugin/
        isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
        { loader: "css-loader", options: { importLoaders: 1 } },
        { loader: "stylus-loader" },
      ],
    },
    {
      test: /\.vue$/,
      use: {
        loader: "vue-loader",
        options: {
          loaders: {},
        },
      },
    },
  ],
  resolve: {
    // 导入此类文件时，不用添加后缀
    extensions: [".tsx", ".ts", ".js", ".vue"],

    // 如果要配置路径别名，就在/tsconfig.json里面配置
    alias: {
      ...util.parseTsConfigPaths(tsConfig),
    },
  },
  optimization: {},
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      title: "webpack-scaffold",
      template: util.getHtmlTemplatePath(),
    }),
  ],
};

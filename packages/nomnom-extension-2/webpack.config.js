const path = require("path");

const glob = require("glob");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:/]+/g) || [];
  }
}

module.exports = (_env, { mode }) => {
  const devMode = mode !== "production";

  const plugins = [
    new CleanWebpackPlugin(["dist"]),
    new MiniCssExtractPlugin({ filename: devMode ? "[name].css" : "[name].[hash].css" }),
    new HtmlWebpackPlugin({ template: "src/index.html" })
  ];

  if (!devMode) {
    plugins.push(
      new PurgecssPlugin({
        // Specify the locations of any files you want to scan for class names.
        paths: glob.sync(path.join(__dirname, "src/**/*"), { nodir: true }),
        extractors: [{ extractor: TailwindExtractor, extensions: ["html", "tsx"] }]
      })
    );
  }

  return {
    entry: "./src/index.tsx",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist")
    },
    devServer: { contentBase: "./dist" },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".css"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: { loader: "babel-loader" }
        },
        {
          test: /\.css$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader"
          ]
        }
      ]
    },
    plugins
  };
};

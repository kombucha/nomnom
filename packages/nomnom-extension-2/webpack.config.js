const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_env, { mode }) => {
  const devMode = mode !== "production";

  return {
    entry: "./src/index.tsx",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist")
    },
    devServer: { contentBase: "./dist" },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: { loader: "babel-loader" }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(["dist"]),
      new MiniCssExtractPlugin({ filename: devMode ? "[name].css" : "[name].[hash].css" }),
      new HtmlWebpackPlugin({ template: "src/index.html" })
    ]
  };
};

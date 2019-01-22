import * as path from "path";
import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const isProduction = process.env.NODE_ENV === "production";

export default {
  entry: path.resolve(__dirname, "src/index.ts"),
  mode: isProduction ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.ts$/,
        loader: "ts-loader"
      },
      {
        test: /\.vrm$/,
        loader: "file-loader"
      }
    ]
  },
  output: {
    filename: isProduction ? "[hash].js" : "bundle.js",
    path: path.resolve(__dirname, "build")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      minify: {
        collapseWhitespace: isProduction
      }
    })
  ],
  resolve: {
    extensions: [".ts", ".js"]
  }
} as webpack.Configuration;

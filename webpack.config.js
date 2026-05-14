const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = (_env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: path.resolve(__dirname, "src/main.js"),
    output: {
      filename: "assets/js/[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      publicPath: isProduction ? "/hon_promotion/" : "/",
      assetModuleFilename: "assets/media/[name].[contenthash][ext]"
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      },
      extensions: [".js", ".vue", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg|mp4|webm)$/i,
          type: "asset/resource"
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html")
      })
    ],
    devServer: {
      host: "127.0.0.1",
      port: 5173,
      hot: true,
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, "public")
      }
    }
  };
};

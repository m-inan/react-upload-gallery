var path = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
    style: "./src/style.scss",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.*scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  externals: {
    react: "commonjs react",
  },
};


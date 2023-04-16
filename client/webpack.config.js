const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'production';
const styleLoader =
  mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader;

module.exports = {
  mode,
  entry: './client/src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCase',
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: ['client/res/index.html'],
    }),
  ],
};

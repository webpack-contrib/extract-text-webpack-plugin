import webpack from 'webpack';
import ExtractTextPlugin from '../../../src/index';

module.exports = {
  entry: './index.js',
	optimization: {
		splitChunks: {
			minSize: 2
		}
	},
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].txt',
      allChunks: true,
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
};

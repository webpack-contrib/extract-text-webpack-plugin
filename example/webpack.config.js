var webpack = require("webpack");
var ExtractTextPlugin = require("../");
module.exports = {
	entry: {
		a: "./entry.js",
		b: "./entry2.js"
	},
	output: {
		filename: "[name].js",
		chunkFilename: "[name].js",
		path: __dirname + "/assets",
		publicPath: "/assets/"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: ExtractTextPlugin.extract(
				"style-loader",
				"css-loader?sourceMap"
			)},
			{ test: /\.png$/, loader: "file-loader" }
		]
	},
	plugins: [
		new ExtractTextPlugin("[name].css?[hash]-[chunkhash]-[name]", {
			disable: false,
			allChunks: true
		}),
		new webpack.optimize.CommonsChunkPlugin("c", "c.js")
	]
};
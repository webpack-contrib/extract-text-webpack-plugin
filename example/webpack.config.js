var ExtractTextPlugin = require("../");
module.exports = {
	entry: "./entry.js",
	output: {
		filename: "bundle.js",
		path: __dirname + "/assets",
		publicPath: "/assets/"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")},
			{ test: /\.png$/, loader: "file-loader" }
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css?[hash]-[chunkhash]-[name]")
	]
};
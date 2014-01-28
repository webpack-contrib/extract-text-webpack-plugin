var ExtractTextPlugin = require("../");
var plugin = new ExtractTextPlugin("styles.css");
module.exports = {
	entry: "./entry.js",
	output: {
		filename: "bundle.js",
		path: __dirname + "/assets",
		publicPath: "assets/"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loaders: [
				"style-loader",
				plugin.loader,
				"css-loader"
			]}
		]
	},
	plugins: [
		plugin
	]
};
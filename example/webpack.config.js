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
				plugin.loader({remove:true, extract: false}),
				"style-loader",
				plugin.loader(),
				"css-loader"
			]},
			{ test: /\.png$/, loader: "file-loader" }
		]
	},
	plugins: [
		plugin
	]
};
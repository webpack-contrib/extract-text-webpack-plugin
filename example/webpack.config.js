var ExtractTextPlugin = require("../");
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
				ExtractTextPlugin.loader({remove:true, extract: false}),
				"style-loader",
				ExtractTextPlugin.loader(),
				"css-loader"
			]},
			{ test: /\.png$/, loader: "file-loader" }
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css")
	]
};
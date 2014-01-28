# extract text plugin for webpack

## Usage example with css

``` javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	module: {
		loaders: [
			{ test: /\.css$/, loaders: [
				"style-loader",
				ExtractTextPlugin.loader,
				"css-loader"
			]}
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css")
	]
}
```

## API

``` javascript
new ExtractTextPlugin(filename: string, includeChunks: boolean)
```

* `filename` the filename of the result file. May contain `[name]`, `[hash]` or `[id]`.
* `includeChunks` if false (default) only texts from entry chunks is extracted. If true texts from all children is merged into the file for the entry chunk. (TODO)

There is also a `loader` property on the instance. You should use this if you have more than one ExtractTextPlugin.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
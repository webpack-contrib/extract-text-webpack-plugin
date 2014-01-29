# extract text plugin for webpack

## Usage example with css

``` javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	module: {
		loaders: [
			{ test: /\.css$/, loaders: [
				"style-loader",
				ExtractTextPlugin.loader(),
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
new ExtractTextPlugin([id: string], filename: string, [options])
```

* `id` TODO
* `filename` the filename of the result file. May contain `[name]`.
* `options` TODO

There is also a `loader` function on the instance. You should use this if you have more than one ExtractTextPlugin.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
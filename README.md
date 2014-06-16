# extract text plugin for webpack

## Usage example with css

``` javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	module: {
		loaders: [
			{ test: /\.css$/, loaders: [
				ExtractTextPlugin.loader({remove:true, extract: false}),
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

* `id` Unique ident for this plugin instance. (For advanded usage only)
* `filename` the filename of the result file. May contain `[name]`.
* `options`
  * `allChunks` extract all chunks (by default only initial chunks)

There is also a `loader` function on the instance. You should use this if you have more than one ExtractTextPlugin.

**NOTE: Currently you MUST set `allChunks` to `true`.**

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
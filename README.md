# extract text plugin for webpack

## Usage example with css

``` javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	module: {
		loaders: [
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") }
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

``` javascript
ExtractTextPlugin.extract([notExtractLoader], loader)
```

Creates an extracting loader from a existing loader.

* `notExtractLoader` (optional) the loader(s) that should be used when the css is not extracted (i. e. in a additional chunk when `allChunks: false`)
* `loader` the loader(s) that should be used for converting the resource to a css exporting module.

There is also a `extract` function on the instance. You should use this if you have more than one ExtractTextPlugin.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
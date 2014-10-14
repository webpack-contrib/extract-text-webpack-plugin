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

It moves every `require("style.css")` in entry chunks into a separate css output file. So your styles are no longer inlined into the javascript, but separate in a css bundle file (`styles.css`). If your total stylesheet volume is big, it will be faster because the stylesheet bundle is loaded in parallel to the javascript bundle.

Advantages:

* Fewer style tags (older IE has a limit)
* CSS SourceMap (with `devtool: "sourcemap"` and `css-loader?sourceMap`)
* CSS requested in parallel
* CSS cached separate
* Faster runtime (less code and DOM operations)

Caveats:

* Additional HTTP request
* Longer compilation time
* Complexer configuration
* No runtime public path modification
* No Hot Module Replacement

## API

``` javascript
new ExtractTextPlugin([id: string], filename: string, [options])
```

* `id` Unique ident for this plugin instance. (For advanded usage only)
* `filename` the filename of the result file. May contain `[name]`.
* `options`
  * `allChunks` extract all chunks (by default only initial chunks)
  * `disable` disables the plugin

``` javascript
ExtractTextPlugin.extract([notExtractLoader], loader, [options])
```

Creates an extracting loader from a existing loader.

* `notExtractLoader` (optional) the loader(s) that should be used when the css is not extracted (i. e. in a additional chunk when `allChunks: false`)
* `loader` the loader(s) that should be used for converting the resource to a css exporting module.
* `options`
  * `publicPath` override the `publicPath` setting for this loader.

There is also a `extract` function on the instance. You should use this if you have more than one ExtractTextPlugin.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)

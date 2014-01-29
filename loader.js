/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");
module.exports = function(source) {
	this.cacheable && this.cacheable();
	var query = loaderUtils.parseQuery(this.query);
	if(this[__dirname](null, query)) {
		if(query.extract !== false) {
			var text = this.exec(source, this.request);
			this[__dirname](text, query);
		} else {
			this[__dirname]("", query);
		}
		if(query.remove)
			return "// removed by extract-text-webpack-plugin";
		return "// text extracted by extract-text-webpack-plugin\n" +
			"module.exports=\"\";";
	}
	return source;
};
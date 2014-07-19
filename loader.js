/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");
var NodeTemplatePlugin = require("webpack/lib/node/NodeTemplatePlugin");
var NodeTargetPlugin = require("webpack/lib/node/NodeTargetPlugin");
var LibraryTemplatePlugin = require("webpack/lib/LibraryTemplatePlugin");
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
var LimitChunkCountPlugin = require("webpack/lib/optimize/LimitChunkCountPlugin");
module.exports = function(source) {
	this.cacheable && this.cacheable();
	return source;
};
module.exports.pitch = function(request, preReq, data) {
	this.cacheable && this.cacheable();
	var query = loaderUtils.parseQuery(this.query);
	if(this[__dirname](null, query)) {
		if(query.remove) {
			var resultSource = "// removed by extract-text-webpack-plugin";
		} else {
			var resultSource = "// text extracted by extract-text-webpack-plugin\n" +
				"module.exports=\"\";";
		}

		if(query.extract !== false) {
			var childFilename = __dirname + " " + request;
			var outputOptions = {
				filename: childFilename,
				publicPath: this._compilation.outputOptions.publicPath
			};
			var childCompiler = this._compilation.createChildCompiler("extract-text-webpack-plugin", outputOptions);
			childCompiler.apply(new NodeTemplatePlugin(outputOptions));
			childCompiler.apply(new LibraryTemplatePlugin(null, "commonjs2"));
			childCompiler.apply(new NodeTargetPlugin());
			childCompiler.apply(new SingleEntryPlugin(this.context, "!!" + request));
			childCompiler.apply(new LimitChunkCountPlugin({ maxChunks: 1 }));
			var subCache = "subcache " + __dirname + " " + request;
			childCompiler.plugin("compilation", function(compilation) {
				if(compilation.cache) {
					if(!compilation.cache[subCache])
						compilation.cache[subCache] = {};
					compilation.cache = compilation.cache[subCache];
				}
			});
			var source;
			childCompiler.plugin("after-compile", function(compilation, callback) {
				source = compilation.assets[childFilename].source();
				delete compilation.assets[childFilename];
				callback();
			}.bind(this))
			var callback = this.async();
			childCompiler.runAsChild(function(err, entries, compilation) {
				if(err) return callback(err);

				var text = this.exec(source, request);
				this[__dirname](text, query);
				callback(null, resultSource);
			}.bind(this));
		} else {
			this[__dirname]("", query);
			return resultSource;
		}
	}
};
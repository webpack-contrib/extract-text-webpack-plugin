/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var RawSource = require("webpack/lib/RawSource");

var nextId = 0;

function ExtractTextPlugin(filename, includeChunks) {
	this.filename = filename;
	this.includeChunks = includeChunks || false;
	this.id = ++nextId;
	this.loader = ExtractTextPlugin.loader + "?" + this.id
}
module.exports = ExtractTextPlugin;

ExtractTextPlugin.loader = require.resolve("./loader");

ExtractTextPlugin.prototype.apply = function(compiler) {
	compiler.plugin("compilation", function(compilation) {
		compilation.plugin("normal-module-loader", function(loaderContext, module) {
			loaderContext[__dirname] = function(text) {
				module.meta[__dirname] = text;
			};
			loaderContext[__dirname + "?" + this.id] = function(text) {
				module.meta[__dirname + "?" + this.id] = text;
			}.bind(this);
		}.bind(this));
		var filename = this.filename;
		var includeChunks = this.includeChunks;
		var id = this.id;
		compilation.plugin("after-optimize-chunks", function(chunks) {
			chunks.forEach(function(chunk) {
				if(chunk.initial) {
					var text = [];
					chunk.modules.forEach(function(module) {
						if(module.meta[__dirname]) {
							text.push(module.meta[__dirname]);
							module._source = new RawSource("// text extracted by extract-text-webpack-plugin\n" +
								"module.exports=\"\";");
						}
						if(module.meta[__dirname + "?" + id]) {
							text.push(module.meta[__dirname + "?" + id]);
							module._source = new RawSource("// text extracted by extract-text-webpack-plugin\n" +
								"module.exports=\"\";");
						}
					});
					var file = filename.replace(/\[name\]/g, chunk.name);
					text = text.join("");
					this.assets[file] = new RawSource(text);
				}
			}, this);
		});
	}.bind(this));
};
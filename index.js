/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var SourceMapSource = require("webpack/lib/SourceMapSource");
var Template = require("webpack/lib/Template");
var async = require("async");
var SourceNode = require("source-map").SourceNode;
var SourceMapConsumer = require("source-map").SourceMapConsumer;
var ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");

var nextId = 0;

function ExtractTextPlugin(id, filename, options) {
	if(typeof filename !== "string") {
		options = filename;
		filename = id;
		id = ++nextId;
	}
	if(!options) options = {};
	this.filename = filename;
	this.options = options;
	this.id = id;
}
module.exports = ExtractTextPlugin;

ExtractTextPlugin.loader = function(options) {
	return require.resolve("./loader") + (options ? "?" + JSON.stringify(options) : "");
};

ExtractTextPlugin.extract = function(before, loader) {
	if(loader) {
		return [
			ExtractTextPlugin.loader({omit: before.split("!").length, extract: true, remove: true}),
			before,
			loader
		].join("!");
	} else {
		loader = before;
		return [
			ExtractTextPlugin.loader({remove: true}),
			loader
		].join("!");
	}
};

ExtractTextPlugin.prototype.applyAdditionalInformation = function(node, info) {
	if(info.length === 1 && info[0]) {
		node = new SourceNode(null, null, null, [
			"@media " + info[0] + " {",
			node,
			"}"
		]);
	}
	return node;
};

ExtractTextPlugin.prototype.loader = function(options) {
	options = JSON.parse(JSON.stringify(options || {}));
	options.id = this.id;
	return ExtractTextPlugin.loader(options);
};

ExtractTextPlugin.prototype.extract = function(before, loader) {
	if(loader) {
		return [
			this.loader({move: before.split("!").length, extract: true, remove: true}),
			before,
			loader
		].join("!");
	} else {
		loader = before;
		return [
			this.loader({remove: true}),
			loader
		].join("!");
	}
};

ExtractTextPlugin.prototype.apply = function(compiler) {
	var options = this.options;
	compiler.plugin("this-compilation", function(compilation) {
		compilation.plugin("normal-module-loader", function(loaderContext, module) {
			loaderContext[__dirname] = function(content, opt) {
				if(!Array.isArray(content) && content !== null)
					throw new Error("Exported value is not a string.");
				module.meta[__dirname] = {
					content: content,
					options: opt
				};
				return options.allChunks || module.meta[__dirname + "/extract"];
			};
		}.bind(this));
		var contents;
		var filename = this.filename;
		var id = this.id;
		compilation.plugin("optimize-tree", function(chunks, modules, callback) {
			contents = [];
			async.forEach(chunks, function(chunk, callback) {
				var shouldExtract = !!(options.allChunks || chunk.initial);
				var content = [];
				async.forEach(chunk.modules.slice(), function(module, callback) {
					var meta = module.meta && module.meta[__dirname];
					if(meta) {
						var wasExtracted = Array.isArray(meta.content);
						if(shouldExtract !== wasExtracted) {
							module.meta[__dirname + "/extract"] = shouldExtract
							compilation.rebuildModule(module, function(err) {
								if(err) {
									compilation.errors.push(err);
									return callback();
								}
								meta = module.meta[__dirname];
								if(!Array.isArray(meta.content)) {
									var err = new Error(module.identifier() + " doesn't export content");
									compilation.errors.push(err);
									return callback();
								}
								if(meta.content) content.push(meta.content);
								callback();
							});
						} else {
							if(meta.content) content.push(meta.content);
							callback();
						}
					} else callback();
				}, function(err) {
					if(err) return callback(err);
					if(content.length > 0) {
						contents.push({
							chunk: chunk,
							content: content
						});
					}
					callback();
				}.bind(this));
			}.bind(this), function(err) {
				if(err) return callback(err);
				callback();
			}.bind(this));
		});
		compilation.plugin("additional-assets", function(callback) {
			var assetContents = {};
			contents.forEach(function(item) {
				var chunk = item.chunk;
				var file = compilation.getPath(filename, {
					chunk: chunk
				});
				assetContents[file] = (assetContents[file] || []).concat(item.content);
				chunk.files.push(file);
			});
			Object.keys(assetContents).forEach(function(file) {
				var contained = {};
				var content = assetContents[file].reduce(function(arr, items) {
					return arr.concat(items);
				}, []).filter(function(item) {
					if(contained[item[0]]) return false;
					contained[item[0]] = true;
					return true;
				}).map(function(item) {
					var css = item[1];
					var contents = item.slice(1).filter(function(i) { return typeof i === "string"; });
					var sourceMap = typeof item[item.length-1] === "object" ? item[item.length-1] : undefined;
					var text = contents.shift();
					var node = sourceMap ? SourceNode.fromStringWithSourceMap(text, new SourceMapConsumer(sourceMap)) : new SourceNode(null, null, null, text);
					return this.applyAdditionalInformation(node, contents);
				}.bind(this));
				var strAndMap = new SourceNode(null, null, null, content).toStringWithSourceMap();
				compilation.assets[file] = new SourceMapSource(strAndMap.code, file, strAndMap.map.toJSON());
			}.bind(this));
			callback();
		}.bind(this));
	}.bind(this));
};

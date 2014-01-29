/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var RawSource = require("webpack/lib/RawSource");
var async = require("async");

var nextId = 0;

function ExtractTextPlugin(id, filename, options) {
	if(typeof filename !== "string") {
		filename = id;
		options = filename;
		id = ++nextId;
	}
	if(!options) options = {};
	this.filename = filename;
	this.options = options;
	this.id = id;
}
module.exports = ExtractTextPlugin;

ExtractTextPlugin.loader = function(options) {
	return require.resolve("./loader") + "?" + JSON.stringify(options);
};

ExtractTextPlugin.prototype.loader = function(options) {
	options = JSON.parse(JSON.stringify(options || {}));
	options.id = this.id;
	return ExtractTextPlugin.loader(options);
};

ExtractTextPlugin.prototype.apply = function(compiler) {
	compiler.plugin("compilation", function(compilation) {
		compilation.plugin("normal-module-loader", function(loaderContext, module) {
			loaderContext[__dirname] = function(text, options) {
				module.meta[__dirname] = {
					text: text,
					options: options
				};
				return !!module.meta[__dirname + "/extract"];
			};
		}.bind(this));
		var filename = this.filename;
		var id = this.id;
		compilation.plugin("optimize-tree", function(chunks, modules, callback) {
			async.forEach(chunks, function(chunk, callback) {
				var shouldExtract = !!chunk.initial;
				var text = [];
				async.forEach(chunk.modules, function(module, callback) {
					var meta = module.meta[__dirname];
					if(meta) {
						var wasExtracted = typeof meta.text === "string";
						if(shouldExtract !== wasExtracted) {
							module.meta[__dirname + "/extract"] = shouldExtract
							compilation.buildModule(module, function(err) {
								if(err) return callback(err);
								meta = module.meta[__dirname];
								if(typeof meta.text !== "string") return callback(new Error(module.identifier() + " doesn't export text"));
								text.push(meta.text);
								callback();
							});
						} else callback();
					} else callback();
				}, function(err) {
					if(err) return callback(err);
					if(text.length > 0) {
						var file = filename.replace(/\[name\]/g, chunk.name);
						text = text.join("");
						this.assets[file] = new RawSource(text);
					}
					callback();
				}.bind(this));
			}.bind(this), callback);
		});
	}.bind(this));
};
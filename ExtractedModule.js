/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var SourceMapSource = require("webpack/lib/SourceMapSource");
var RawSource = require("webpack/lib/RawSource");

function ExtractedModule(identifier, source, sourceMap, addtitionalInformation) {
	this._identifier = identifier;
	this._source = source;
	this._sourceMap = sourceMap;
	this.addtitionalInformation = addtitionalInformation;
	this.chunks = [];
}
module.exports = ExtractedModule;

ExtractedModule.prototype.addChunk = function(chunk) {
	var idx = this.chunks.indexOf(chunk);
	if(idx < 0)
		this.chunks.push(chunk);
};

ExtractedModule.prototype._removeAndDo = require("webpack/lib/removeAndDo");

ExtractedModule.prototype.removeChunk = function(chunk) {
	return this._removeAndDo("chunks", chunk, "removeModule");
};

ExtractedModule.prototype.rewriteChunkInReasons = function(oldChunk, newChunks) { };

ExtractedModule.prototype.identifier = function() {
	return this._identifier;
};

ExtractedModule.prototype.source = function() {
	if(this._sourceMap)
		return new SourceMapSource(this._source, null, this._sourceMap);
	else
		return new RawSource(this._source);
};

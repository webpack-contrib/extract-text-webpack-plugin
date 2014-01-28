/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(source) {
	this.cacheable && this.cacheable();
	var text = this.exec(source, this.request);
	this[__dirname + this.query](text);
	return source;
};
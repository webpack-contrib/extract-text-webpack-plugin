var ExtractTextPlugin = require("../../../");
module.exports = {
	entry: {
		'js/a': "./a",
		'js/b': "./b"
	},
	plugins: [
		new ExtractTextPlugin({
			filename:  {
				format: 'txt/[name].txt',
				modify: (filename) => {
					return filename.replace('txt/js', 'txt');
				}
			},
			allChunks: true
		})
	]
};

const termutils = {};

const stringWidth = require('string-width');
const wrapAnsi = require('wrap-ansi');
const emoji = require('node-emoji');

// https://stackoverflow.com/a/46719196/561309
const containsDoubleByteRegex = /[^\u0000-\u00ff]/;
termutils.containsDoubleByte = function(str) {
	if (!str.length) return false;
	if (str.charCodeAt(0) > 255) return true;
	return containsDoubleByteRegex.test(str);
}

termutils.textLength = function(str) {
	return stringWidth(str);
	//return stringWidth(str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, ""));
};

termutils.wrapLine = function(line, width) {
	return wrapAnsi(line, width, {
		hard: true,
		trim: false,
	});
}

termutils.wrapLines = function(linesString, width) {
	let output = linesString.split('\n');
	for (let i = 0; i < output.length; i++) {
		output[i] = termutils.wrapLine(output[i], width);
	}
	return output.join('\n');
}

termutils.splitByEscapeCodes = function(str) {
	return str.split(/(\u001b\[(?:\d{1,3})(?:;\d{1,3})*m)/g);
}

termutils.toPlainText = function(str) {
	// Windows terminals also can't render the € symbol, so convert it too
	return emoji.unemojify(str).replace(/€/g, ':euro:');
}

module.exports = termutils;
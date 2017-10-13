const termutils = {};

const stringWidth = require('string-width');
const wrapAnsi = require('wrap-ansi');

// https://stackoverflow.com/a/46719196/561309
const containsDoubleByteRegex = /[^\u0000-\u00ff]/;
termutils.containsDoubleByte = function(str) {
	if (!str.length) return false;
	if (str.charCodeAt(0) > 255) return true;
	return containsDoubleByteRegex.test(str);
}

termutils.textLength = function(str) {
	return stringWidth(str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, ""));
};

termutils.wrap = function(line, width) {
	return wrapAnsi(line, width, { hard: true });
}

termutils.splitByEscapeCodes = function(str) {
	return str.split(/(\u001b\[(?:\d{1,3})(?:;\d{1,3})*m)/g);
}

module.exports = termutils;
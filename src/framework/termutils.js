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

termutils.drawHLine = function(term, cursorX, cursorY, length, char) {
	term.moveTo(cursorX, cursorY);
	term(char.repeat(length));
}

termutils.drawVLine = function(term, cursorX, cursorY, length, char) {
	for (let i = 0; i < length; i++) {
		term.moveTo(cursorX, cursorY + i);
		term(char);
	}
}

termutils.msleep = function(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

// Use functions below to hide/show cursor and keep track of its state
termutils.cursorShown_ = true;

termutils.cursorShown = function(term) {
	return termutils.cursorShown_;
}

termutils.showCursor = function(term, doShow) {
	if (typeof doShow === 'undefined') doShow = true;
	termutils.cursorShown_ = doShow;
	term.hideCursor(!doShow);
}

termutils.hideCursor = function(term) {
	termutils.showCursor(term, false);
}

module.exports = termutils;
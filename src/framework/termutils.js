const termutils = {};

termutils.textLength = function(str) {
	return str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, "").length;
};

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
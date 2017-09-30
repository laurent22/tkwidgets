const termutils = {};

termutils.drawLine = function(term, cursorX, cursorY, length, char) {
	term.moveTo(cursorX, cursorY);
	term(char.repeat(length));
}

module.exports = termutils;
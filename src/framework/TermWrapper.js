const tk = require('terminal-kit');
const ScreenWrapper = require('./ScreenWrapper.js');

class TermWrapper {

	constructor(term) {
		this.term_ = term;
		this.cursorShown_ = true;
	}

	get term() {
		return this.term_;
	}

	get innerStyle() {
		return this.term;
	}

	saveCursor() {
		return this.term.saveCursor();
	}

	restoreCursor() {
		return this.term.restoreCursor();
	}

	drawHLine(cursorX, cursorY, length, char) {
		this.moveTo(cursorX, cursorY);
		this.write(char.repeat(length));
	}

	drawVLine(cursorX, cursorY, length, char) {
		for (let i = 0; i < length; i++) {
			this.moveTo(cursorX, cursorY + i);
			this.write(char);
		}
	}

	fullscreen(enabled = true) {
		return this.term.fullscreen(enabled);
	}

	grabInput() {
		return this.term.grabInput();
	}

	on(eventName, listener) {
		return this.term.on(eventName, listener);
	}

	get cursorShown() {
		return this.cursorShown_;
	}

	showCursor(doShow = true) {
		if (typeof doShow === 'undefined') doShow = true;
		this.cursorShown_ = doShow;
		this.term.hideCursor(!doShow);
	}

	hideCursor() {
		this.showCursor(false);
	}

	saveState() {
		return { cursorShown: this.cursorShown };
	}

	restoreState(state) {
		this.showCursor(this.cursorShown);
	}

	inputField(options, callback) {
		return this.term.inputField(options, callback);
	}

	write(string) {
		return this.term.noFormat(string);
	}

	moveTo(x, y, s = null) {
		if (s === null) {
			return this.term.moveTo(x, y);
		} else {
			return this.term.moveTo(x, y, s);
		}
	}

	get width() {
		return this.term.width;
	}

	get height() {
		return this.term.height;
	}

	createScreenBuffer(width, height) {
		return new ScreenWrapper(tk.ScreenBuffer.create({
			width: width,
			height: height,
			dst: this.term,
		}));
	}

}

module.exports = TermWrapper;
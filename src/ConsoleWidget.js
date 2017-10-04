const BaseWidget = require('./BaseWidget.js');
const termutils = require('./framework/termutils.js');

class ConsoleWidget extends BaseWidget {

	constructor() {
		super();
		this.buffer_ = [];
	}

	widgetType() {
		return 'console';
	}

	canHaveFocus() {
		return true;
	}

	onFocus() {
		super.onFocus();
		this.window().disableFocusChange();
	}

	render() {
		super.render();

		const term = this.term();

		this.clear();

		let x = this.absoluteX();
		let y = this.absoluteY();

		let topBufferLineIndex = this.buffer_.length - (this.innerHeight() - 1);
		if (topBufferLineIndex < 0) topBufferLineIndex = 0;

		for (let i = 0; i < this.innerHeight(); i++) {
			let lineIndex = topBufferLineIndex + i;
			if (lineIndex >= this.buffer_.length) break;

			term.moveTo(x, y);
			term(this.buffer_[lineIndex]);
			y++;
		}

		term.moveTo(x, y);
		term('>' + ' '.repeat(this.innerWidth() - 1));
		term.moveTo(x + 2, y);

		if (this.hasFocus()) {	
			const cursorWasShown = termutils.cursorShown(term);
			termutils.showCursor(term);

			let options = { cancelable: true };

			term.inputField(options, (error, input) => {
				termutils.showCursor(term, cursorWasShown);

				if (input === undefined) { // User cancel
					this.window().enableFocusChange();
					this.window().focusLast();
					return;
				}

				this.buffer_ = this.buffer_.concat(input.split("\n"));
				this.invalidate();
			});
		}
	}

}

module.exports = ConsoleWidget;
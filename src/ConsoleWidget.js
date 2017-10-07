const BaseWidget = require('./BaseWidget.js');
const termutils = require('./framework/termutils.js');

class ConsoleWidget extends BaseWidget {

	constructor() {
		super();
		this.buffer_ = [];
		this.prompt_ = '> ';
		this.waitForResult_ = null;
	}

	widgetType() {
		return 'console';
	}

	canHaveFocus() {
		return true;		
	}

	tabIndex() {
		// A console can have the focus, but you cannot tab in or out of it
		// because TAB might needed to be interpreted by it. Default key
		// to exit the console is ESC.
		return -1;
	}

	onFocus() {
		super.onFocus();
		this.window().disableFocusChange();
	}

	prompt() {
		return this.prompt_;
	}

	// Allows asking a question, and waiting for the answer. Once this is done, the prompt
	// is reversed to its previous value.
	waitForResult(message) {
		if (this.waitForResult_) throw new Error('Another command already waiting for result');

		this.waitForResult_ = {
			promise: null,
			previousPrompt: this.prompt(),
		};

		this.setPrompt(message + ' ');

		this.waitForResult_.promise = new Promise((resolve, reject) => {
			this.waitForResult_.resolve = resolve;
			this.waitForResult_.reject = reject;
		});

		return this.waitForResult_.promise;
	}

	setPrompt(v) {
		if (this.prompt_ === v) return;
		this.prompt_ = v;
		this.invalidate();
	}

	bufferPush(s) {
		if (s === null || s === undefined) {
			this.buffer_.push('');
		} else if (Object.prototype.toString.call(s) === '[object Array]') {
			for (let i = 0; i < s.length; i++) {
				this.bufferPush(s[i]);
			}
		} else if (typeof s === 'string') {
			let splitted = s.split("\n");
			if (splitted.length > 1) {
				this.bufferPush(splitted);
			} else {
				this.buffer_.push(s);
			}
		} else {
			this.buffer_.push(s.toString());
		}

		this.invalidate();
	}

	render() {
		super.render();

		const term = this.term();

		this.clear();

		let x = this.absoluteX();
		let y = this.absoluteY();
		const innerWidth = this.innerWidth();
		const innerHeight = this.innerHeight();

		let topBufferLineIndex = this.buffer_.length - (innerHeight - 1);
		if (topBufferLineIndex < 0) topBufferLineIndex = 0;

		for (let i = 0; i < innerHeight; i++) {
			let lineIndex = topBufferLineIndex + i;
			if (lineIndex >= this.buffer_.length) break;

			// Currently the line is simply cut to fit within the required
			// width - i.e. not handling word wrap at the moment.s
			let line = this.buffer_[lineIndex].substr(0, innerWidth);

			term.moveTo(x, y);
			term(line);
			y++;
		}

		const prompt = this.prompt();

		term.moveTo(x, y);
		term(prompt + ' '.repeat(innerWidth - prompt.length));
		term.moveTo(x + prompt.length, y);

		if (this.hasFocus()) {	
			const cursorWasShown = termutils.cursorShown(term);
			termutils.showCursor(term);

			let options = { cancelable: true };

			term.inputField(options, (error, input) => {
				termutils.showCursor(term, cursorWasShown);

				const wfr = this.waitForResult_;
				this.waitForResult_ = null;

				if (input === undefined) { // User cancel
					this.window().enableFocusChange();
					this.window().focusLast();

					if (wfr) {
						wfr.resolve(null);
					} else {
						this.eventEmitter().emit('cancel');
					}
				} else {
					this.bufferPush(prompt + input);

					if (wfr) {
						wfr.resolve(input);
					} else {
						this.eventEmitter().emit('accept', { input: input });
					}
				}

				if (wfr) {
					this.setPrompt(wfr.previousPrompt);
				}

				this.invalidate();
			});
		}
	}

}

module.exports = ConsoleWidget;
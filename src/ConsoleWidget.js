const BaseWidget = require('./BaseWidget.js');
const termutils = require('./framework/termutils.js');

class ConsoleWidget extends BaseWidget {

	constructor() {
		super();
		this.buffer_ = [];
		this.prompt_ = '> ';
		this.waitForResult_ = null;
		this.promptCursorPos_ = null;
		this.history_ = [];
		this.initialText_ = '';
		this.inputActive_ = false;
		this.inputEventEmitter_ = null;
		this.promptVisible_ = true;
	}

	get widgetType() {
		return 'console';
	}

	get canHaveFocus() {
		return true;		
	}

	get tabIndex() {
		// A console can have the focus, but you cannot tab in or out of it
		// because TAB might needed to be interpreted by it. Default key
		// to exit the console is ESC.
		return -1;
	}

	get promptVisible() {
		return this.promptVisible_;
	}

	set promptVisible(v) {
		if (this.promptVisible_ === v) return;
		this.promptVisible_ = v;
		this.invalidate();
	}

	focus(initialText = null) {
		this.initialText_ = initialText === null ? '' : initialText;
		super.focus();
		this.invalidate();
	}

	onFocus() {
		super.onFocus();
		this.window.disableFocusChange();
	}

	get prompt() {
		return this.prompt_;
	}

	get history() {
		return this.history_;
	}

	// Allows asking a question, and waiting for the answer. Once this is done, the prompt
	// is reversed to its previous value.
	waitForResult(message) {
		if (this.waitForResult_) throw new Error('Another command already waiting for result');

		this.waitForResult_ = {
			promise: null,
			previousPrompt: this.prompt,
		};

		this.prompt = message + ' ';
		this.promptVisible = true;

		this.waitForResult_.promise = new Promise((resolve, reject) => {
			this.waitForResult_.resolve = resolve;
			this.waitForResult_.reject = reject;
		});

		this.logger().debug('Doing waitForResult: ' + message);

		this.invalidate();

		return this.waitForResult_.promise;
	}

	set prompt(v) {
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

	// Convenience function to move the cursor back at the prompt. Useful when drawing something
	// on the terminal (which moves the cursor around) while the console is active.
	resetCursor() {
		if (!this.hasFocus || this.promptCursorPos_ === null) return;

		let x = this.promptCursorPos_.x;
		let y = this.promptCursorPos_.y;

		// If the input is currently active, we simply rebase it to the
		// new x/y coordinates and call redraw, which is going to repopulate
		// the prompt with the command being currently typed, and move the
		// cursor at the end of it.
		if (this.inputEventEmitter_) {
			this.inputEventEmitter_.rebase(x, y);
			this.inputEventEmitter_.redraw();
		} else {
			this.term.moveTo(x, y);
		}
	}

	pause() {
		if (!this.inputEventEmitter_) return;
		this.inputEventEmitter_.pause();
	}

	resume() {
		if (!this.inputEventEmitter_) return;
		this.inputEventEmitter_.resume();
	}

	wrapLine(line, width) {
		let fragments = termutils.splitByEscapeCodes(line);
		let output = [];

		let currentLine = '';
		let currentWidth = 0;

		for (let i = 0; i < fragments.length; i++) {
			const fragment = fragments[i];

			if (!termutils.textLength(f)) {
				currentLine += fragment;
			} else {
				while (fragment.length > 0) {
					if (currentWidth + fragment.length > width) {
						const w = fragment.substr(0, width - currentWidth);
						currentLine += w;
						output.push(currentLine);
						currentLine = '';
						currentWidth = 0;
						fragment = fragment.substr(w.length);
					} else {
						currentLine += fragment;
						currentWidth += fragment.length;
						fragment = '';
					}
				}
			}
		}

		if (currentLine) output.push(currentLine);

		return output;
	}

	get promptWidth_() {
		return termutils.textLength(this.prompt);
	}

	render() {
		super.render();

		const term = this.term;

		this.clear({ height: this.height - 1 });

		let x = this.absoluteX;
		let y = this.absoluteY;
		const innerWidth = this.innerWidth;
		const innerHeight = this.innerHeight;

		let topBufferLineIndex = this.buffer_.length - (innerHeight - 1);
		if (topBufferLineIndex < 0) topBufferLineIndex = 0;

		for (let i = 0; i < innerHeight; i++) {
			let lineIndex = topBufferLineIndex + i;
			if (lineIndex >= this.buffer_.length) break;

			//let line = this.buffer_[lineIndex].substr(0, innerWidth);

			let line = this.buffer_[lineIndex];

			// this.logger().info('write: ', line);

			term.moveTo(x, y);
			term.write(line);
			y++;
		}

		const prompt = this.prompt;

		if (this.promptVisible) {
			term.moveTo(x, y);
			term.write(prompt + ' '.repeat(innerWidth - this.promptWidth_));

			this.promptCursorPos_ = { x: x + this.promptWidth_, y: y };
			term.moveTo(this.promptCursorPos_.x, this.promptCursorPos_.y);

			this.resetCursor();
		}

		if (this.hasFocus && this.promptVisible) {	

			if (this.inputActive_) {
				// Since the input is already active, we don't call term.inputField again or
				// that would make two of them active at the same time. The call to resetCursor()
				// above ensures that the cursor is where it should and that the current
				// command is correctly displayed when the widget is re-rendered.
				return;
			}

			const cursorWasShown = term.cursorShown;
			term.showCursor();

			let options = {
				cancelable: true,
				history: this.history,
				default: this.initialText_,
			};

			this.initialText_ = '';			
			this.inputActive_ = true;

			this.inputEventEmitter_ = term.inputField(options, (error, input) => {
				term.showCursor(cursorWasShown);

				this.inputEventEmitter_ = null;
				this.inputActive_ = false;

				if (error) {
					this.logger().error('ConsoleWidget:', error);
				} else {
					const wfr = this.waitForResult_;
					this.waitForResult_ = null;

					if (input === undefined) { // User cancel
						this.window.enableFocusChange();
						this.window.focusLast();

						if (wfr) {
							wfr.resolve(null);
						} else {
							this.eventEmitter.emit('cancel');
						}
					} else {
						this.bufferPush(prompt + input);

						if (wfr) {
							wfr.resolve(input);
						} else {
							if (input && input.trim() != '') this.history_.push(input);
							this.eventEmitter.emit('accept', { input: input });
						}
					}

					if (wfr) {
						this.prompt = wfr.previousPrompt;
					}
				}

				this.invalidate();
			});
		}
	}

}

module.exports = ConsoleWidget;
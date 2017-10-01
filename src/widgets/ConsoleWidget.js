const BaseWidget = require('./BaseWidget.js');

class ConsoleWidget extends BaseWidget {

	constructor() {
		super();
		this.buffer_ = ['abcd', 'efg'];
		this.activated_ = !false;
	}

	widgetType() {
		return 'console';
	}

	canHaveFocus() {
		return false;
	}

	activate(doActivate) {
		if (typeof doActivate === 'undefined') doActivate = true;

		if (doActivate === this.activated_) return;

		this.activated_ = doActivate;
		this.invalidate();
	}

	activated() {
		return this.activated_;
	}

	deactivate() {
		this.activate(false);
	}

	innerHeight() {
		return this.height();
	}

	async render() {
		const term = this.term();

		let x = this.x();
		let y = this.y();

		let topBufferLineIndex = this.buffer_.length - this.innerHeight();
		if (topBufferLineIndex < 0) topBufferLineIndex = 0;

		for (let i = 0; i < this.innerHeight() - 2; i++) {
			let lineIndex = topBufferLineIndex + i;
			if (lineIndex >= this.buffer_.length) break;

			term.moveTo(x, y);
			term(this.buffer_[lineIndex]);
			y++;
		}

		if (this.activated()) {
			term.moveTo(x, y);
			term.inputField({}, (error, input) => {
				this.buffer_ = this.buffer_.concat(input.split("\n"));
				this.invalidate();
				//term.moveTo(this.x(), this.y() + 1);
				//term(input);
			});
		}
	}

}

module.exports = ConsoleWidget;
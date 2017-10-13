const BaseWidget = require('./BaseWidget.js');
const markdownRenderer = require('./framework/markdownRenderer.js');

class TextWidget extends BaseWidget {

	constructor() {
		super();
		this.markdownRendering_ = true;
		this.text_ = '';
		this.scrollTop_ = 0;
		this.scrollableHeight_ = 0;
		this.updateMarkdown_ = false;
		this.renderedMarkdown_ = '';
	}

	get widgetType() {
		return 'text';
	}

	get canHaveFocus() {
		return true;
	}

	get text() {
		return this.text_;
	}

	set text(v) {
		if (this.text_ === v) return;
		this.text_ = v;
		this.updateMarkdown_ = true;
		this.invalidate();
	}

	get maxScrollTop_() {
		if (!this.scrollableHeight_) return 0;
		if (!this.innerHeight) return 0;
		return Math.max(this.scrollableHeight_ - this.innerHeight, 0);
	}

	boundScrollTop_() {
		let max = this.maxScrollTop_;
		if (this.scrollTop_ >= max) this.scrollTop_ = max;
		if (this.scrollTop_ < 0) this.scrollTop_ = 0;
	}

	get scrollTop() {
		return this.scrollTop_;
	}

	set scrollTop(v) {
		if (this.scrollTop_ === v) return;
		this.scrollTop_ = v;
		this.boundScrollTop_();
		this.invalidate();
	}

	scrollUp() {
		this.scrollTop = this.scrollTop - 1;
	}

	scrollDown() {
		this.scrollTop = this.scrollTop + 1;
	}

	onKey(name, matches, data) {
		if (name === 'UP') {
			this.scrollUp();
		} else if (name == 'DOWN') {
			this.scrollDown();
		}
	}

	onSizeChange() {
		this.updateMarkdown_ = true;
		this.invalidate();
	}

	render() {
		super.render();

		const term = this.term;

		this.innerClear();

		let x = this.absoluteInnerX;
		let y = this.absoluteInnerY;
		const innerWidth = this.innerWidth;

		let text = this.text;

		if (this.markdownRendering_) {
			if (this.updateMarkdown_) {
				// 'innerWidth - 1' because buggy Windows terminal doesn't handle
				// unicode properly, and if cutting at the exact width, it will overflow the container
				this.renderedMarkdown_ = markdownRenderer(text, { width: innerWidth - 1 });
				this.updateMarkdown_ = false;
			}

			text = this.renderedMarkdown_;
		}

		const lines = text.split("\n");

		this.scrollableHeight_ = lines.length;
		this.boundScrollTop_();

		for (let i = this.scrollTop; i < lines.length; i++) {
			const line = lines[i];

			term.moveTo(x, y);
			term.write(line.substr(0, innerWidth));

			if (y >= this.absoluteInnerY + this.innerHeight - 1) break;
			y++;
		}
	}

}

module.exports = TextWidget;
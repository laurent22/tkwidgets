const BaseWidget = require('./BaseWidget.js');

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

	widgetType() {
		return 'text';
	}

	canHaveFocus() {
		return true;
	}

	text() {
		return this.text_;
	}

	setText(v) {
		if (this.text_ === v) return;
		this.text_ = v;
		this.updateMarkdown_ = true;
		this.invalidate();
	}

	maxScrollTop_() {
		if (!this.scrollableHeight_) return 0;
		if (!this.innerHeight()) return 0;
		return Math.max(this.scrollableHeight_ - this.innerHeight(), 0);
	}

	boundScrollTop_() {
		let max = this.maxScrollTop_();
		if (this.scrollTop_ >= max) this.scrollTop_ = max;
		if (this.scrollTop_ < 0) this.scrollTop_ = 0;
	}

	scrollTop() {
		return this.scrollTop_;
	}

	setScrollTop(v) {
		if (this.scrollTop_ === v) return;
		this.scrollTop_ = v;
		this.boundScrollTop_();
		this.invalidate();
	}

	scrollUp() {
		this.setScrollTop(this.scrollTop() - 1);
	}

	scrollDown() {
		this.setScrollTop(this.scrollTop() + 1);
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

		const term = this.term();

		this.innerClear();

		let x = this.absoluteInnerX();
		let y = this.absoluteInnerY();

		let text = this.text();

		if (this.markdownRendering_) {
			if (this.updateMarkdown_) {
				const marked = require('marked');
				const TerminalRenderer = require('marked-terminal');

				marked.setOptions({
				 	renderer: new TerminalRenderer({
						reflowText: true,
						width: this.innerWidth(),
				 	})
				});

				text = marked(text);
				this.renderedMarkdown_ = text.replace(/[\s\t\r\n]+$/, ''); // marked, or marked-terminal, seems to add newline characters at the end of the text so remove them here
				this.updateMarkdown_ = false;
			}

			text = this.renderedMarkdown_;
		}

		const lines = text.split("\n");

		this.scrollableHeight_ = lines.length;
		this.boundScrollTop_();

		for (let i = this.scrollTop(); i < lines.length; i++) {
			const line = lines[i];

			term.moveTo(x, y);
			term(line);

			if (y >= this.absoluteInnerY() + this.innerHeight() - 1) break;
			y++;
		}
	}

}

module.exports = TextWidget;
const BaseWidget = require('./BaseWidget.js');

class TextWidget extends BaseWidget {

	constructor() {
		super();
		this.markdownRendering_ = true;
		this.text_ = '';
	}

	widgetType() {
		return 'text';
	}

	canHaveFocus() {
		return true;
	}

	innerHeight() {
		return this.height();
	}

	innerWidth() {
		return this.width();
	}

	text() {
		return this.text_;
	}

	setText(v) {
		if (this.text_ === v) return;
		this.text_ = v;
		this.invalidate();
	}

	async render() {
		const term = this.term();

		this.clear();

		let x = this.absoluteX();
		let y = this.absoluteY();

		let text = this.text();

		if (this.markdownRendering_) {
			const marked = require('marked');
			const TerminalRenderer = require('marked-terminal');

			marked.setOptions({
			 	renderer: new TerminalRenderer({
					reflowText: true,
					width: this.innerWidth(),
			 	})
			});

			text = marked(text);
		}

		const lines = text.split("\n");

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			term.moveTo(x, y);
			term(line);
			y++;
		}
	}

}

module.exports = TextWidget;
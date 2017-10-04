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

	text() {
		return this.text_;
	}

	setText(v) {
		if (this.text_ === v) return;
		this.text_ = v;
		this.invalidate();
	}

	render() {
		super.render();

		const term = this.term();

		this.innerClear();

		let x = this.absoluteInnerX();
		let y = this.absoluteInnerY();

		ilog('Inner height: ' + this.innerHeight());

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

			if (y >= this.absoluteInnerY() + this.innerHeight() - 1) break;

			y++;
		}
	}

}

module.exports = TextWidget;
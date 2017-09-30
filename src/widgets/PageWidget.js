const BaseWidget = require('./BaseWidget.js');

class PageWidget extends BaseWidget {

	constructor(term) {
		super(term);
		this.items_ = [];
	}

	addWidget(widget) {
		this.items_.push({
			widget: widget,
		});

		widget.setParent(this);
	}

	items() {
		return this.items_;
	}

	canHaveFocus() {
		return false;
	}

}

module.exports = PageWidget;
const BaseWidget = require('./BaseWidget.js');

class RootWidget extends BaseWidget {

	constructor(term) {
		super(term);
		this.children_ = [];
	}

	addWidget(widget) {
		this.children_.push(widget);
		widget.setParent(this);
	}

	items() {
		return this.items_;
	}

	canHaveFocus() {
		return false;
	}

}

module.exports = RootWidget;
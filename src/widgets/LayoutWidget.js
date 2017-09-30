const BaseWidget = require('./BaseWidget.js');

class LayoutWidget extends BaseWidget {

	constructor(term) {
		super(term);
		this.items_ = [];
	}

	addWidget(widget, constraints) {
		this.items_.push({
			widget: widget,
			constraints: constraints,
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

module.exports = LayoutWidget;
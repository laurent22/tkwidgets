const BaseWidget = require('./BaseWidget.js');

class LayoutWidget extends BaseWidget {

	constructor(term) {
		super(term);
		this.constraints_ = {};
	}

	addChild(widget, constraints) {
		this.constraints_[widget] = constraints;
		return super.addChild(widget);
	}

	widgetConstraints(widget) {
		return this.constraints_[widget];
	}

	canHaveFocus() {
		return false;
	}

}

module.exports = LayoutWidget;
const BaseWidget = require('./BaseWidget.js');

class LayoutWidget extends BaseWidget {

	constructor() {
		super();
		this.constraints_ = [];
		this.setStretch(true, true);
	}

	addChild(widget, constraints) {
		this.constraints_.push({ widget: widget, constraints: constraints });
		return super.addChild(widget);
	}

	widgetConstraints(widget) {
		for (let i = 0; i < this.constraints_.length; i++) {
			if (this.constraints_[i].widget === widget) return this.constraints_[i].constraints;
		}
		return {};
	}

	canHaveFocus() {
		return false;
	}

}

module.exports = LayoutWidget;
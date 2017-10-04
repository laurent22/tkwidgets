const BaseWidget = require('./BaseWidget.js');

class RootWidget extends BaseWidget {

	constructor() {
		super();
		this.setStretch(true, true);
	}

	canHaveFocus() {
		return false;
	}

	widgetType() {
		return 'view';
	}

}

module.exports = RootWidget;
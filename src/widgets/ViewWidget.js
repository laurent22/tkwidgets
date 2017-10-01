const BaseWidget = require('./BaseWidget.js');

class ViewWidget extends BaseWidget {

	constructor(term) {
		super(term);
	}

	canHaveFocus() {
		return false;
	}

	widgetType() {
		return 'view';
	}

}

module.exports = ViewWidget;
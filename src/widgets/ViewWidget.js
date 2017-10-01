const BaseWidget = require('./BaseWidget.js');

class ViewWidget extends BaseWidget {

	canHaveFocus() {
		return false;
	}

	widgetType() {
		return 'view';
	}

}

module.exports = ViewWidget;
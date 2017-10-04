const LayoutWidget = require('./LayoutWidget.js');

class VLayoutWidget extends LayoutWidget {

	widgetType() {
		return 'vlayout';
	}

	render() {
		return this.hvRender(LayoutWidget.LAYOUT_VERTICAL);
	}

}

module.exports = VLayoutWidget;
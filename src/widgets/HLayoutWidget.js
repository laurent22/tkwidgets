const LayoutWidget = require('./LayoutWidget.js');

class HLayoutWidget extends LayoutWidget {

	widgetType() {
		return 'hlayout';
	}

	render() {
		return this.hvRender(LayoutWidget.LAYOUT_HORIZONTAL);
	}

}

module.exports = HLayoutWidget;
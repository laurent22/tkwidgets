const LayoutWidget = require('./LayoutWidget.js');

class HLayoutWidget extends LayoutWidget {

	widgetType() {
		return 'hlayout';
	}

	addChild(widget, constraints) {
		widget.hStretch  = false; // Once added to a layout, the size is managed by the layout
		return super.addChild(widget, constraints);
	}

	render() {
		return this.hvRender(LayoutWidget.LAYOUT_HORIZONTAL);
	}

}

module.exports = HLayoutWidget;
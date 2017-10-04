const LayoutWidget = require('./LayoutWidget.js');

class VLayoutWidget extends LayoutWidget {

	widgetType() {
		return 'vlayout';
	}

	addChild(widget, constraints) {
		widget.setVStretch(false); // Once added to a layout, the size is managed by the layout
		return super.addChild(widget, constraints);
	}

	render() {
		return this.hvRender(LayoutWidget.LAYOUT_VERTICAL);
	}

}

module.exports = VLayoutWidget;
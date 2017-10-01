const LayoutWidget = require('./LayoutWidget.js');

class HLayoutWidget extends LayoutWidget {

	widgetType() {
		return 'hlayout';
	}

	calculateSizes() {
		let items = this.items().slice();
		let totalStretch = 0;
		let widthForStretch = this.width();

		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.constraints.type == 'fixed') {
				item.width = item.constraints.width;
				widthForStretch -= item.width;
			} else { // stretch
				totalStretch += item.constraints.factor;
			}
		}

		let remainingWidth = widthForStretch;
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.constraints.type == 'fixed') {
				// Already done
			} else { // stretch
				let percent = item.constraints.factor / totalStretch;
				item.width = Math.min(Math.round(percent * widthForStretch), remainingWidth);
				remainingWidth -= item.width;
			}
		}

		return items;
	}

	render() {
		const items = this.calculateSizes();
		const term = this.term();
		let cursorX = this.x();
		let cursorY = this.y();
		const layoutWidth = this.width();

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			term.moveTo(cursorX, cursorY);

			item.widget.setLocation(cursorX, cursorY);
			item.widget.setWidth(item.width);
			
			cursorX += item.width;
		}
	}

}

module.exports = HLayoutWidget;
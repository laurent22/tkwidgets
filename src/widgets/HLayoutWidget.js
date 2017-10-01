const LayoutWidget = require('./LayoutWidget.js');

class HLayoutWidget extends LayoutWidget {

	widgetType() {
		return 'hlayout';
	}

	calculateSizes() {
		let children = this.children();
		let totalStretch = 0;
		let widthForStretch = this.width();
		let stretchChildren = [];

		let output = [];

		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const constraints = this.widgetConstraints(child);

			if (constraints.type == 'fixed') {
				output.push({
					widget: child,
					width: constraints.width,
				});
				widthForStretch -= constraints.width;
			} else { // stretch
				totalStretch += constraints.factor;
				stretchChildren.push(child);
			}
		}

		let remainingWidth = widthForStretch;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const constraints = this.widgetConstraints(child);

			if (constraints.type == 'fixed') {
				// Already done
			} else { // stretch
				let percent = constraints.factor / totalStretch;
				const w = Math.min(Math.round(percent * widthForStretch), remainingWidth);
				output.push({
					widget: child,
					width: w,
				});
				remainingWidth -= w;
			}
		}

		return output;
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
const BaseWidget = require('./BaseWidget.js');

class LayoutWidget extends BaseWidget {

	constructor() {
		super();
		this.constraints_ = [];
		this.setStretch(true, true);
	}

	calculateSizes(sizeForStretch) {
		let children = this.children;
		let totalStretch = 0;
		let stretchChildren = [];

		let output = [];

		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (!child.visible) continue;
			
			const constraints = this.widgetConstraints(child);

			if (constraints.type == 'fixed') {
				sizeForStretch -= constraints.factor;
			} else { // stretch
				totalStretch += constraints.factor;
				stretchChildren.push(child);
			}
		}

		let remainingSize = sizeForStretch;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const constraints = this.widgetConstraints(child);

			if (constraints.type == 'fixed') {
				output.push({
					widget: child,
					size: constraints.factor,
				});
			} else { // stretch
				let percent = constraints.factor / totalStretch;
				const size = Math.min(Math.round(percent * sizeForStretch), remainingSize);
				output.push({
					widget: child,
					size: size,
				});
				remainingSize -= size;
			}
		}

		return output;
	}

	addChild(widget, constraints) {
		if (!widget || !constraints) throw new Error('Widget and constraints are required');
		this.constraints_.push({ widget: widget, constraints: constraints });
		return super.addChild(widget);
	}

	widgetConstraints(widget) {
		for (let i = 0; i < this.constraints_.length; i++) {
			if (this.constraints_[i].widget === widget) return this.constraints_[i].constraints;
		}
		return {};
	}

	setWidgetConstraints(widget, constraints) {
		for (let i = 0; i < this.constraints_.length; i++) {
			if (this.constraints_[i].widget === widget) {
				this.constraints_[i].constraints = constraints;
			}
		}
		this.invalidate();
	}

	get canHaveFocus() {
		return false;
	}

	hvRender(direction) {
		super.render();

		const items = this.calculateSizes(direction == LayoutWidget.LAYOUT_HORIZONTAL ? this.innerWidth : this.innerHeight);
		const term = this.term;

		let x = 1;
		let y = 1;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			item.widget.x = x;
			item.widget.y = y;

			if (direction == LayoutWidget.LAYOUT_HORIZONTAL) {
				item.widget.width = item.size;
			} else {
				item.widget.height = item.size;
			}
			
			if (direction == LayoutWidget.LAYOUT_HORIZONTAL) {
				x += item.size;
			} else {
				y += item.size;
			}
		}
	}

}

LayoutWidget.LAYOUT_HORIZONTAL = 1;
LayoutWidget.LAYOUT_VERTICAL = 2;

module.exports = LayoutWidget;
const BaseWidget = require('./BaseWidget.js');

class WindowWidget extends BaseWidget {

	constructor() {
		super();
		this.activate();
		this.focusedWidget_ = null;
	}

	onTermReady() {
		super.onTermReady();

		this.term().on('key', (name, matches, data) => {
			if (!this.isActiveWindow()) return;

			if (name === 'TAB') {
				this.focusWidget(this.nextFocusWidget());
			}
		});
	}

	isWindow() {
		return true;
	}

	canHaveFocus() {
		return false;
	}

	widgetType() {
		return 'window';
	}

	isActiveWindow() {
		return WindowWidget.activeWindow_ === this;
	}

	activate() {
		if (this.isActiveWindow()) return;

		if (WindowWidget.activeWindow_) {
			WindowWidget.activeWindow_.hide();
		}

		this.show();
		WindowWidget.activeWindow_ = this;
	}

	searchFocusableWidgets(parent) {
		let output = [];
		if (parent.canHaveFocus()) output.push(parent);
		for (let i = 0; i < parent.childCount(); i++) {
			const child = parent.childAt(i);
			let r = this.searchFocusableWidgets(child);
			output = output.concat(r);			
		}
		return output;
	}

	focusableWidgets() {
		return this.searchFocusableWidgets(this);
	}

	focusWidget(widget) {
		if (this.focusedWidget_ === widget) return;

		ilog('FOCUS: ' + (widget ? widget.name() : 'null'));

		let previousWidget = this.focusedWidget_;
		this.focusedWidget_ = widget;

		if (previousWidget) {
			previousWidget.onBlur();
		}

		if (this.focusedWidget_) {
			this.focusedWidget_.onFocus();
		}
	}

	blurWidget(widget) {
		if (!widget || this.focusedWidget_ !== widget) return;

		this.focusedWidget_.onBlur();

		this.focusedWidget_ = null;

		this.focusWidget(this.nextFocusWidget());
	}

	nextFocusWidget() {
		let widgets = this.focusableWidgets();

		if (!widgets.length) return null;
		if (widgets.length === 1) return widgets[0];
		if (!this.focusedWidget_) return widgets[0];

		for (let i = 0; i < widgets.length; i++) {
			const widget = widgets[i];
			if (widget === this.focusedWidget_) {
				let nextIndex = i + 1;
				if (nextIndex >= widgets.length) nextIndex = 0;
				return widgets[nextIndex];
			}
		}

		return null;
	}

	widgetHasFocus(widget) {
		return widget && widget === this.focusedWidget_;
	}

	widgetHasKeyboard(widget) {
		return widget && this.widgetHasFocus(widget) && widget.isActiveWindow() && widget.visible();
	}

	focusedWidget() {
		return this.focusedWidget_;
	}

}

WindowWidget.activeWindow_ = null;

module.exports = WindowWidget;
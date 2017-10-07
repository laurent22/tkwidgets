const BaseWidget = require('./BaseWidget.js');

class WindowWidget extends BaseWidget {

	constructor() {
		super();
		this.activate();
		this.focusedWidget_ = null;
		this.focusChangeEnabled_ = true;
		this.lastFocusedWidget_ = null;
		this.setStretch(true, true);
	}

	onTermReady() {
		super.onTermReady();

		this.term().on('key', (name, matches, data) => {
			if (!this.isActiveWindow()) return;

			if (this.focusChangeEnabled_ && name === 'TAB') {
				this.tabNext();
			}

			if (this.focusChangeEnabled_ && name === 'SHIFT_TAB') {
				this.tabPrevious();
			}
		});
	}

	enableFocusChange(doEnable) {
		if (typeof doEnable === 'undefined') doEnable = true;
		this.focusChangeEnabled_ = doEnable;
	}

	disableFocusChange() {
		this.enableFocusChange(false);
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

	searchTabableWidgets_(parent) {
		let output = [];
		if (parent.canHaveFocus() && parent.tabIndex() >= 0) output.push(parent);
		for (let i = 0; i < parent.childCount(); i++) {
			const child = parent.childAt(i);
			let r = this.searchTabableWidgets_(child);
			output = output.concat(r);			
		}
		return output;
	}

	tabableWidgets_() {
		return this.searchTabableWidgets_(this);
	}

	focusWidget(widget) {
		if (!this.focusChangeEnabled_) return;
		if (this.focusedWidget_ === widget) return;

		this.lastFocusedWidget_ = this.focusedWidget_;
		this.focusedWidget_ = widget;

		if (this.lastFocusedWidget_) {
			this.lastFocusedWidget_.onBlur();
		}

		if (this.focusedWidget_) {
			this.focusedWidget_.onFocus();
		}
	}

	blurWidget(widget) {
		if (!widget || this.focusedWidget_ !== widget) return;

		this.focusedWidget_.onBlur();

		this.lastFocusedWidget_ = this.focusedWidget_;
		this.focusedWidget_ = null;

		this.tabNext();
	}

	tabableWidgetByOffset_(offset) {
		let widgets = this.tabableWidgets_();

		if (!widgets.length) return null;
		if (widgets.length === 1) return widgets[0];
		if (!this.focusedWidget_) return widgets[0];

		for (let i = 0; i < widgets.length; i++) {
			const widget = widgets[i];
			if (widget === this.focusedWidget_) {
				let nextIndex = i + offset;
				if (nextIndex >= widgets.length) nextIndex = 0;
				if (nextIndex < 0) nextIndex = widgets.length - 1;
				return widgets[nextIndex];
			}
		}

		return null;
	}

	nextTabableWidget_() {
		return this.tabableWidgetByOffset_(+1);
	}

	previousTabableWidget_() {
		return this.tabableWidgetByOffset_(-1);
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

	tabNext() {
		this.focusWidget(this.nextTabableWidget_());
	}

	tabPrevious() {
		this.focusWidget(this.previousTabableWidget_());
	}

	focusLast() {
		this.focusWidget(this.lastFocusedWidget_);
	}

}

WindowWidget.activeWindow_ = null;

module.exports = WindowWidget;
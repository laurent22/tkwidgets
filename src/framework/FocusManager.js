class FocusManager {

	constructor(term) {
		this.term_ = term;
		this.focusedWidget_ = null;
		this.widgets_ = [];

		this.term_.on('key', (name, matches, data) => {
			if (name === 'TAB') {
				this.focus(this.nextTabWidget());
			}
		});
	}

	nextTabWidget() {
		const tabIndex = this.nextTabWidgetIndex();
		if (tabIndex < 0) return null;
		return this.widgets_[tabIndex];
	}

	nextTabWidgetIndex() {
		let tabIndex = this.focusedWidgetIndex();

		let doneCount = 0;
		while (true) {
			tabIndex++;
			if (tabIndex >= this.widgets_.length) tabIndex = 0;

			const w = this.widgets_[tabIndex];
			doneCount++;

			if (w.visible()) return tabIndex
			if (doneCount >= this.widgets_.length) return -1;
		}

		return -1;
	}

	focusedWidgetIndex() {
		for (let i = 0; i < this.widgets_.length; i++) {
			if (this.widgets_[i] === this.focusedWidget_) return i;
		}
		return -1;
	}

	register(widget) {
		this.widgets_.push(widget);

		if (!this.focusedWidget_) {
			widget.focus();
		}
	}

	hasFocus(widget) {
		return this.focusedWidget_ === widget && widget.visible();
	}

	hasKeyboard(widget) {
		return this.hasFocus(widget) && widget.visible();
	}

	focus(widget) {
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

	blur(widget) {
		if (!widget || this.focusedWidget_ !== widget) return;

		this.focusedWidget_.onBlur();

		this.focusedWidget_ = null;

		this.focus(this.nextTabWidget());
	}

	updateFocusedWidget() {
		if (this.focusedWidget_ && this.focusedWidget_.visible()) return;
		this.focus(this.nextTabWidget());
	}

}

module.exports = FocusManager;
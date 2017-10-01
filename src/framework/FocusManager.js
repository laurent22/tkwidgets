class FocusManager {

	constructor(term) {
		this.term_ = term;
		this.focusedWidget_ = null;
		this.widgets_ = [];
		this.mode_ = 'widget';

		this.term_.on('key', (name, matches, data) => {
			if (name === 'TAB') {
				this.focus(this.nextTabWidget());
			}

			// if (name === 'ESCAPE') {
			// 	this.setMode('select');
			// }

			// if (this.mode() == 'select') {
			// 	if (name === 'TAB') {
			// 		this.focus(this.nextTabWidget());
			// 	}

			// 	if (name === 'ENTER') {
			// 		this.setMode('widget');
			// 	}
			// }
		});
	}

	mode() {
		return this.mode_;
	}

	setMode(v) {
		if (v === this.mode_) return;
		this.mode_ = v;

		if (this.focusedWidget_) {
			if (this.mode_ == 'select') {
				this.focusedWidget_.onLostKeyboard();
			} else {
				this.focusedWidget_.onGotKeyboard();
			}
		}
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
			if (!w.visible()) continue;

			if (doneCount >= this.widgets_.length) return -1;

			return tabIndex;
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
		return this.hasFocus(widget) && this.mode() == 'widget' && widget.visible();
	}

	focus(widget) {
		if (this.focusedWidget_ === widget) return;

		let previousWidget = this.focusedWidget_;
		this.focusedWidget_ = widget;

		if (previousWidget) {
			previousWidget.onBlur();
		}

		if (this.focusedWidget_) {
			this.focusedWidget_.onFocus();
		}
	}

}

module.exports = FocusManager;
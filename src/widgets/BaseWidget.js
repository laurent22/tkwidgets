const FocusManager = require('../framework/FocusManager.js');

class BaseWidget {

	constructor(term) {
		if (!BaseWidget.id_) BaseWidget.id_ = 1;
		if (!BaseWidget.focusManager_) BaseWidget.focusManager_ = new FocusManager(term);

		this.id_ = BaseWidget.id_++;
		this.term_ = term;
		this.location_ = { x: 0, y: 0 };
		this.size_ = { width: null, height: null };
		this.invalidated_ = true;
		this.renderTimeoutId_ = null;

		this.term_.on('key', (name, matches, data) => {
			if (!this.hasKeyboard()) return;
			this.onKey(name, matches, data);
		});

		this.tabOrder_ = null;

		BaseWidget.focusManager_.register(this);
	}

	id() {
		return this.id_;
	}

	focus() {
		BaseWidget.focusManager_.focus(this);
	}

	hasFocus() {
		return BaseWidget.focusManager_.hasFocus(this);
	}

	hasKeyboard() {
		return BaseWidget.focusManager_.hasKeyboard(this);
	}

	term() {
		return this.term_;
	}

	x() {
		return this.location_.x;
	}

	y() {
		return this.location_.y;
	}

	width() {
		return this.size_.width;
	}

	height() {
		return this.size_.height;
	}

	setHeight(v) {
		if (this.size_.height === v) return;
		this.size_.height = v;
		this.invalidate();
	}

	setWidth(v) {
		if (this.size_.width === v) return;
		this.size_.width = v;
		this.invalidate();
	}

	onKey(name, matches, data) {}

	onFocus() {
		this.invalidate();
	}

	onBlur() {
		this.invalidate();
	}

	onGotKeyboard() {
		this.invalidate();
	}

	onLostKeyboard() {
		this.invalidate();
	}

	setLocation(x, y) {
		this.location_.x = x;
		this.location_.y = y;
	}

	invalidate() {
		this.invalidated_ = true;

		this.renderIfNeeded();

		// if (!this.renderTimeoutId_) {
		// 	this.renderTimeoutId_ = setTimeout(() => {
		// 		this.renderTimeoutId_ = null;
		// 		this.renderIfNeeded();
		// 	}, 30 / 10);
		// }
	}

	invalidated() {
		return this.invalidated_;
	}

	renderIfNeeded() {
		if (!this.invalidated()) return;
		this.render();		
	}

	render() {
		if (this.renderTimeoutId_) {
			clearTimeout(this.renderTimeoutId_);
			this.renderTimeoutId_ = null;
		}

		this.invalidated_ = false;
	}

};

module.exports = BaseWidget;
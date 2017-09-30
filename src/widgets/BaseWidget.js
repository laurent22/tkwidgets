const FocusManager = require('../framework/FocusManager.js');

class BaseWidget {

	constructor(term) {
		if (!BaseWidget.id_) BaseWidget.id_ = 1;
		if (!BaseWidget.focusManager_) BaseWidget.focusManager_ = new FocusManager(term);

		this.id_ = BaseWidget.id_++;
		this.term_ = term;
		this.location_ = { x: 1, y: 1 };
		this.sizeHint_ = { width: 20, height: 10 };
		this.size_ = { width: null, height: null };
		this.style_ = {};
		this.invalidated_ = true;
		this.renderTimeoutId_ = null;
		this.parent_ = null;
		this.shown_ = true;

		this.term_.on('key', (name, matches, data) => {
			if (!this.hasKeyboard()) return;
			this.onKey(name, matches, data);
		});

		if (this.canHaveFocus()) BaseWidget.focusManager_.register(this);
	}

	id() {
		return this.id_;
	}

	parent() {
		return this.parent_;
	}

	setParent(v) {
		if (v === this.parent_) return;
		this.parent_ = v;
		this.invalidate();
	}

	show(doShow) {
		if (typeof doShow === 'undefined') doShow = true;
		if (this.shown_ === doShow) return;
		this.shown_ = doShow;
		this.invalidate();
	}

	hide() {
		this.show(false);
	}

	shown() {
		return this.shown_;
	}

	visible() {
		return this.parent() ? this.parent().shown() : this.shown();
	}

	style() {
		return this.style_;
	}

	setStyle(s) {
		this.style_ = s;
	}

	canHaveFocus() {
		return true;
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
		return this.size_.width === null ? this.sizeHint_.width : this.size_.width;
	}

	height() {
		return this.size_.height === null ? this.sizeHint_.height : this.size_.height;
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
	}

	invalidated() {
		return this.invalidated_;
	}

	renderIfNeeded() {
		if (!this.invalidated()) return;
		if (!this.shown()) {
			this.clear();
		} else {
			this.render();
		}
		this.invalidated_ = false;
	}

	clear() {
		for (let y = 0; y < this.height(); y++) {
			this.term().moveTo(this.x(), this.y() + y);
			this.term().delete(this.width());
		}
	}

	render() {}

};

module.exports = BaseWidget;
const FocusManager = require('../framework/FocusManager.js');

class BaseWidget {

	constructor() {
		if (!BaseWidget.id_) BaseWidget.id_ = 1;

		this.id_ = BaseWidget.id_++;
		this.location_ = { x: 1, y: 1 };
		this.sizeHint_ = { width: 20, height: 10 };
		this.size_ = { width: null, height: null };
		this.style_ = {};
		this.renderTimeoutId_ = null;
		this.parent_ = null;
		this.shown_ = true;
		this.children_ = [];
		this.renderer_ = null;
		this.lifeCycleState_ = 'created';
		this.name_ = '';

		this.invalidate();
	}

	onTermReady() {
		ilog('onTermReady: ' + this.name() + ' ' + this.canHaveFocus());

		//if (!BaseWidget.focusManager_) BaseWidget.focusManager_ = new FocusManager(this.term());

		if (this.canHaveFocus()) {
			this.term().on('key', (name, matches, data) => {
				ilog('HAS : ' + this.hasKeyboard() + ', ' + this.hasFocus());
				if (!this.hasKeyboard()) return;
				this.onKey(name, matches, data);
			});

			//BaseWidget.focusManager_.register(this);
		}

		for (let i = 0; i < this.children_.length; i++) {
			if (this.lifeCycleState() == 'created') this.children_[i].onTermReady();
		}

		if (this.canHaveFocus() && !this.window().focusedWidget()) {
			this.focus();
		}

		this.lifeCycleState_ = 'ready';
	}

	isActiveWindow() {
		let win = this.window();
		return win ? win.isActiveWindow() : false;
	}

	window() {
		if (this.isWindow()) return this;
		if (!this.parent()) return null;
		return this.parent().window();
	}

	isWindow() {
		return false;
	}

	lifeCycleState() {
		return this.lifeCycleState_;
	}

	renderer() {
		if (!this.parent()) return this.renderer_;
		return this.parent().renderer();
	}

	setRenderer(v) {
		this.renderer_ = v;
	}

	addChild(widget) {
		this.children_.push(widget);
		widget.setParent(this);
		if (widget.lifeCycleState() == 'created' && this.term()) widget.onTermReady();
	}

	children() {
		return this.children_;
	}

	childAt(i) {
		return this.children_[i];
	}

	childCount() {
		return this.children_.length;
	}

	id() {
		return this.id_;
	}

	setName(name) {
		this.name_ = name;
	}

	name() {
		return this.name_;
	}

	widgetType() {
		return 'undefined';
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
		//if (BaseWidget.focusManager_) BaseWidget.focusManager_.updateFocusedWidget();
		this.invalidate();
	}

	hide() {
		this.show(false);
	}

	shown() {
		return this.shown_;
	}

	visible() {
		if (!this.shown()) return false;
		if (this.parent() && !this.parent().shown()) return false;
		return true;
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
		const w = this.window();
		if (!w) return;
		w.focusWidget(this);
		//if (BaseWidget.focusManager_) BaseWidget.focusManager_.focus(this);
	}

	blur() {
		const w = this.window();
		if (!w) return;
		w.blurWidget(this);
		//if (BaseWidget.focusManager_) BaseWidget.focusManager_.blur(this);
	}

	hasFocus() {
		const w = this.window();
		return w && w.widgetHasFocus(this);
		//return BaseWidget.focusManager_.hasFocus(this);
	}

	hasKeyboard() {
		const w = this.window();
		return w && w.widgetHasKeyboard(this);
		//return BaseWidget.focusManager_.hasKeyboard(this);
	}

	term() {
		if (!this.renderer()) return null;
		return this.renderer().term();
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

		for (let i = 0; i < this.childCount(); i++) {
			this.childAt(i).invalidate();
		}

		if (this.renderer()) {
			this.renderer().scheduleRender();
		}
	}

	invalidated() {
		return this.invalidated_;
	}

	async clear() {
		this.term().styleReset();
		for (let y = 0; y < this.height(); y++) {
			this.term().moveTo(this.x(), this.y() + y, ' '.repeat(this.width()));
			// this.term().moveTo(this.x(), this.y() + y);
			// this.term().delete(this.width());
			// this.term().insert(this.width());
		}
	}

	async render() {}

};

module.exports = BaseWidget;
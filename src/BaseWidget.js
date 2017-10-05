const termutils = require('./framework/termutils.js');
const EventEmitter = require('events');

class BaseWidget {

	constructor() {
		if (!BaseWidget.id_) BaseWidget.id_ = 1;

		this.id_ = BaseWidget.id_++;
		this.location_ = { x: 1, y: 1 };
		this.sizeHint_ = { width: 20, height: 10 };
		this.size_ = { width: null, height: null };
		this.previousRenderSize_ = null;
		this.style_ = {};
		this.renderTimeoutId_ = null;
		this.parent_ = null;
		this.shown_ = true;
		this.children_ = [];
		this.renderer_ = null;
		this.lifeCycleState_ = 'created';
		this.name_ = '';
		this.hStretch_ = false;
		this.vStretch_ = false;
		this.eventEmitter_ = null;

		this.invalidate();
	}

	on(eventName, callback) {
		return this.eventEmitter().on(eventName, callback);
	}

	eventEmitter() {
		if (!this.eventEmitter_) this.eventEmitter_ = new EventEmitter();
		return this.eventEmitter_;
	}

	onTermReady() {
		if (this.canHaveFocus()) {
			this.term().on('key', (name, matches, data) => {
				if (!this.hasKeyboard()) return;
				this.onKey(name, matches, data);
			});
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
		if (widget.parent()) {
			widget.parent().removeChild(widget);
		}

		this.children_.push(widget);
		widget.setParent(this);
		if (widget.lifeCycleState() == 'created' && this.term()) widget.onTermReady();
		this.invalidate();
	}

	removeChild(widget) {
		let temp = [];
		for (let i = 0; i < this.children_.length; i++) {
			if (this.children_[i] === widget) continue;
			temp.push(widget);
		}
		this.children_ = temp;
		widget.setParent(null);
		this.invalidate();
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

	childByName(name, recurse = true) {
		for (let i = 0; i < this.childCount(); i++) {
			let child = this.childAt(i);
			if (child.name() == name) return child;
			if (recurse) {
				let c = child.childByName(name);
				if (c) return c;
			}
		}
		return null;
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

	setStretch(h, v) {
		this.setHStretch(h);
		this.setVStretch(v);
	}

	setHStretch(v) {
		if (v === this.hStretch_) return;
		this.hStretch_ = v;
		this.invalidate();
	}

	setVStretch(v) {
		if (v === this.vStretch_) return;
		this.vStretch_ = v;
		this.invalidate();
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
	}

	blur() {
		const w = this.window();
		if (!w) return;
		w.blurWidget(this);
	}

	hasFocus() {
		const w = this.window();
		return w && w.widgetHasFocus(this);
	}

	hasKeyboard() {
		const w = this.window();
		return w && w.widgetHasKeyboard(this);
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

	absoluteX() {
		const p = this.parent();
		return this.x() + (p ? p.absoluteX() - 1 : 0);
	}

	absoluteY() {
		const p = this.parent();
		return this.y() + (p ? p.absoluteY() - 1 : 0);
	}

	onSizeChanged() {}

	width() {
		if (this.hStretch_) {
			if (this.parent()) return this.parent().width();
			if (this.term()) return this.term().width;
		}

		return this.size_.width === null ? this.sizeHint_.width : this.size_.width;
	}

	height() {
		if (this.vStretch_) {
			if (this.parent()) return this.parent().height();
			if (this.term()) return this.term().height;
		}

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

	innerWidth() {
		const s = this.style();
		let output = this.width();
		if (s.borderLeftWidth) output--;
		if (s.borderRightWidth) output--;
		return output;
	}	

	innerHeight() {
		const s = this.style();
		let output = this.height();
		if (s.borderTopWidth) output--;
		if (s.borderBottomWidth) output--;
		return output;
	}

	innerX() {
		let output = this.x();
		if (this.style().borderLeftWidth) output++;
		return output;
	}

	innerY() {
		let output = this.y();
		if (this.style().borderTopWidth) output++;
		return output;
	}

	absoluteInnerX() {
		let output = this.absoluteX();
		if (this.style().borderLeftWidth) output++;
		return output;
	}

	absoluteInnerY() {
		let output = this.absoluteY();
		if (this.style().borderTopWidth) output++;
		return output;
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

	clear() {
		this.term().styleReset();
		for (let y = 0; y < this.height(); y++) {
			this.term().moveTo(this.x(), this.y() + y, ' '.repeat(this.width()));
		}
	}

	innerClear() {
		this.term().styleReset();
		for (let y = 0; y < this.innerHeight(); y++) {
			this.term().moveTo(this.innerX(), this.innerY() + y, ' '.repeat(this.innerWidth()));
		}
	}

	drawBorder() {
		const term = this.term();

		let x = this.absoluteX();
		let y = this.absoluteY();
		let width = this.width();
		let height = this.height();

		const hLineChar = this.hasFocus() ? '=' : '-';
		const vLineChar = this.hasFocus() ? '│' : '|';

		term.styleReset();

		if (this.style().borderLeftWidth) {
			termutils.drawVLine(term, x, y, height, vLineChar);
		}

		if (this.style().borderRightWidth) {
			termutils.drawVLine(term, x + width - 1, y, height, vLineChar);
		}

		if (this.style().borderTopWidth) {
			termutils.drawHLine(term, x, y, width, hLineChar);
		}

		if (this.style().borderBottomWidth) {
			termutils.drawHLine(term, x, y + height - 1, width, hLineChar);
		}
	}

	render() {
		if (this.previousRenderSize_ === null) this.previousRenderSize_ = { innerWidth: this.innerWidth(), innerHeight: this.innerHeight() };

		if (this.previousRenderSize_.innerWidth != this.innerWidth || this.previousRenderSize_.innerHeight != this.innerHeight()) {
			this.onSizeChanged();
		}

		this.drawBorder();

		this.previousRenderSize_ = { innerWidth: this.innerWidth(), innerHeight: this.innerHeight() };
	}

};

module.exports = BaseWidget;
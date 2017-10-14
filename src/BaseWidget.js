const EventEmitter = require('events');
const chalk = require('chalk');

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
		this.tabIndex_ = 0;

		this.invalidate();
	}

	logger() {
		if (!BaseWidget.logger_) return {
			info: (...o) => {},
			error: (...o) => {},
			warn: (...o) => {},
			debug: (...o) => {},
		};

		return BaseWidget.logger_;
	}

	on(eventName, callback) {
		return this.eventEmitter.on(eventName, callback);
	}

	set tabIndex(v) {
		if (this.tabIndex_ === v) return;
		this.tabIndex_ = v;
		this.invalidate();
	}

	get tabIndex() {
		return this.tabIndex_;
	}

	get eventEmitter() {
		if (!this.eventEmitter_) this.eventEmitter_ = new EventEmitter();
		return this.eventEmitter_;
	}

	onTermReady() {
		if (this.canHaveFocus) {
			this.term.on('key', (name, matches, data) => {
				if (!this.hasKeyboard) return;
				this.onKey(name, matches, data);
			});
		}

		for (let i = 0; i < this.children_.length; i++) {
			if (this.lifeCycleState == 'created') this.children_[i].onTermReady();
		}

		if (this.canHaveFocus && !this.window.focusedWidget) {
			this.focus();
		}

		this.lifeCycleState_ = 'ready';
	}

	onResize() {
		this.invalidate();
	}

	get isActiveWindow() {
		let win = this.window;
		return win ? win.isActiveWindow : false;
	}

	get isRoot() {
		return false;
	}

	get root() {
		if (this.isRoot) return this;
		if (!this.parent) return null;
		return this.parent.root;
	}

	get window() {
		if (this.isWindow) return this;
		if (!this.parent) return null;
		return this.parent.window;
	}

	get isWindow() {
		return false;
	}

	get lifeCycleState() {
		return this.lifeCycleState_;
	}

	get renderer() {
		if (!this.parent) return this.renderer_;
		return this.parent.renderer;
	}

	set renderer(v) {
		this.renderer_ = v;
	}

	addChild(widget) {
		if (widget.parent) {
			widget.parent.removeChild(widget);
		}

		this.children_.push(widget);
		widget.parent = this;
		if (widget.lifeCycleState == 'created' && this.term) widget.onTermReady();
		this.invalidate();
	}

	removeChild(widget) {
		let temp = [];
		for (let i = 0; i < this.children_.length; i++) {
			if (this.children_[i] === widget) continue;
			temp.push(widget);
		}
		this.children_ = temp;
		widget.parent = null;
		this.invalidate();
	}

	get children() {
		return this.children_;
	}

	childAt(i) {
		return this.children_[i];
	}

	get childCount() {
		return this.children_.length;
	}

	childByName(name, recurse = true) {
		for (let i = 0; i < this.childCount; i++) {
			let child = this.childAt(i);
			if (child.name == name) return child;
			if (recurse) {
				let c = child.childByName(name);
				if (c) return c;
			}
		}
		return null;
	}

	get id() {
		return this.id_;
	}

	get name() {
		return this.name_;
	}

	set name(name) {
		this.name_ = name;
	}

	setStretch(h, v) {
		this.hStretch = h;
		this.vStretch = v;
	}

	set hStretch(v) {
		if (v === this.hStretch_) return;
		this.hStretch_ = v;
		this.invalidate();
	}

	set vStretch(v) {
		if (v === this.vStretch_) return;
		this.vStretch_ = v;
		this.invalidate();
	}

	get widgetType() {
		return 'undefined';
	}

	get parent() {
		return this.parent_;
	}

	set parent(v) {
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

	get shown() {
		return this.shown_;
	}

	get visible() {
		if (!this.shown) return false;
		if (this.parent && !this.parent.shown) return false;
		return true;
	}

	get style() {
		return this.style_;
	}

	set style(s) {
		this.style_ = s;
	}

	get canHaveFocus() {
		return true;
	}

	focus() {
		const w = this.window;
		if (!w) return;
		w.focusWidget(this);
	}

	blur() {
		const w = this.window;
		if (!w) return;
		w.blurWidget(this);
	}

	get hasFocus() {
		const w = this.window;
		return w && w.widgetHasFocus(this);
	}

	get hasKeyboard() {
		const w = this.window;
		return w && w.widgetHasKeyboard(this);
	}

	get term() {
		if (!this.renderer) return null;
		return this.renderer.term;
	}

	get x() {
		return this.location_.x;
	}

	get y() {
		return this.location_.y;
	}

	set x(v) {
		if (this.location_.x === v) return;
		this.location_.x = v;
		this.invalidate();
	}

	set y(v) {
		if (this.location_.y === v) return;
		this.location_.y = v;
		this.invalidate();
	}

	get absoluteX() {
		const p = this.parent;
		return this.x + (p ? p.absoluteX - 1 : 0);
	}

	get absoluteY() {
		const p = this.parent;
		return this.y + (p ? p.absoluteY - 1 : 0);
	}

	onSizeChanged() {}

	get width() {
		if (this.hStretch_) {
			if (this.parent) return this.parent.width;
			if (this.term) return this.term.width;
		}

		return this.size_.width === null ? this.sizeHint_.width : this.size_.width;
	}

	get height() {
		if (this.vStretch_) {
			if (this.parent) return this.parent.height;
			if (this.term) return this.term.height;
		}

		return this.size_.height === null ? this.sizeHint_.height : this.size_.height;
	}

	set height(v) {
		if (this.size_.height === v) return;
		this.size_.height = v;
		this.onResize();
		this.invalidate();
	}

	set width(v) {
		if (this.size_.width === v) return;
		this.size_.width = v;
		this.onResize();
		this.invalidate();
	}

	get innerWidth() {
		const s = this.style;
		let output = this.width;
		if (s.borderLeftWidth) output--;
		if (s.borderRightWidth) output--;
		return output;
	}	

	get innerHeight() {
		const s = this.style;
		let output = this.height;
		if (s.borderTopWidth) output--;
		if (s.borderBottomWidth) output--;
		return output;
	}

	get innerX() {
		let output = this.x;
		if (this.style.borderLeftWidth) output++;
		return output;
	}

	get innerY() {
		let output = this.y;
		if (this.style.borderTopWidth) output++;
		return output;
	}

	get absoluteInnerX() {
		let output = this.absoluteX;
		if (this.style.borderLeftWidth) output++;
		return output;
	}

	get absoluteInnerY() {
		let output = this.absoluteY;
		if (this.style.borderTopWidth) output++;
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

	invalidate() {
		this.invalidated_ = true;

		for (let i = 0; i < this.childCount; i++) {
			this.childAt(i).invalidate();
		}

		if (this.renderer) {
			this.renderer.scheduleRender();
		}
	}

	get invalidated() {
		return this.invalidated_;
	}

	clear(size = null) {
		let startX = this.x;
		let startY = this.y;
		let width = this.width;
		let height = this.height;

		if (size) {
			if (size.x) startX = size.x;
			if (size.y) startY = size.y;
			if (size.width) width = size.width;
			if (size.height) height = size.height;
		}

		chalk.reset();
		for (let y = 0; y < height; y++) {
			this.term.moveTo(startX, startY + y, ' '.repeat(width));
		}
	}

	innerClear() {
		chalk.reset();
		for (let y = 0; y < this.innerHeight; y++) {
			this.term.moveTo(this.innerX, this.innerY + y, ' '.repeat(this.innerWidth));
		}
	}

	drawBorder() {
		const term = this.term;

		let x = this.absoluteX;
		let y = this.absoluteY;
		let width = this.width;
		let height = this.height;

		const hLineChar = this.hasFocus ? '=' : '-';
		const vLineChar = this.hasFocus ? '│' : '|';

		chalk.reset();

		if (this.style.borderLeftWidth) {
			term.drawVLine(x, y, height, vLineChar);
		}

		if (this.style.borderRightWidth) {
			term.drawVLine(x + width - 1, y, height, vLineChar);
		}

		if (this.style.borderTopWidth) {
			term.drawHLine(x, y, width, hLineChar);
		}

		if (this.style.borderBottomWidth) {
			term.drawHLine(x, y + height - 1, width, hLineChar);
		}
	}

	render() {
		if (this.previousRenderSize_ === null) this.previousRenderSize_ = { innerWidth: this.innerWidth, innerHeight: this.innerHeight };

		if (this.previousRenderSize_.innerWidth != this.innerWidth || this.previousRenderSize_.innerHeight != this.innerHeight) {
			this.onSizeChanged();
		}

		this.drawBorder();

		this.previousRenderSize_ = { innerWidth: this.innerWidth, innerHeight: this.innerHeight };
	}

};

BaseWidget.setLogger = function(v) {
	BaseWidget.logger_ = v;
}

module.exports = BaseWidget;
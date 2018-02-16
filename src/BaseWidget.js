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
		this.asyncActions_ = {};

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

	// Utility method to define an async action that will be executed
	// a few milliseconds later. This is useful when an event is happening
	// multiple times (such as loading an item while a list is scrolling)
	// but you want a related action (such as loading an item) to happen
	// only once things are stable.
	// 
	// For example:
	// `this.doAsync('loadItem', callback)` could be called whenever
	// the list is being scrolled but the actual callback will be called
	// only once the scrolling has finished. This is because each new call
	// to doAsync() overwrites any already scheduled action.
	doAsync(name, callback) {
		if (this.asyncActions_[name]) {
			clearTimeout(this.asyncActions_[name]);
			delete this.asyncActions_[name];
		}

		this.asyncActions_[name] = setTimeout(() => {
			delete this.asyncActions_[name];
			callback();
		}, 100);	
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

	handleKey(name, matches = null, data = null) {
		for (let i = 0; i < this.childCount; i++) {
			const child = this.childAt(i);
			child.handleKey(name);
		}

		this.logger().debug('Handle: ' + this.name + ': ' + name, this.hasKeyboard);

		if (!this.hasKeyboard) return;
		if (this.root.globalKeyboardDisabledFor(this)) return;

		this.onKey(name, matches, data);
	}

	onTermReady() {
		if (this.canHaveFocus) {
			this.term.on('key', (name, matches, data) => {
				if (!this.root.autoShortcutsEnabled) return;
				this.handleKey(name, matches, data);
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

	get fullName() {
		return this.parent ? this.parent.fullName + '.' + this.name : this.name;
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

	childByType(type, recurse = true) {
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

		// Invalidate parent too so that, for example, in the case of a layout
		// it can re-layout its children.
		if (this.parent) this.parent.invalidate();
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
			this.term.moveTo(this.absoluteInnerX, this.absoluteInnerY + y, ' '.repeat(this.innerWidth));
		}
	}

	drawBorder() {
		const term = this.term;

		let x = this.absoluteX;
		let y = this.absoluteY;
		let width = this.width;
		let height = this.height;

		chalk.reset();

		const focusStyle = chalk.white;
		const unfocusStyle = chalk.gray;
		const style = this.hasFocus ? focusStyle : unfocusStyle;

		const hLineChar = this.hasFocus ? focusStyle('-') : unfocusStyle('.');
		const vLineChar = this.hasFocus ? focusStyle('│') : unfocusStyle('|');

		if (this.style.borderTopWidth) {
			term.drawHLine(x, y, width, hLineChar);
		}

		if (this.style.borderBottomWidth) {
			term.drawHLine(x, y + height - 1, width, hLineChar);
		}

		if (this.style.borderLeftWidth) {
			term.drawVLine(x, y, height, vLineChar);
		}

		if (this.style.borderRightWidth) {
			term.drawVLine(x + width - 1, y, height, vLineChar);
		}

		if (this.style.borderBottomWidth && this.style.borderLeftWidth) {
			term.moveTo(x, y + height - 1);
			term.write(style('\''));
		}

		if (this.style.borderBottomWidth && this.style.borderRightWidth) {
			term.moveTo(x + width - 1, y + height - 1);
			term.write(style('\''));
		}
	}

	render() {
		// this.logger().debug('Render: ' + this.name);

		if (this.previousRenderSize_ === null) this.previousRenderSize_ = { innerWidth: this.innerWidth, innerHeight: this.innerHeight };

		if (this.previousRenderSize_.innerWidth != this.innerWidth || this.previousRenderSize_.innerHeight != this.innerHeight) {
			this.onSizeChanged();
		}

		this.term.saveCursor();
		this.drawBorder();
		this.term.restoreCursor();

		this.previousRenderSize_ = { innerWidth: this.innerWidth, innerHeight: this.innerHeight };
	}

};

BaseWidget.setLogger = function(v) {
	BaseWidget.logger_ = v;
}

module.exports = BaseWidget;
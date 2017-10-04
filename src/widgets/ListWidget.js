const BaseWidget = require('./BaseWidget.js');
const termutils = require('../framework/termutils.js');

class ListWidget extends BaseWidget {

	constructor() {
		super();

		this.items_ = [];
		this.currentIndex_ = -1;
		this.topIndex_ = 0;
		this.itemMaxWidth_ = null;
		this.separatorLine_ = 'none';
	}

	widgetType() {
		return 'list';
	}

	onKey(name, matches, data) {
		if (name === 'UP') {
			this.selectUp();
		} else if (name == 'DOWN') {
			this.selectDown();
		}
	}

	topIndex() {
		return this.topIndex_;
	}

	bottomIndex() {
		return this.topIndex_ + this.innerHeight() - 1;
	}

	setTopIndex(v) {
		if (v > this.maxTopIndex()) v = this.maxTopIndex();
		if (v < 0) v = 0;
		if (this.topIndex_ === v) return;

		this.topIndex_ = v;
		this.invalidate();
	}

	setBottomIndex(v) {
		this.setTopIndex(v - this.innerHeight() + 1);
	}

	maxTopIndex() {
		if (this.items_.length <= this.innerHeight()) return 0;
		return this.items_.length - this.innerHeight();
	}

	setCurrentIndex(v) {
		if (v < 0) v = 0;
		if (v >= this.items_.length) v = this.items_.length - 1;
		if (v === this.currentIndex_) return;

		this.currentIndex_ = v;

		if (this.currentIndex_ < this.topIndex()) {
			this.setTopIndex(this.currentIndex_);
		} else if (this.currentIndex_ > this.bottomIndex()) {
			this.setBottomIndex(this.currentIndex_);
		}

		this.invalidate();
	}

	selectUp() {
		this.setCurrentIndex(this.currentIndex() - 1);
	}

	selectDown() {
		this.setCurrentIndex(this.currentIndex() + 1);
	}

	scrollDown() {
		this.setTopIndex(this.topIndex_ + 1);
	}

	scrollUp() {
		this.setTopIndex(this.topIndex_ - 1);
	}

	currentIndex() {
		return this.currentIndex_;
	}

	setItems(items) {
		this.items_ = items;
		this.itemMaxWidth_ = null;
		if (this.currentIndex_ < 0 && this.items_.length) this.currentIndex_ = 0;
	}

	itemMaxWidth() {
		if (this.itemMaxWidth_ !== null) return this.itemMaxWidth_;

		let output = 0;
		for (let i = 0; i < this.items_.length; i++) {
			if (this.items_[i].label.length > output) output = this.items_[i].label.length;
		}
		return output;
	}

	formatItemLabel(label, width) {
		if (label.length < width) {
			return label + ' '.repeat(width - label.length);
		} else {
			return label.substr(width);
		}
	}

	render() {
		super.render();

		const term = this.term();

		let cursorX = this.absoluteInnerX();
		let cursorY = this.absoluteInnerY();
		let itemWidth = this.innerWidth();
		let viewHeight = 0;

		for (let i = this.topIndex(); i <= this.bottomIndex(); i++) {
			let item = this.items_[i];

			term.moveTo(cursorX, cursorY);

			if (i == this.currentIndex()) {
				if (this.hasKeyboard()) {
					term.bgWhite();
					term.black();
				} else {
					term.bgColorGrayscale(125);
					term.black();
				}
			} else {
				term.styleReset();
			}

			term(this.formatItemLabel(item.label, itemWidth));

			cursorY++;
			viewHeight++;

			if (viewHeight > this.innerHeight()) {
				break;
			}
		}

		term.styleReset();
	}

}

module.exports = ListWidget;
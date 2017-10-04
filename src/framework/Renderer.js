class Renderer {

	constructor(term, root) {
		this.term_ = term;
		this.root_ = root;
		this.root_.setRenderer(this);
		this.root_.onTermReady();
	}

	term() {
		return this.term_;
	}

	root() {
		return this.root_;
	}

	start() {
		this.scheduleRender();
	}

	scheduleRender() {
		if (this.renderTimeoutId_) return;

		this.renderTimeoutId_ = setTimeout(() => {
			this.renderTimeoutId_ = null;
			this.renderRoot();
		}, 30);
	}

	renderWidget(widget) {
		const termutils = require('./termutils.js');

		if (widget.invalidated()) {
			if (widget.visible()) {
				widget.render();
			} else {
				widget.clear();
			}

			widget.invalidated_ = false;
		}

		let invisibleWidgets = [];
		let visibleWidgets = [];
		for (let i = 0; i < widget.childCount(); i++) {
			var c = widget.childAt(i);
			if (c.visible()) {
				visibleWidgets.push(c);
			} else {
				invisibleWidgets.push(c);
			}
		}

		let children = invisibleWidgets.concat(visibleWidgets);
		for (let i = 0; i < children.length; i++) {
			this.renderWidget(children[i]);
		}		
	}

	renderRoot() {
		if (this.renderTimeoutId_) {
			clearTimeout(this.renderTimeoutId_);
			this.renderTimeoutId_ = null;
		}

		this.renderWidget(this.root());
	}

}

module.exports = Renderer;
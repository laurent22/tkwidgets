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

		this.renderTimeoutId_ = setTimeout(async () => {
			this.renderTimeoutId_ = null;
			await this.renderRoot();
		}, 30);
	}

	async renderWidget(widget) {
		const termutils = require('./termutils.js');

		if (widget.invalidated()) {
			ilog('Render: ' + widget.name());

			if (widget.visible()) {
				await widget.render();
				//await termutils.msleep(500);
			} else {
				ilog(widget.x() + ', ' + widget.y() + ', ' + widget.width() + ', ' + widget.height());
				await widget.clear();
				//await termutils.msleep(500);
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
			await this.renderWidget(children[i]);
		}		
	}

	async renderRoot() {
		if (this.renderTimeoutId_) {
			clearTimeout(this.renderTimeoutId_);
			this.renderTimeoutId_ = null;
		}

		await this.renderWidget(this.root());
	}

}

module.exports = Renderer;
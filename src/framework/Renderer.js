const EventEmitter = require('events');

class Renderer {

	constructor(term, root) {
		this.term_ = term;		
		this.root_ = root;
		this.eventEmitter_ = new EventEmitter();
		this.root_.renderer = this;
		this.root_.onTermReady();
	}

	on(eventName, callback) {
		return this.eventEmitter_.on(eventName, callback);
	}

	get term() {
		return this.term_;
	}

	get root() {
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
		if (widget.invalidated) {

			// This optional async onWillRender() method can be used
			// by the widget to load any required data before the
			// actual rendering. Rendering itself is always synchronous.
			if (widget.onWillRender) {
				await widget.onWillRender();
			}

			if (widget.visible) {
				widget.render();
			} else {
				widget.clear();
			}

			widget.invalidated_ = false;
		}

		let invisibleWidgets = [];
		let visibleWidgets = [];
		for (let i = 0; i < widget.childCount; i++) {
			var c = widget.childAt(i);
			if (c.visible) {
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

	async renderRoot() {
		if (this.renderTimeoutId_) {
			clearTimeout(this.renderTimeoutId_);
			this.renderTimeoutId_ = null;
		}

		await this.renderWidget(this.root);

		this.eventEmitter_.emit('renderDone');
	}

}

module.exports = Renderer;
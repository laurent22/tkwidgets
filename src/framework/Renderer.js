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

	async forceRender() {
		await this.renderRoot();
	}

	scheduleRender() {
		if (this.renderTimeoutId_) return;

		this.renderTimeoutId_ = setTimeout(async () => {
			await this.renderRoot();
			this.renderTimeoutId_ = null;
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
			await this.renderWidget(children[i]);
		}
	}

	async renderRoot() {
		if (this.renderTimeoutId_) {
			clearTimeout(this.renderTimeoutId_);
			this.renderTimeoutId_ = null;
		}

		await this.renderWidget(this.root);

		// let column = new Array(this.root.height);
		// column.fill(0);
		// let borderBuffer = [];
		// for (let i = 0; i < this.root.width; i++) {
		// 	borderBuffer.push(column.slice());
		// }

		// borderBuffer = this.drawBorders_(this.root, borderBuffer);

		// this.term.saveCursor();

		// for (let x = 0; x < borderBuffer.length; x++) {
		// 	const col = borderBuffer[x];
		// 	for (let y = 0; y < col.length; y++) {
		// 		const v = col[y];
		// 		if (v) {
		// 			this.term.moveTo(x, y);
		// 			this.term.write('X');
		// 		}
		// 	}
		// }

		// ilog(borderBuffer[0]);

		// this.term.restoreCursor();

		this.eventEmitter_.emit('renderDone');
	}

	drawBorders_(widget, results) {
		const drawVLine = (x, y, length, type) => {
			for (let i = 0; i < length; i++) {
				results[x][y + i] = type;
			}
		}

		const drawHLine = (x, y, length, type) => {
			for (let i = 0; i < length; i++) {
				results[x + i][y] = type;
			}
		}

		const x = widget.absoluteX;
		const y = widget.absoluteY;
		const width = widget.width;
		const height = widget.height;

		if (widget.style.borderLeftWidth) {
			drawVLine(x, y, height, 1);
		}

		if (widget.style.borderRightWidth) {
			drawVLine(x + width - 1, y, height, 1);
		}

		if (widget.style.borderTopWidth) {
			drawHLine(x, y, width, 1);
		}

		if (widget.style.borderBottomWidth) {
			drawHLine(x, y + height - 1, width, 1);
		}

		for (let i = 0; i < widget.childCount; i++) {
			results = this.drawBorders_(widget.childAt(i), results);
		}

		return results;	
	}

}

module.exports = Renderer;
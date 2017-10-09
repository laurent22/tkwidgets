const BaseWidget = require('./BaseWidget.js');

class RootWidget extends BaseWidget {

	constructor() {
		super();
		this.setStretch(true, true);
		this.allInputDisabled_ = false;
	}

	get canHaveFocus() {
		return false;
	}

	get widgetType() {
		return 'root';
	}

	get isRoot() {
		return true;
	}

	disableAllInput(v) {
		if (this.allInputDisabled_ === v) return;
		this.allInputDisabled_ = v;

		this.logger().info('allInputDisabled_', this.allInputDisabled_);
	}

	get allInputDisabled() {
		return this.allInputDisabled_;
	}

	onTermReady() {
		super.onTermReady();

		this.term.on('resize', (width, height) => {
			this.onResize();
		});
	}

}

// Temporary hack required to get term.on('resize') event to
// work on Windows. https://github.com/cronvel/terminal-kit/issues/54
process.on('SIGWINCH', function() {});

module.exports = RootWidget;
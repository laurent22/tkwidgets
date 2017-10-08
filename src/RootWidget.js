const BaseWidget = require('./BaseWidget.js');

class RootWidget extends BaseWidget {

	constructor() {
		super();
		this.setStretch(true, true);
	}

	canHaveFocus() {
		return false;
	}

	widgetType() {
		return 'root';
	}

	onTermReady() {
		super.onTermReady();

		this.term().on('resize', (width, height) => {
			this.onResize();
		});
	}

}

// Temporary hack required to get term.on('resize') event to
// work on Windows. https://github.com/cronvel/terminal-kit/issues/54
process.on('SIGWINCH', function() {});

module.exports = RootWidget;
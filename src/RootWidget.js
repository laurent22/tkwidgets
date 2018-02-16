const BaseWidget = require('./BaseWidget.js');

class RootWidget extends BaseWidget {

	constructor() {
		super();
		this.setStretch(true, true);
		this.disableKeyboardSource_ = null;
		this.autoShortcutsEnabled_ = true;
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

	globalEnableKeyboard(source) {
		if (this.disableKeyboardSource_ === null) return;
		if (this.disableKeyboardSource_ !== source) throw new Error('Only original source can re-enable keyboard');
		this.disableKeyboardSource_ = null;
	}

	globalDisableKeyboard(source) {
		if (!source) throw new Error('Source must be specified');
		this.disableKeyboardSource_ = source;
	}

	globalKeyboardDisabledFor(widget) {
		if (this.disableKeyboardSource_ === null) return false;
		return this.disableKeyboardSource_ !== widget;
	}

	get globalKeyboardEnabled() {
		return !this.globalKeyboardDisabled;
	}

	get globalKeyboardDisabled() {
		return !!this.disableKeyboardSource_;
	}

	onTermReady() {
		super.onTermReady();

		this.term.on('resize', (width, height) => {
			this.onResize();
		});
	}

	// By settting this to "false" it is possible to handle the shortcuts at the application-level
	// by calling handleKey() manually.
	get autoShortcutsEnabled() {
		return this.autoShortcutsEnabled_;
	}

	set autoShortcutsEnabled(v) {
		if (this.autoShortcutsEnabled_ === v) return;
		this.autoShortcutsEnabled_ = v;
	}

}

// Temporary hack required to get term.on('resize') event to
// work on Windows. https://github.com/cronvel/terminal-kit/issues/54
process.on('SIGWINCH', function() {});

module.exports = RootWidget;
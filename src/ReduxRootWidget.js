const BaseWidget = require('./BaseWidget.js');

class ReduxRootWidget extends BaseWidget {

	constructor(store) {
		super();
		this.store_ = store;
		this.setStretch(true, true);
		this.connections_ = [];

		this.store_.subscribe(() => this.storeListener_());
	}

	canHaveFocus() {
		return false;
	}

	widgetType() {
		return 'reduxRoot';
	}

	get store() {
		return this.store_;
	}

	storeListener_() {
		const state = this.store.getState();

		for (let i = 0; i < this.connections_.length; i++) {
			const c = this.connections_[i];
			const props = c.mapStateToProps(state);

			for (let n in props) {
				if (!props.hasOwnProperty(n)) continue;
				c.widget[n] = props[n];
			}
		}
	}

	connect(widget, mapStateToProps, mapDispatchToProps = null) {
		this.connections_.push({
			widget: widget,
			mapStateToProps: mapStateToProps,
			mapDispatchToProps: mapDispatchToProps,
		});
	}

}

module.exports = ReduxRootWidget;
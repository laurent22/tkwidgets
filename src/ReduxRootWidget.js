const RootWidget = require('./RootWidget.js');

class ReduxRootWidget extends RootWidget {

	constructor(store) {
		super();
		this.store_ = store;
		this.setStretch(true, true);
		this.connections_ = [];

		this.store_.subscribe(() => this.storeListener_());
	}

	get canHaveFocus() {
		return false;
	}

	get widgetType() {
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

				if (!(n in c.widget)) {
					throw new Error('Widget "' + c.widget.name + '" does not have a property named "' + n + '".')
				} else {
					if (c.widget[n] !== props[n]) c.widget[n] = props[n];
				}
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
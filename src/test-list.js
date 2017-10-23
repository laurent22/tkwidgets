'use strict';

require('./test-utils.js');

const tk = require('terminal-kit');

const termutils = require('./framework/termutils.js');
const Renderer = require('./framework/Renderer.js');

const BaseWidget = require('./BaseWidget.js');
const ListWidget = require('./ListWidget.js');
const RootWidget = require('./RootWidget.js');
const WindowWidget = require('./WindowWidget.js');
const TermWrapper = require('./framework/TermWrapper.js');

function createItems(count) {
	let items = [];
	for (let i = 0; i < count; i++) {
		items.push({
			id: i+1,
			title: 'Item ' + (i+1),
		});
	}
	return items;
}

function insertItem(items, position) {
	let output = items.slice();
	output.splice(position, 0, { id: items.length + 1, title: 'Inserted ' + items.length + 1 });
	return output;
}

function main() {
	const listWidget = new ListWidget();
	listWidget.name = 'list';
	listWidget.style = {
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
	};
	listWidget.hStretch = true;
	listWidget.vStretch = true;
	listWidget.items = createItems(50);
	listWidget.itemRenderer = (item) => {
		return item.title;
	}

	const win = new WindowWidget();
	win.addChild(listWidget);

	const rootWidget = new RootWidget();
	rootWidget.addChild(win);

	const term = new TermWrapper(tk.terminal);

	const renderer = new Renderer(term, rootWidget);
	renderer.start();

	const fullScreen = (enable = true) => {
		if (enable) {
			term.fullscreen();
			term.hideCursor();
		} else {
			term.fullscreen(false);
			term.showCursor();
		}
	}

	term.grabInput();

	fullScreen();

	term.on('key', async (name, matches, data) => {
		if (name === 'CTRL_D' || name === 'CTRL_C') {
			fullScreen(false);
			process.exit();
			return;
		}

		if (name === 't') {
			listWidget.items = insertItem(listWidget.items, 0);
			return;
		}

		if (name === 'b') {
			listWidget.items = insertItem(listWidget.items, 10);
			return;
		}
	});

	process.on('unhandledRejection', (reason, p) => {
		fullScreen(false);
		console.error('Unhandled promise rejection', p, 'reason:', reason);
		process.exit(1);
	});	
}

main();
'use strict';

global.ilog = function(s) {
	const fs = require('fs');
	if (typeof s === 'object') s = JSON.stringify(s);
	s = ((new Date()).getTime()) + ': ' + s;
	fs.appendFileSync('log.txt', s + "\n");
}

ilog('=======================================================');


const tk = require('terminal-kit');

const termutils = require('./framework/termutils.js');
const Renderer = require('./framework/Renderer.js');

const ListWidget = require('./ListWidget.js');
const TextWidget = require('./TextWidget.js');
const ConsoleWidget = require('./ConsoleWidget.js');
const HLayoutWidget = require('./HLayoutWidget.js');
const VLayoutWidget = require('./VLayoutWidget.js');
const RootWidget = require('./RootWidget.js');
const WindowWidget = require('./WindowWidget.js');
const markdownRenderer = require('./framework/markdownRenderer.js');
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
	listWidget.style = {
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
	};
	listWidget.hStretch = true;
	listWidget.vStretch = true;
	listWidget.itemRenderer = (item) => {
		return item.title;
	};

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

	listWidget.items = createItems(200);

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

}

main();
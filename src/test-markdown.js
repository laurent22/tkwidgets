'use strict';

require('./test-utils.js');

const tk = require('terminal-kit');

const termutils = require('./framework/termutils.js');
const Renderer = require('./framework/Renderer.js');

const BaseWidget = require('./BaseWidget.js');
const TextWidget = require('./TextWidget.js');
const RootWidget = require('./RootWidget.js');
const WindowWidget = require('./WindowWidget.js');
const TermWrapper = require('./framework/TermWrapper.js');

const formattingSample = function() {
	return `
Some text **in bold**, then *in italic*. Some \`exampleCode()\`, end.
`;
}

const blockCodeSample = function() {
	return `
Some code below:

\`\`\`
function fancyAlert(arg) {
    if(arg) {
        $.facebox({div:'#foo'})
        var test = "some very long line that's going to trigger a break"; var andThenAVariable = arg;
    }
}
\`\`\`	

Some code above
	`;
}

function main() {
	const textWidget1 = new TextWidget();
	textWidget1.name = 'text';
	textWidget1.style = {
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
	};
	textWidget1.width = 50;
	textWidget1.vStretch = true;

	const win = new WindowWidget();
	win.addChild(textWidget1);

	const rootWidget = new RootWidget();
	rootWidget.addChild(win);

	const term = new TermWrapper(tk.terminal);

	const renderer = new Renderer(term, rootWidget);
	renderer.start();

	textWidget1.text = blockCodeSample();

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
// 'use strict';

// require('./test-utils.js');

// const tk = require('terminal-kit');

// const termutils = require('./framework/termutils.js');
// const Renderer = require('./framework/Renderer.js');

// const BaseWidget = require('./BaseWidget.js');
// const ListWidget = require('./ListWidget.js');
// const TextWidget = require('./TextWidget.js');
// const ConsoleWidget = require('./ConsoleWidget.js');
// const HLayoutWidget = require('./HLayoutWidget.js');
// const VLayoutWidget = require('./VLayoutWidget.js');
// const RootWidget = require('./RootWidget.js');
// const WindowWidget = require('./WindowWidget.js');
// const markdownRenderer = require('./framework/markdownRenderer.js');
// const TermWrapper = require('./framework/TermWrapper.js');


// const term = new tk.terminal;
// term.fullscreen();


// const buffer = tk.ScreenBuffer.create({
// 	width:10,
// 	height: 20,
// 	dst: term,
// });


// //buffer.moveTo(1,1);
// buffer.put( { x: 3 , y: 2 , attr: { color: 'red' , 	underline: true } } , 'toto' ) ;
// //buffer.put({}, '0123456');
// buffer.draw();

// term.grabInput();

// term.on('key', async (name, matches, data) => {
// 	if (name === 'CTRL_D' || name === 'CTRL_C') {
// 		term.fullscreen(false);
// 		process.exit();
// 		return;
// 	}
// });

// term.fullscreen(false);





'use strict';

require('./test-utils.js');

const tk = require('terminal-kit');

const termutils = require('./framework/termutils.js');
const Renderer = require('./framework/Renderer.js');

const BaseWidget = require('./BaseWidget.js');
const ListWidget = require('./ListWidget.js');
const TextWidget = require('./TextWidget.js');
const ConsoleWidget = require('./ConsoleWidget.js');
const HLayoutWidget = require('./HLayoutWidget.js');
const VLayoutWidget = require('./VLayoutWidget.js');
const RootWidget = require('./RootWidget.js');
const WindowWidget = require('./WindowWidget.js');
const markdownRenderer = require('./framework/markdownRenderer.js');
const TermWrapper = require('./framework/TermWrapper.js');

class DebugWidget extends TextWidget {

	async onWillRender() {
		this.text = this.fullName;
	}

}

function newDebugWidget(name) {
	const w = new DebugWidget();
	w.name = name;
	w.style = {
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
	};
	return w;
}

function main() {
	const term = new TermWrapper(tk.terminal)
	//const term = tk.terminal;

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

	const buffer = term.createScreenBuffer(10, 20);
	buffer.write('test');
	buffer.draw();

	// const buffer = tk.ScreenBuffer.create({
	// 	width:10,
	// 	height: 20,
	// 	dst: term,
	// });


	// //buffer.moveTo(1,1);
	// buffer.put( { x: 0, y: 0, attr: { color: 'red' , underline: true } } , 'toto' ) ;
	// //buffer.put({}, '0123456');
	// buffer.draw();


	term.on('key', async (name, matches, data) => {
		if (name === 'CTRL_D' || name === 'CTRL_C') {
			fullScreen(false);
			process.exit();
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
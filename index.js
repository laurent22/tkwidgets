


global.ilog = function(s) {
	const fs = require('fs');
	s = ((new Date()).getTime()) + ': ' + s;
	fs.appendFileSync('log.txt', s + "\n");
}


ilog('=======================================================');


const termutils = require('./src/framework/termutils.js');
const Renderer = require('./src/framework/Renderer.js');

const ListWidget = require('./src/widgets/ListWidget.js');
const TextWidget = require('./src/widgets/TextWidget.js');
const ConsoleWidget = require('./src/widgets/ConsoleWidget.js');
const HLayoutWidget = require('./src/widgets/HLayoutWidget.js');
const VLayoutWidget = require('./src/widgets/VLayoutWidget.js');
const RootWidget = require('./src/widgets/RootWidget.js');
const WindowWidget = require('./src/widgets/WindowWidget.js');



async function main() {

	const tk = require('terminal-kit');
	const term = tk.terminal;


	term.fullscreen();

	termutils.hideCursor(term);



	let items = [
		{ label: "un", },
		{ label: "deux", },
		{ label: "trois", },
		{ label: "quatre", },
		{ label: "cinq", },
		{ label: "six", },
		{ label: "setp", },
		{ label: "heigt", },
		{ label: "nuef", },
		{ label: "dix", },
	];

	for (var i = 0; i < 10000; i++) {
		items.push({label: 'item ' + i});
	}

	let items2 = [
		{ label: "22_un", },
		{ label: "22_deux", },
		{ label: "22_trois", },
		{ label: "22_quatre", },
		{ label: "22_cinq", },
		{ label: "22_six", },
		{ label: "22_setp", },
		{ label: "22_heigt", },
		{ label: "22_nuef", },
		{ label: "22_dix", },
	];










	const rootWidget = new RootWidget();
	rootWidget.setName('rootWidget');

	const listWidget1 = new ListWidget();
	listWidget1.setItems(items);
	listWidget1.setLocation(1, 1);
	listWidget1.setStyle({
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
	});
	listWidget1.setName('listWidget1');

	const listWidget2 = new ListWidget();
	listWidget2.setLocation(25, 1);
	listWidget2.setItems(items2);
	listWidget2.setName('listWidget2');

	const textWidget = new TextWidget();
	textWidget.setLocation(50, 1);
	textWidget.setText("# mon titre\n\du texte *en gras*\n\nSome long paragraph some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph ");
	textWidget.setName('textWidget');

	const listWidget3 = new ListWidget();
	//listWidget3.setLocation(3, 20);
	listWidget3.setItems(items2);
	listWidget3.setName('listWidget3');

	const layout1 = new HLayoutWidget();
	layout1.addChild(listWidget1, { type: 'fixed', factor: 15 });
	layout1.addChild(listWidget2, { type: 'fixed', factor: 15 });
	layout1.addChild(textWidget, { type: 'stretch', factor: 1 });

	const layout2 = new VLayoutWidget();
	layout2.addChild(layout1, { type: 'stretch', factor: 1 });
	layout2.addChild(listWidget3, { type: 'fixed', factor: 5 });

	const win1 = new WindowWidget();
	win1.addChild(layout2);
	win1.setName('win1');
	win1.setLocation(1,1);

	rootWidget.addChild(win1);

	renderer = new Renderer(term, rootWidget);
	renderer.start();












	// const rootWidget = new RootWidget();
	// rootWidget.setName('rootWidget');

	// const listWidget1 = new ListWidget();
	// listWidget1.setItems(items);
	// listWidget1.setLocation(1, 1);
	// listWidget1.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });
	// listWidget1.setName('listWidget1');

	// const listWidget2 = new ListWidget();
	// listWidget2.setLocation(25, 1);
	// listWidget2.setItems(items2);
	// listWidget2.setName('listWidget2');

	// const listWidget3 = new ListWidget();
	// listWidget3.setLocation(3, 20);
	// listWidget3.setItems(items2);
	// listWidget3.setName('listWidget3');

	// const textWidget = new TextWidget();
	// textWidget.setLocation(50, 1);
	// textWidget.setText("# mon titre\n\du texte *en gras*\n\nSome long paragraph some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph Some long paragraph ");
	// textWidget.setName('textWidget');

	// const consoleWidget = new ConsoleWidget();
	// consoleWidget.setName('consoleWidget');
	// consoleWidget.setHeight(5);
	// consoleWidget.setLocation(1, 15);

	// const win1 = new WindowWidget();
	// win1.addChild(listWidget1);
	// win1.addChild(listWidget2);
	// win1.addChild(textWidget);
	// win1.addChild(consoleWidget);
	// win1.setName('win1');
	// win1.setLocation(1,1);

	// const win2 = new WindowWidget();
	// win2.addChild(listWidget3);
	// win2.setName('win2');

	// rootWidget.addChild(win1);
	// rootWidget.addChild(win2);

	// renderer = new Renderer(term, rootWidget);
	// renderer.start();

	// win1.activate();












	term.grabInput();

	term.on('key' , function( name , matches , data ) {
		if (name === 'CTRL_C' ) {
			termutils.showCursor(term);
			term.fullscreen(false);
			process.exit();
		}

		if (name === 'CTRL_J') {
			consoleWidget.focus();
		}

		if (name == 't') {
			if (win1.isActiveWindow()) {
				win2.activate();
			} else {
				win1.activate();
			}
		}
	});
}

main().catch((error) => {
	console.error(error);
});
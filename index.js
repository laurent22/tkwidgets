


const fs = require('fs');
global.ilog = function(s) {
	s = ((new Date()).getTime()) + ': ' + s;
	fs.appendFileSync('log.txt', s + "\n");
}


const termutils = require('./src/framework/termutils.js');
const Renderer = require('./src/framework/Renderer.js');
const ListWidget = require('./src/widgets/ListWidget.js');
const ConsoleWidget = require('./src/widgets/ConsoleWidget.js');
const HLayoutWidget = require('./src/widgets/HLayoutWidget.js');
const ViewWidget = require('./src/widgets/ViewWidget.js');



async function main() {

	const tk = require('terminal-kit');
	const term = tk.terminal;



	term.fullscreen();
	term.hideCursor();



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







	const rootWidget = new ViewWidget();
	rootWidget.setName('rootWidget');
	rootWidget.setWidth(term.width);
	rootWidget.setHeight(term.height);

	const listWidget1 = new ListWidget();
	listWidget1.setItems(items);
	listWidget1.setName('listWidget1');

	const listWidget2 = new ListWidget();
	listWidget2.setItems(items2);
	listWidget2.setName('listWidget2');

	const consoleWidget = new ConsoleWidget();
	consoleWidget.setName('consoleWidget');
	consoleWidget.setHeight(5);
	consoleWidget.setLocation(1, 15);

	const listLayout = new HLayoutWidget();
	listLayout.setWidth(term.width);
	listLayout.setHeight(term.height);
	listLayout.addChild(listWidget1, { type: 'stretch', factor: 1 });
	listLayout.addChild(listWidget2, { type: 'stretch', factor: 1 });

	rootWidget.addChild(listLayout);
	rootWidget.addChild(consoleWidget);

	renderer = new Renderer(term, rootWidget);
	renderer.start();
















	// const rootWidget = new ViewWidget();
	// rootWidget.setName('rootWidget');

	// const listWidget1 = new ListWidget();
	// listWidget1.setItems(items);
	// listWidget1.setName('listWidget1');

	// const listWidget2 = new ListWidget();
	// listWidget2.setLocation(25, 5);
	// listWidget2.setItems(items2);
	// listWidget2.setName('listWidget2');

	// const view1 = new ViewWidget();
	// view1.addChild(listWidget1);
	// view1.setName('view1');

	// const view2 = new ViewWidget();
	// view2.addChild(listWidget2);
	// view2.setName('view2');
	// view2.hide();

	// rootWidget.addChild(view1);
	// rootWidget.addChild(view2);

	// renderer = new Renderer(term, rootWidget);
	// renderer.start();















	term.grabInput();

	term.on('key' , function( name , matches , data ) {
		if (name === 'CTRL_C' ) {
			term.hideCursor(false);
			term.fullscreen(false);
			process.exit();
		}

		// if (name == 't') {
		// 	ilog('=======================');
		// 	if (view1.shown()) {
		// 		view1.hide();
		// 		view2.show();
		// 	} else {
		// 		view1.show();
		// 		view2.hide();
		// 	}
		// }
	});
}

main().catch((error) => {
	console.error(error);
});





// - Press C to start typing command
// 	- cp %n %b
// - Deux ligne en bas (command + resultat)
// - Essayer command + confirm? + résultt
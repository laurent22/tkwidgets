


const fs = require('fs');
global.ilog = function(s) {
	s = ((new Date()).getTime()) + ': ' + s;
	fs.appendFileSync('log.txt', s + "\n");
}


const termutils = require('./src/framework/termutils.js');
const Renderer = require('./src/framework/Renderer.js');
const RootWidget = require('./src/widgets/RootWidget.js');
const ListWidget = require('./src/widgets/ListWidget.js');
const HLayoutWidget = require('./src/widgets/HLayoutWidget.js');
const ViewWidget = require('./src/widgets/ViewWidget.js');



async function main() {

	const tk = require('terminal-kit');
	const term = tk.terminal;



	term.fullscreen();
	term.hideCursor();

	// term.moveTo(2,2);
	// term('abcdefg');

	// term.moveTo(2,2);
	// term.delete(1);
	// term.insert(1);



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

	const listWidget1 = new ListWidget();
	listWidget1.setItems(items);
	listWidget1.setName('listWidget1');

	const listWidget2 = new ListWidget();
	listWidget2.setLocation(25, 5);
	listWidget2.setItems(items2);
	listWidget2.setName('listWidget2');

	const view1 = new ViewWidget();
	view1.addChild(listWidget1);
	view1.setName('view1');

	const view2 = new ViewWidget();
	view2.addChild(listWidget2);
	view2.setName('view2');
	view2.hide();

	rootWidget.addChild(view1);
	rootWidget.addChild(view2);

	renderer = new Renderer(term, rootWidget);
	renderer.start();






	term.grabInput();

	term.on('key' , function( name , matches , data ) {
		if (name === 'CTRL_C' ) {
			term.hideCursor(false);
			term.fullscreen(false);
			process.exit();
		}

		if (name == 't') {
			if (view1.shown()) {
				view1.hide();
				view2.show();
			} else {
				view1.show();
				view2.hide();
			}
		}
	});




	// const listWidget1 = new ListWidget(term);
	// listWidget1.setLocation(1,1);
	// listWidget1.setItems(items);
	// listWidget1.setHeight(5);
	// listWidget1.setStyle({ borderBottomWidth: 1 });

	// const listWidget2 = new ListWidget(term);
	// listWidget2.setLocation(20,2);
	// listWidget2.setItems(items);
	// listWidget2.setStyle({ borderTopWidth: 1 });
	// listWidget2.setHeight(10);

	// const listWidget3 = new ListWidget(term);
	// //listWidget3.setItems([{ label: "one" }, { label: "two" }]);
	// listWidget3.setLocation(1,10);
	// listWidget3.setItems(items);
	// listWidget3.setHeight(20);
	// listWidget3.setStyle({ borderBottomWidth: 1 });

	// const layout = new HLayoutWidget(term);

	// layout.addWidget(listWidget1, {
	// 	type: 'stretch',
	// 	factor: 1,
	// });

	// layout.addWidget(listWidget2, {
	// 	type: 'stretch',
	// 	factor: 1,
	// });

	// layout.setWidth(term.width);
	// layout.setHeight(term.height);

	// listWidget1.focus();

	// const page1 = new ViewWidget(term);
	// page1.addWidget(layout);
	// page1.hide();

	// const page2 = new ViewWidget(term);
	// page2.addWidget(listWidget3);
	// page2.show();

	// term.grabInput();

	// term.on( 'key' , function( name , matches , data ) {
	// 	if ( name === 'CTRL_C' ) {
	// 		term.hideCursor(false);
	// 		term.fullscreen(false);
	// 		process.exit();
	// 	}

	// 	if (name == 't') {
	// 		if (page1.shown()) {
	// 			page1.hide();
	// 			page2.show();	
	// 		} else {
	// 			page1.show();
	// 			page2.hide();	
	// 		}
	// 	}
	// } ) ;

	// Each invalidate() call push an update to a global list
	// After x ms, something process this list and update the objects
	//		Should be done in a specific order (hidden objects first)

	// - Press O to display context menu:
	// - Press n/p for next/previous tab


	// - Press C to start typing command
	// 	- cp %n %b



	// - Deux ligne en bas (command + resultat)
	// - Essayer command + confirm? + résultt
}

main().catch((error) => {
	console.error(error);
});



global.ilog = function(s) {
	const fs = require('fs');
	if (typeof s === 'object') s = JSON.stringify(s);
	s = ((new Date()).getTime()) + ': ' + s;
	fs.appendFileSync('log.txt', s + "\n");
}


ilog('=======================================================');


const termutils = require('./framework/termutils.js');
const Renderer = require('./framework/Renderer.js');

const ListWidget = require('./ListWidget.js');
const TextWidget = require('./TextWidget.js');
const ConsoleWidget = require('./ConsoleWidget.js');
const HLayoutWidget = require('./HLayoutWidget.js');
const VLayoutWidget = require('./VLayoutWidget.js');
const RootWidget = require('./RootWidget.js');
const WindowWidget = require('./WindowWidget.js');



function main() {

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
		"22_un",
		"22_deux",
		"22_trois",
		"22_quatre",
		"22_cinq",
		"22_six",
		"22_setp",
		"22_heigt",
		"22_nuef",
		"22_dix",
	];

	let customItems = [
		{ id: 1, title: "one" },
		{ id: 2, title: "two" },
		{ id: 3, title: "three" },
	];











	const rootWidget = new RootWidget();
	rootWidget.name = 'rootWidget';

	const textWidget = new TextWidget();
	
	//textWidget.setText('Now is the time');	

	//textWidget.setText("# mon titre\n\du texte *en gras*\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ligula massa, elementum et pretium sit amet, ornare facilisis libero. Integer ut pharetra augue. Praesent luctus interdum lacus vel faucibus. Morbi mollis ac nulla ac euismod. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi eu nibh augue. Ut at est malesuada, luctus tortor ac, tristique lacus. Donec vel nunc ut dui ultricies ultrices at sed odio. Morbi tempus tellus quis orci elementum consectetur id eu nibh FIN.");
	//textWidget.text = '# Longlongtitle\n\nAs they rounded a bend in the path that ran beside the *river*, Lara recognized the *silhouette* of a fig tree atop a nearby hill. The weather was hot and the days were long. The fig tree was in full leaf, but not yet bearing fruit.';

	//textWidget.text = "# title\n\n* Lorem ipsum dolor sit amet\n* Item consectetur adipiscing elit.\n* Ut ligula massa, elementum et\n* pretium sit amet, ornare facilisis libero\n\n\n1. one one one one one one one one\n2. two two two two two two two two\n3. ThreeThreeThreeThreeThreeThreeThreeThree";

	//textWidget.text = "* ul item item item item item item item \n    * ul item 2\n    * ul item 3";

	textWidget.text = "* ul item item item item item item item \n    * ul item 2\n    * ul item 3";

	//textWidget.text = "  some spaces some spaces some spaces some spaces some spaces ";

	//textWidget.text = "# title\n\n* Lorem ipsum dolor sit amet\n* Item consectetur adipiscing elit.\n* Ut ligula massa, elementum et\n* pretium sit amet, ornare facilisis libero";

	//textWidget.text = "O Item1234 456";

	//textWidget.setText("1234567890 1234567890");
	//textWidget.setText("123456789 1234 56789");
	textWidget.name = 'textWidget';
	textWidget.setWidth(30);
	textWidget.setVStretch(true);
	textWidget.setStyle({
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
	});

	const win1 = new WindowWidget();
	win1.addChild(textWidget);
	win1.name = 'win1';

	rootWidget.addChild(win1);

	renderer = new Renderer(term, rootWidget);
	renderer.start();









	// const rootWidget = new RootWidget();
	// rootWidget.setName('rootWidget');

	// const listWidget1 = new ListWidget();
	// listWidget1.setItems(customItems);
	// listWidget1.setItemRenderer((item) => { return item.title + ' (' + item.id + ')'; });
	// listWidget1.setLocation(1, 1);
	// listWidget1.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });
	// listWidget1.setName('listWidget1');
	// listWidget1.setVStretch(true);
	// listWidget1.on('currentItemChange', function() {
	// 	ilog(listWidget1.currentItem());
	// });

	// const listWidget2 = new ListWidget();
	// listWidget2.setLocation(25, 1);
	// listWidget2.setItems(items2);
	// listWidget2.setName('listWidget2');
	// listWidget2.setVStretch(true);
	// listWidget2.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });

	// const textWidget = new TextWidget();
	// textWidget.setLocation(50, 1);
	// textWidget.setVStretch(true);
	// textWidget.setText("# mon titre\n\du texte *en gras*\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ligula massa, elementum et pretium sit amet, ornare facilisis libero. Integer ut pharetra augue. Praesent luctus interdum lacus vel faucibus. Morbi mollis ac nulla ac euismod. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi eu nibh augue. Ut at est malesuada, luctus tortor ac, tristique lacus. Donec vel nunc ut dui ultricies ultrices at sed odio. Morbi tempus tellus quis orci elementum consectetur id eu nibh FIN.");
	// textWidget.setName('textWidget');
	// textWidget.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });

	// const listWidget3 = new ListWidget();
	// listWidget3.setItems(items2);
	// listWidget3.setHStretch(true);
	// listWidget3.setName('listWidget3');
	// listWidget3.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });

	// const layout1 = new HLayoutWidget();
	// layout1.addChild(textWidget, { type: 'fixed', factor: 20 });
	// layout1.addChild(listWidget1, { type: 'stretch', factor: 60 });
	// layout1.addChild(listWidget2, { type: 'stretch', factor: 60 });

	// const layout2 = new VLayoutWidget();
	// layout2.addChild(layout1, { type: 'stretch', factor: 1 });
	// layout2.addChild(listWidget3, { type: 'fixed', factor: 5 });

	// const win1 = new WindowWidget();
	// win1.addChild(layout2);
	// //win1.addChild(layout1);
	// win1.setName('win1');
	// win1.setLocation(1,1);

	// rootWidget.addChild(win1);

	// renderer = new Renderer(term, rootWidget);
	// renderer.start();

	












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
			if (win1.isActiveWindow) {
				win2.activate();
			} else {
				win1.activate();
			}
		}
	});
}

main();
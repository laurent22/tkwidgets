


const fs = require('fs');
global.ilog = function(s) {
	fs.appendFileSync('log.txt', s + "\n");
}

ilog('Testing');




const Renderer = require('./src/framework/Renderer.js');
const RootWidget = require('./src/widgets/RootWidget.js');
const ListWidget = require('./src/widgets/ListWidget.js');
const HLayoutWidget = require('./src/widgets/HLayoutWidget.js');
const PageWidget = require('./src/widgets/PageWidget.js');




const tk = require('terminal-kit');
const term = tk.terminal;


term.fullscreen();
term.hideCursor();

// console.info(term.width, term.height);
// process.exit();

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




const listWidget1 = new ListWidget(term);
listWidget1.setLocation(1,1);
listWidget1.setItems(items);
listWidget1.setHeight(5);
listWidget1.setStyle({ borderBottomWidth: 1 });

const listWidget2 = new ListWidget(term);
listWidget2.setLocation(20,2);
listWidget2.setItems(items);
listWidget2.setStyle({ borderTopWidth: 1 });
listWidget2.setHeight(10);

const layout = new HLayoutWidget(term);

layout.addWidget(listWidget1, {
	type: 'stretch',
	factor: 1,
});

layout.addWidget(listWidget2, {
	type: 'stretch',
	factor: 1,
});

layout.setWidth(term.width);
layout.setHeight(term.height);

layout.render();

listWidget1.focus();

//const page = new PageWidget(term);

//page.addWidget(layout);

//page.hide();

const renderer = new Renderer(term);


term.grabInput();

term.on( 'key' , function( name , matches , data ) {
	if ( name === 'CTRL_C' ) {
		term.hideCursor(false);
		term.fullscreen(false);
		process.exit();
	}
} ) ;
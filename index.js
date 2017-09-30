


const fs = require('fs');
function ilog(s) {
	fs.appendFileSync('log.txt', s + "\n");
}

ilog('Testing');




const ListWidget = require('./src/widgets/ListWidget.js');




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


const listWidget = new ListWidget(term);
listWidget.setLocation(1,1);
listWidget.setItems(items);
listWidget.setHeight(5);
listWidget.render();


const listWidget2 = new ListWidget(term);
listWidget2.setLocation(20,2);
listWidget2.setItems(items);
listWidget2.setHeight(10);
listWidget2.render();


listWidget.focus();



term.grabInput();

term.on( 'key' , function( name , matches , data ) {
	if ( name === 'CTRL_C' ) {
		term.hideCursor(false);
		term.fullscreen(false);
		process.exit();
	}
} ) ;
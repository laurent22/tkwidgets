global.ilog = function(...o) {
	const fs = require('fs');
	let output = [];
	for (let i = 0; i < o.length; i++) {
		let s = o[i];
		if (typeof s === 'object') s = JSON.stringify(s);
		output.push(s);
	}
	let s = ((new Date()).getTime()) + ': ' + output.join(', ');
	fs.appendFileSync('log.txt', s + "\n");
}

const BaseWidget = require('./BaseWidget.js');

BaseWidget.setLogger({
	info: (...o) => { ilog(...o); },
	error: (...o) => { ilog(...o); },
	warn: (...o) => { ilog(...o); },
	debug: (...o) => { ilog(...o); },
});

ilog('================================================================================================================');
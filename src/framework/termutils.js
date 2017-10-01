const termutils = {};

termutils.drawLine = function(term, cursorX, cursorY, length, char) {
	term.moveTo(cursorX, cursorY);
	term(char.repeat(length));
}

termutils.cursorLocation = function(term) {
	return new Promise((resolve, reject) => {
		//term.requestCursorLocation();

		// term.on( 'terminal' , function( name , data ) {
		// 	console.log( "'terminal' event:" , name , data ) ;
		// 	resolve('waht');
		// } ) ;
	});
}

termutils.msleep = function(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

module.exports = termutils;
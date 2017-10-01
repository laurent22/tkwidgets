
	const tk = require('terminal-kit');
	const term = tk.terminal;


term.fullscreen();





	var history = [ 'John' , 'Jack' , 'Joey' , 'Billy' , 'Bob' ] ;

var autoComplete = [
	'Barack Obama' , 'George W. Bush' , 'Bill Clinton' , 'George Bush' ,
	'Ronald W. Reagan' , 'Jimmy Carter' , 'Gerald Ford' , 'Richard Nixon' ,
	'Lyndon Johnson' , 'John F. Kennedy' , 'Dwight Eisenhower' ,
	'Harry Truman' , 'Franklin Roosevelt'
] ;

term( 'Please enter your name: ' ) ;

term.inputField(
	{  } ,
	function( error , input ) {

		term.green( "\nYour name is '%s'\n" , input ) ;
		process.exit() ;
	}
) ;



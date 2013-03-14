/*
Copyright (c) 2013 Fabrice ECAILLE aka Febbweiss

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var SCOREBOARD = {
	score: 0,
	scoreLength: 6,
	
	init: function(size) {
		if( typeof size !== "undefined" )
			SCOREBOARD.scoreLength = size;
		SCOREBOARD.score = 0;
		SCOREBOARD.set_score( 0 );
	},
	
	add: function(addToScore, div) {
		SCOREBOARD.set_score( SCOREBOARD.score + addToScore, div);
	},
	
	set_score: function( score, div ) {
		var currentScore = "";
		var imageScore = "";
		
		SCOREBOARD.score = score;
		currentScore = SCOREBOARD.pad();

		for(i = 0; i < String(currentScore).length; i++) {
			imageScore += "<div class='clock n"+ String(currentScore)[i]+"'></div>";
		}
		
		if( typeof div === "undefined" )
			div = $(".subScoreboard"); 
		div.empty();
		div.append( imageScore );
	},
	
	pad: function() {
	    var str = '' + SCOREBOARD.score;
	    while (str.length < SCOREBOARD.scoreLength) {
	        str = '0' + str;
	    }
	    return str;
	},
	
	callback: function() {
		console.log( "SCOREBOARD.callback" );
	}
};

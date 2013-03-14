/*
Copyright (c) 2013 Fabrice ECAILLE aka Febbweiss

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var SOUND_ACTIVATED = false;

var WIDTH_TILE_COUNT = 28;
var HEIGHT_TILE_COUNT = 34;
var TILE_SIZE = 16;
var HALF_TILE_SIZE = 8;
var ACTOR_SIZE = 32;
var PLAYGROUND_WIDTH = WIDTH_TILE_COUNT * TILE_SIZE;
var PLAYGROUND_HEIGHT = HEIGHT_TILE_COUNT * TILE_SIZE;
var ACTOR_SPEED = 4;
var LOOP_COUNT_REFRESH = 66;
var loopCount = 0;
var REFRESH_RATE		= 15;
//1: up, 2: left, 3:down, 4: right
var UP = 1;
var LEFT = 2;
var DOWN = 3;
var RIGHT = 4;

var BONUS_TILE = 77;

var eatenBonus = new Array();

var INFINITY = 9999999999;

$(function(){
	
	//Playground Sprites
	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true});

	$.playground({refreshRate: 60}).addGroup("background", {posx: 0, posy: 0, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
					.end()
					.addGroup("dots", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
					.end()
					.addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
					.end()
					.addGroup( "hud", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
					.end();
	
	var hud = $("#hud");
	hud.append("<div id='scoreboard' class='scoreboard'><div class='subScoreboard'></div></div>");
	hud.append("<div id='lives' ><div id='life3' class='life'></div><div id='life2' class='life'></div><div id='life1' class='life'></div></div>");
	hud.append("<div id='scoreMessage'></div>");
	hud.append("<div id='message'></div>'");
	hud.append("<div id='level'></div>'");
	hud.append("<div id='levelNumber'></div>'");
	
	GUI.updateLevel( "Level" );
			
	var background = $("#background");
	var dotsGroup = $("#dots");
	var maze = Game.maze.structure;
	
	for( var i = 0; i < maze.length; i++ ) {
		var clazz = "";
		switch( maze[i]) {
			case -2:
				clazz = "bigDot";
				Game.dots[i] = "bigDot";
				break;
			case -1:
				clazz = "dot";
				Game.dots[i] = "dot";
				break;
			case 1:
				clazz = "corner1";
				break;
			case 2:
				clazz = "corner2";
				break;
			case 3:
				clazz = "corner3";
				break;
			case 4:
				clazz = "corner4";
				break;
			case 5:
				clazz = "squareCornerTopLeft";
				break;
			case 6:
				clazz = "squareCornerTopRight";
				break;
			case 7:
				clazz = "squareCornerBottomLeft";
				break;
			case 8:
				clazz = "squareCornerBottomRight";
				break;
			case 9:
				clazz = "horizontalMidDown";
				break;
			case 10:
				clazz = "verticalMidLeft";
				break;
			case 11:
				clazz = "verticalMidRight";
				break;
			case 12:
				clazz = "gate";
				break;
		}
		background.append('<div id="'+ i + '" class="tile ' + clazz +'"></div>');
		
		if(i % 28 == 27 ) {
			background.append('<div class="clear"></div>');
		}
	}

	// this is the function that control most of the game logic 
	$.playground().registerCallback(function(){
		if(jQuery.gameQuery.keyTracker[37]){ //this is left! (a)
			Game.hero.left();
		}
		if(jQuery.gameQuery.keyTracker[38]){ //this is up! (w)
			Game.hero.up();
		}
		if(jQuery.gameQuery.keyTracker[39]){ //this is right! (d)
			Game.hero.right();
		}
		if(jQuery.gameQuery.keyTracker[40]){ //this is down! (s)
			Game.hero.down();
		}
		
		$.each(Game.actors, function(index, actor ) {
			actor.move();
		});
		
		for( var i = Math.max(0, eatenBonus.length - 6), j = 0; i < eatenBonus.length; i++, j++) {
			$("#" +( BONUS_TILE + j)).removeClass().addClass("tile").addClass( eatenBonus[i] );
		}
		
	}, REFRESH_RATE);

	Sound.init(function(){
		$.playground().startGame( function() {
			Game.init();
		});
	});
	
});

var Sound = {
		soundList : [],
		
		init : function(callback) {
			if( SOUND_ACTIVATED ) {
				soundManager.setup({
				  	url: 'swf/'
				  });
					  
				Sound.soundList = {
						opening : new $.gameQuery.SoundWrapper('sound/opening.mp3', false),
						waka : new $.gameQuery.SoundWrapper('sound/wakawaka.mp3', false),
						fruit : new $.gameQuery.SoundWrapper('sound/eatingfruit.mp3', false),
						ghost : new $.gameQuery.SoundWrapper('sound/eatingghost.mp3', false),
						dies : new $.gameQuery.SoundWrapper('sound/dies.mp3', false)
					};
				soundManager.onready( callback );
			} else
				callback();
		},

		play: function( sound ) {
			if( SOUND_ACTIVATED )
				Sound.soundList[sound].play();
		},

		stop: function( sound ) {
			if( SOUND_ACTIVATED )
				Sound.soundList[sound].stop();
		},
}

var GUI = {
	updateMessage : function( message ) {
		GUI.drawText( $("#message"), message, true );
	},
	
	updateScoreMessage : function( message ) {
		GUI.drawText( $("#scoreMessage"), message, false, "red" );
	},

	updateLevel : function( message ) {
		GUI.drawText( $("#level"), message, false );
	},

	updateLevelNumber: function( message ) {
		GUI.drawText( $("#levelNumber"), message + "", false, "", true );
	},

	drawText : function( divHTML, message, center, customClazz, forceSmall) {
		var html = "";
		var clazz = "clock";
		var letterSize = 32;
		if( typeof customClazz !== "undefined" ) {
			clazz = " clock " + customClazz;
		}
			
		
		var count = 0;
		var width = 0;
		var height = 0;
		for( var i = 0; i < message.length; i++ ) {
			var letter = message[i];
			var iLetter = (message.charCodeAt(i) - 97);
			if( letter == " " ) {
				html += "<div class='blank'></div>";
				width += 16;
				count++;
			} else if( letter.charCodeAt(0) > 47 && letter.charCodeAt(0) < 58 ) {
				var letterSize = 32;
				if( forceSmall ) {
					letterSize = 16;
				}
				html += "<div class='" + clazz + (forceSmall ? "small" : "") + "' style='top: -50%;background-position: -" + ( parseInt( letter ) * letterSize) + "px -" + (forceSmall > -1 ? 128 : 0) +"px'></div>";
				count++;
			} else if( ( letter.charCodeAt(0) >= 'a'.charCodeAt(0) && letter.charCodeAt(0) <= 'z'.charCodeAt(0)) ) {
				if( height < 16 )
					height = 16;
				width += 16;
				var lineSize = 20;
				var x = (iLetter % lineSize) * 16;
				var y = Math.floor(iLetter / lineSize) * 16 + 144;
				html += "<div class='" + clazz + " small' style='background-position: -" + x + "px -" + y + "px'></div>";
				count++;
			} else if( letter.charCodeAt(0) >= 'A'.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0)) {
				iLetter = letter.charCodeAt(0) - 'A'.charCodeAt(0);
				if( height < 32 )
					height = 32;
				width += 32;
				var lineSize = 10;
				var x = (iLetter % lineSize) * 32;
				var y = Math.floor(iLetter / lineSize) * 32 + 32;
				html += "<div class='" + clazz + "' style='background-position: -" + x + "px -" + y + "px'></div>";
				count++;
			}
		}
		
		divHTML.empty();
		divHTML.css( "width", width + "px");
		divHTML.css( "height", height + "px");
		if( center )
			divHTML.css( "margin-left", "-" + (message.length * letterSize / 2) + "px");
		divHTML.append( html );
	}
}

function heriter(destination, source) { 
    function initClassIfNecessary(obj) { 
        if( typeof obj["_super"] == "undefined" ) { 
            obj["_super"] = function() { 
                var methodName = arguments[0]; 
                var parameters = arguments[1]; 
                this["__parent_methods"][methodName].apply(this, parameters); 
            } 
        } 
     
        if( typeof obj["__parent_methods"] == "undefined" ) { 
            obj["__parent_methods"] = {} 
        } 
    } 
 
    for (var element in source) { 
        if( typeof destination[element] != "undefined" ) { 
            initClassIfNecessary(destination); 
            destination["__parent_methods"][element] = source[element]; 
        } else { 
            destination[element] = source[element]; 
        } 
    } 
}


/** PausableTimer **/

function PausableTimer(func, millisec) {
	this.func = func;
	this.stTime = new Date().valueOf();
	this.timeout = setTimeout(func, millisec);
	this.timeLeft = millisec;
}

PausableTimer.prototype.stop = function() {
	clearTimeout(this.timeout);
};

PausableTimer.prototype.pause = function() {
	clearTimeout(this.timeout);
	var timeRan = new Date().valueOf()-this.stTime;
	this.timeLeft -= timeRan;
};

PausableTimer.prototype.resume = function() {
	this.timeout = setTimeout(this.func, this.timeLeft);
	this.stTime = new Date().valueOf();
};

//Usage:
//var myTimer = new PausableTimer(function(){alert("It works!");}, 2000);
//myTimer.pause();
//myTimer.unpause();


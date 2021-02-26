/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randReal(min, max) {
	return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Cumulative distribution function
 */
function pnorm(x, mean, sigma) 
{
	var z = (x-mean)/Math.sqrt(2*sigma*sigma);
	var t = 1/(1+0.3275911*Math.abs(z));
	var a1 =  0.254829592;
	var a2 = -0.284496736;
	var a3 =  1.421413741;
	var a4 = -1.453152027;
	var a5 =  1.061405429;
	var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
	var sign = 1;
	if(z < 0)
	{
		sign = -1;
	}
	return (1/2)*(1+sign*erf);
}

// @target	Desired value, 0% penalty
// @buffer	Range from the target value, 0% penalty
// @decay	Width of slope from 0% to 100% penalty
function normRange(target, buffer, decay) {
	function CDF(value) {
		let x = value - target;
		if (Math.abs(x) > buffer + decay)
			return 1;
		return 1 - (pnorm(x, -decay/2-buffer, decay/4) - pnorm(x, decay/2+buffer, decay/4));
	}
	return CDF.bind(this);
}

// Smoothsteps x between points a and b
function smoothstep(x, a, b) {
	let t = (x-a) / (b-a);
	return 3*t*t - 2*t*t*t;
}

function createSmoothstepPlateau(a, b, c, d, amp=1) {
	return function(x) {
		if (x <= a || x >= d) {
			return 0;
		}
		if (x >= b && x <= c) {
			return amp;
		}
		if (x > a && x < b) {
			return amp * smoothstep(x, a, b);
		}
		if (x > c && x < d) {
			return amp * smoothstep(x, d, c);
		}
	};
}


/**
 * Make string url friendly
 */
function lowercase(text) {
	return text
		.replace(/å/g, 'a')
		.replace(/Å/g, 'a')
		.replace(/ä/g, 'a')
		.replace(/Ä/g, 'a')
		.replace(/ö/g, 'o')
		.replace(/Ö/g, 'o')
		.toLowerCase();
}


// String format function
if ( !String.prototype.format ) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace( /{(\d+)}/g, function( match, number ) { 
			return typeof args[number] != 'undefined' ? args[number] : match;
		} );
	};
}


// Save cookie
function createCookie(name,value,days=3650) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

// Load cookie
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}


// Returns current date
function getDateAsString() {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	let yyyy = today.getFullYear();

	return '{0}-{1}-{2}'.format(yyyy, mm, dd);
}

// Check if variable is Object
function isPlainObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

// Creates Phaser text object
function createText(scene, x=0, y=0, size=20, color="#FFF", text="") {
	return scene.add.text(x, y, text, {
		fontFamily: game.font,
		fontSize: size + "px",
		fill: color
	});
}

function interpolateColor(color1, color2, value) {
	return Phaser.Display.Color.ObjectToColor(
		Phaser.Display.Color.Interpolate.ColorWithColor(
			Phaser.Display.Color.ColorToRGBA(color1),
			Phaser.Display.Color.ColorToRGBA(color2),
		100, value * 100)
	).color;
}


// General random-ish uuid
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
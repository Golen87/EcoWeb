/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randReal(min, max) {
	return Math.random() * (max - min) + min;
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
	function CDF(target, value) {
		let x = value - target;
		return 1 - (pnorm(x, -decay/2-buffer, decay/4) - pnorm(x, decay/2+buffer, decay/4));
	}
	return CDF.bind(this, target);
}
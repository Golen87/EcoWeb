let spareRandom = null;

function normalRandom()
{
	let val, u, v, s, mul;

	if(spareRandom !== null)
	{
		val = spareRandom;
		spareRandom = null;
	}
	else
	{
		do
		{
			u = Math.random()*2-1;
			v = Math.random()*2-1;

			s = u*u+v*v;
		} while(s === 0 || s >= 1);

		mul = Math.sqrt(-2 * Math.log(s) / s);

		val = u * mul;
		spareRandom = v * mul;
	}
	
	return val;
}

function normalRandomInRange(min, max)
{
	let val;
	do
	{
		val = normalRandom();
	} while(val < min || val > max);
	
	return val;
}

function normalRandomScaled(mean, stddev)
{
	let r = normalRandom();

	r = r * stddev + mean;

	return Math.round(r);
}

function lnRandomScaled(gmean, gstddev)
{
	let r = normalRandom();

	r = r * Math.log(gstddev) + Math.log(gmean);

	return Math.round(Math.exp(r));
}

function normalRandomSum(mean)
{
	let stddev = mean / 12;
	let r = normalRandom();

	r = r * stddev + mean;

	return r;
}

class EcoWeb {
	constructor() {
		// Number of species
		this.size = 4;
		// Current time step of simulation
		this.time = 0;
		// Initial population densities
		this.startPop = [];
		// Size of the population at a given time
		this.population = [];
		// Inherent per-capita growth rate
		this.r = [];
		// Species interactions. Positive value is benefitial. (1,1) is interspecies, such as competition for space.
		this.A = [];
		this.B = []; // Preferred value. Distance is harmful
		// ODE results from solve
		this.result = {
			x: [],
			y: []
		};
	}

	getComponent(name) {
		for (let i = 0; i < this.species.length; i++) {
			if (name == this.species[i].name) {
				return this.species[i];
			}
		}
	}

	build(species) {
		this.species = species;

		this.size = species.length;
		this.startPop = [];
		this.r = [];
		this.A = [];
		this.B = [];
		this.K = [];

		resetChart();

		for (let i = 0; i < species.length; i++) {
			let s = species[i];
			addSpecies(s.name, s.color);
			this.startPop[i] = (s.enable ? s.startPopulation : 0);
			this.r[i] = s.growthRate;
			this.K[i] = s.carryingCapacity;

			this.A[i] = [];
			this.B[i] = [];
			for (let j = 0; j < species.length; j++) {
				this.A[i][j] = 0.0;
				this.B[i][j] = null;

				if (i == j) {
					this.A[i][j] = s.selfCompetition;
				}
				else {
					let p = species[j];

					if (s.relationship[p.name])
						this.A[i][j] = s.relationship[p.name];

					if (s.requirements[p.name] != null)
						this.B[i][j] = s.requirements[p.name];
				}
			}
		}

		this.reset();
	}

	reset() {
		this.time = 0;
		this.population = [...this.startPop];
		this.result = {
			x: [],
			y: []
		};
	}

	// Randomize interaction matrix (A) to get more interersting patterns
	initWiggle() {
		this.wiggle = [];
		for (let i = 0; i < this.size; i++) {
			this.wiggle[i] = [];
			for (let j = 0; j < this.size; j++) {
				this.wiggle[i][j] = randReal(0.9, 1.1);
			}
		}
		this.applyWiggle();
	}

	applyWiggle() {
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				this.A[i][j] *= this.wiggle[i][j];
			}
		}
	}

	solve(duration) {
		// Lotka-Volterra equation (classical model for predator-prey interaction)
		let f = function(t, x) {
			let dxList = [];
			for (let i = 0; i < x.length; i++) {

				let sum = 0;
				for (let j = 0; j < x.length; j++) {
					if (this.A[i][j] != null) {
						sum += this.A[i][j] * x[j];
					}
					if (this.B[i][j] != null) {
						sum -= this.B[i][j](x[j]);
					}
				}

				// Impact on the environment resulting from consumption
				//let I = x[i] * this.K[i];
				let I = this.K[i];

				let dx = x[i] * ( this.r[i] + sum ) / I;
				dxList.push(dx);
			}
			return dxList;
		}

		// Now we solve the ODE:
		//sol = numeric.dopri(0,20,[-1,3,4],f,1e-6,2000);
		let start = this.time;
		let end = start + duration;
		let sol = numeric.dopri(start, end, this.population, f.bind(this), 1e-6, 2000);
		this.population = sol.y[sol.y.length-1];
		this.time = end;

		this.result.x.push(...sol.x);
		this.result.y.push(...sol.y);
	}

	stabilize() {
		this.build(this.species);
		this.applyWiggle();
		this.solve(1000);
		for (let i = 0; i < this.size; i++) {
			this.species[i].startPopulation = this.result.y[this.result.y.length-1][i];
		}
	}
}


function scenario_1 () {
	//	var						name		pop		growth	self	color
	let grass	= new Organism( "Grass",	1.0,	1.00,	-1.0,	'#8BC34A' );
	let berry	= new Organism( "Berry",	1.0,	1.00,	-1.0,	'#4CAF50' );
	let rabbit	= new Organism( "Rabbit",	0.1,	-0.01,	-0.1,	'#2196F3' );
	let deer	= new Organism( "Deer",		0.1,	-0.01,	-0.1,	'#3F51B5' );
	let fox		= new Organism( "Fox",		0.1,	-0.01,	-0.1,	'#F44336' );

	addRelationship( rabbit,	0.1,	grass,	-1.0 );
	addRelationship( rabbit,	0.1,	berry,	-1.0 );
	addRelationship( deer,		0.1,	grass,	-1.0 );
	addRelationship( fox,		0.1,	rabbit,	-1.0 );
	addRelationship( fox,		0.02,	deer,	-0.2 );

	return [grass, berry, rabbit, deer, fox];
}

function scenario_2 () {
	//	var						name		pop		growth	self	color
	let blabar	= new Organism( "Blåbär",	1.0,	1.0,	-1.0,	'#536DFE');
	let orter	= new Organism( "Örter",	1.0,	1.0,	-1.0,	'#26A69A');
	let gras	= new Organism( "Gräs",		1.0,	1.0,	-1.0,	'#66BB6A');
	let svamp	= new Organism( "Svamp",	1.0,	1.0,	-1.0,	'#AFB42B');
	let hare	= new Organism( "Hare",		0.1,	-0.01,	-0.1,	'#FFD54F');
	let radjur	= new Organism( "Rådjur",	0.1,	-0.05,	-0.1,	'#FFA726');
	let rav		= new Organism( "Räv",		0.1,	-0.05,	-0.1,	'#FF3D00');

	const S = 1/40;
	const M = 2/40;
	const L = 4/40;

	hare.eats	( blabar,	S );
	hare.eats	( orter,	L );
	hare.eats	( gras,		L );
	radjur.eats	( blabar,	M );
	radjur.eats	( orter,	L );
	radjur.eats	( gras,		S );
	radjur.eats	( svamp,	M );
	rav.eats	( blabar,	S );
	rav.eats	( hare,		L );
	rav.eats	( radjur,	M );

	return [blabar, orter, gras, svamp, hare, radjur, rav];
}

function scenario_3 () {
	//	var						name			pop		growth	self	color
	let sur		= new Organism(	"Sur växt",		1.0,	1.0,	-1.0,	'#FF3D00',	"plant" );
	let normal	= new Organism(	"Normal växt",	1.0,	1.0,	-1.0,	'#66BB6A',	"plant" );
	let basisk	= new Organism(	"Basisk växt",	1.0,	1.0,	-1.0,	'#536DFE',	"plant" );
	let ph		= new Organism(	"PH värde",		0.01,	0.1,	-0.1,	'#9E9E9E',	"component" );

	// target value, healthy range, decay range
	sur.requires	( ph, normRange(0.0, 0.1, 0.5) );
	normal.requires	( ph, normRange(0.5, 0.1, 0.5) );
	basisk.requires	( ph, normRange(1.0, 0.1, 0.5) );

	addEqualCompetition([sur, normal, basisk], -0.05);
	//this.A[i][j] -= 0.05;

	return [sur, normal, basisk, ph];
}


let web = new EcoWeb();

window.onload = function() {
	web.build(scenario_2());
	web.initWiggle();
	web.solve(100);

	initChart();

	createGraphTools(web.species);
}
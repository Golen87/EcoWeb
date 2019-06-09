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

		this.scenarios = [];
	}

	setScenarios(scenarios) {
		this.scenarios = scenarios;
	}

	startScenario(i) {
		web.build(this.scenarios[i]());
		web.initWiggle();
		web.solve(100);
		updateChart();

		if (!this.vue) {
			this.vue = createGraphTools(this.species, this.scenarios);
		}
		this.vue.species = this.species;
		this.vue.scenarios = this.scenarios;
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
			addSpecies(s.name, s.color, s.showGraph);
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
		/*
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				this.A[i][j] *= this.wiggle[i][j];
			}
		}
		*/
	}

	solve(duration) {
		// Lotka-Volterra equation (classical model for predator-prey interaction)
		let f = function(t, pop) {
			// Calculate interactions for diet
			let matrix = [];
			for (let i = 0; i < pop.length; i++) {
				matrix[i] = [];
				for (let j = 0; j < pop.length; j++) {
					matrix[i][j] = 0;
				}
			}

			for (let i = 0; i < pop.length; i++) {
				let s = this.species[i];
				let eating = [];
				let total = 0.0;
				for (let j = 0; j < pop.length; j++) {
					let p = this.species[j];
					let amount = s.diet[p.name] || 0.0;
					eating[j] = amount * pop[j];
					total += eating[j];
				}
				if (total > 0) {
					for (let j = 0; j < pop.length; j++) {
						matrix[i][j] +=  0.3 * eating[j] / total; // Predator
						matrix[j][i] += -1.0 * eating[j] / total; // Prey
						//console.log(s.name, 'eats', this.species[j].name, this.A[i][j], this.A[j][i]);
					}
				}
				//matrix[i][i] = s.selfCompetition;
			}
			for (let i = 0; i < pop.length; i++) {
				for (let j = 0; j < pop.length; j++) {
					matrix[i][j] += this.A[i][j];
					//matrix[i][j] *= this.wiggle[i][j];
				}
			}

			// Calculate population derivative
			let dPopList = [];
			for (let i = 0; i < pop.length; i++) {

				let sum = 0;
				for (let j = 0; j < pop.length; j++) {
					if (matrix[i][j] != null) {
						sum += matrix[i][j] * pop[j];
					}
					if (this.B[i][j] != null) {
						sum -= this.B[i][j](pop[j]);
					}
				}

				// Impact on the environment resulting from consumption
				//let I = pop[i] * this.K[i];
				let I = this.K[i];

				dPopList[i] = pop[i] * ( this.r[i] + sum ) / I;
			}
			return dPopList;
		}

		// ODE Solver
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
	const L = 3/40;

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

	addEqualCompetition([blabar, orter, gras, svamp], -0.05);

	return [blabar, orter, gras, svamp, hare, radjur, rav];
}

function scenario_3 () {
	//	var						name			pop		growth	self	color
	let sur		= new Organism(	"Sur växt",		1.0,	1.0,	-1.0,	'#FF3D00',	"plant" );
	let normal	= new Organism(	"Normal växt",	1.0,	1.0,	-1.0,	'#66BB6A',	"plant" );
	let basisk	= new Organism(	"Basisk växt",	1.0,	1.0,	-1.0,	'#536DFE',	"plant" );
	let ph		= new Organism(	"PH värde",		0.01,	0.1,	-0.1,	'#9E9E9E',	"component" );

	// target value, healthy range, decay range
	sur.requires	( ph, normRange(0.4, 0.1, 0.5) );
	normal.requires	( ph, normRange(0.5, 0.1, 0.5) );
	basisk.requires	( ph, normRange(0.6, 0.1, 0.5) );

	addEqualCompetition([sur, normal, basisk], -0.05);

	return [sur, normal, basisk, ph];
}

function scenario_4 () {
	//	var						name		pop		growth	self	color
	let hare	= new Herbivore( "Hare",	0.1,	-0.05,	-0.1,	'#FFD54F');
	let radjur	= new Herbivore( "Rådjur",	0.1,	-0.05,	-0.1,	'#FFA726');
	let dovhjort= new Herbivore( "Dovhjort",0.1,	-0.05,	-0.1,	'#FB8C00');
	let koltrast= new Herbivore( "Koltrast",0.1,	-0.05,	-0.1,	'#FFF176');
	let rodrav	= new Carnivore( "Rödräv",	0.1,	-0.05,	-0.1,	'#FF3D00');

	let blabar	= new Plant( "Blåbär",	1.0,	1.0,	-1.0,	'#536DFE');
	let trad	= new Plant( "Träd",	1.0,	1.0,	-1.0,	'#795548');
	let gras	= new Plant( "Gräs",	1.0,	1.0,	-1.0,	'#66BB6A');
	let orter	= new Plant( "Örter",	1.0,	1.0,	-1.0,	'#26A69A');
	let svamp	= new Plant( "Svamp",	1.0,	1.0,	-1.0,	'#AFB42B');

	// namn			ålder	mat		barn
	// Dovhjort		14.0	3.5		1.2
	// Rådjur 		10.0	3.0		2.0
	// Hare			3.5		2.5		12.0
	// Koltrast		3.0		0.3		10.0
	// Räv			3.5		1.0		4.0

	dovhjort.setDiet(
		trad,	1.0,
		orter,	0.6,
		blabar,	0.4,
		gras,	0.2,
	);
	radjur.setDiet(
		orter,	1.0,
		trad,	0.6,
		svamp,	0.3,
		blabar,	0.2,
		gras,	0.1,
	);
	hare.setDiet(
		orter,	1.0,
		blabar,	0.7,
		gras,	0.4,
		trad,	0.2,
	);
	koltrast.setDiet(
		trad,	1.0,
		blabar,	0.6,
		svamp,	0.6,
	);
	rodrav.setDiet(
		hare,		1.0,
		blabar,		0.6,
		svamp,		0.4,
		dovhjort,	0.2,
		radjur,		0.2,
		koltrast,	0.2,
	);

	addEqualCompetition([hare, radjur, dovhjort, koltrast], -0.01);
	addEqualCompetition([blabar, trad, gras, orter, svamp], -0.05);

	return [hare, radjur, dovhjort, koltrast, rodrav, blabar, trad, gras, orter, svamp];
}


let web = new EcoWeb();

window.onload = function() {
	initChart();

	web.setScenarios([
		scenario_4,
		scenario_1,
		scenario_2,
		scenario_3,
	]);
	web.startScenario(0);
	//web.build(scenario_4());
	//web.initWiggle();
	//web.solve(100);
}
class EcoWeb {
	constructor() {
		// Number of species
		this.size = 4;
		// Current time step of simulation
		this.time = 0;
		this.maxTime = 120;
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
		this.events = [];
		this.activeEvents = [];
	}

	setScenarios(scenarios) {
		this.scenarios = scenarios;
	}

	startScenario(i) {
		this.activeEvents = [];

		web.build(this.scenarios[i]());
		web.initWiggle();
		web.stabilize();
		web.solve(this.maxTime);
		updateChart();

		if (!this.vue) {
			this.vue = createGraphTools(this.species, this.scenarios);
		}
		this.vue.species = this.species;
		this.vue.scenarios = this.scenarios;
	}

	getComponent(name) {
		for (let i = 0; i < this.species.length; i++) {
			if (lowercase(name) == lowercase(this.species[i].name)) {
				return this.species[i];
			}
		}
		console.error("Unknown component:", name);
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

		this.events = [
			//new Event("Förgifta Rävar", function() {
			//	this.A[0][0] -= 0.5;
			//	console.log("Apply event: Fox poison");
			//}.bind(this)),

			//new Event("Plantera Rävar", function() {
			//	this.population[0] += 0.5;
			//	console.log("Apply event: Adding more foxes");
			//}.bind(this)),

			new Event("Stödmata",
				`Stödmatar man så ser man till så att hjortdjuren i ett område får extra mat över vintern så att färre dör på grund av svält.
				\nDet är vanligt att man gör detta så att man kan skjuta fler av dem under jaktsäsongen utan att det blir för få individer i ett område.`,
				function() {
					//this.population[0] += 0.5;
			}.bind(this)),

			new Event("Plantera Lo",
				`Planterar man in lodjur i ett område så kommer de att börja jaga de andra djuren i det. Lodjur är en hyperkarnivor vilket betyder att deras diet är mestadels kött och de kan inte överleva på en växtbaserad diet.,
				\nLodjuren gillar främst att jaga stora hovdjur så som dovhjort och rådjur. De äter också mycket skogsharar och koltrastar, och kan även ta sig en räv ibland.`,
				function() {
					//this.population[0] += 0.5;
			}.bind(this)),

			new Event("Jaga Räv",
				`Man kan skicka ut jägare för att jaga räv, man kan jaga dem med ett drev hundar, lura dem nära med åtel och sedan skjuta dem, skicka in hundar i deras gryt, eller sätta ut fällor.,
				\nMinskar man rävpopulationen på detta vis så gynnar man mest smådjur så som skogsharar och koltrastar.`,
				function() {
					this.A[0][0] -= 0.2;
					this.A[1][1] += 0.05;
					console.log("Apply event: Fox hunting");
			}.bind(this)),

			new Event("Plantera Skog",
				`Man kan plantera träd och på så vis få en större areal av landskapet att bli skog.,
				\nMånga djur gynnas av skogen så som harar och rådjur, men även svampar och växter så som blåbär kan också gynnas av att det blir mer skog i landskapet.`,
				function() {
					//this.population[0] += 0.5;
			}.bind(this)),

			new Event("Skövla Skog",
				`Man kan hugga ned hela skogen och på så vis bli av med alla träd.,
				\nMånga djur mår dåligt av att skogen försvinner så som dovhjort, rådjur, harar, rävar, och koltrastar. Även växter kan skadas av att skogen försvinner, blåbär tillexempel är beroende av skogen för sin överlevnad, samt många svamparter.`,
				function() {
					this.A[6][6] -= 1.0;
					//this.population[0] += 0.5;
			}.bind(this)),
		];

		this.reset();
	}

	refresh() {
		web.build(this.species);
		web.applyWiggle();
		web.solve(this.maxTime);
		updateChart();
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
		//for (let i = 0; i < this.size; i++) {
		//	for (let j = 0; j < this.size; j++) {
		//		this.A[i][j] *= this.wiggle[i][j];
		//	}
		//}
	}

	setEvent(time, event) {
		for (var i = this.activeEvents.length - 1; i >= 0; i--) {
			if (this.activeEvents[i].time == time) {
				this.activeEvents.splice(i, 1);
			}
		}
		if (event) {
			this.activeEvents.push(new ActiveEvent(time, event));
		}

		this.refresh();
	}

	applyEvent(event) {
		event.callback();
	}

	solve(duration) {
		this.activeEvents.sort((a,b) => (a.time > b.time) ? 1 : -1);

		for (var i = 0; i < this.activeEvents.length; i++) {
			if (this.activeEvents[i].time >= this.time) {
				this.solveSection(this.activeEvents[i].time - this.time);
				this.applyEvent(this.activeEvents[i].event);
			}
			else {
				console.warn("Event out of scope at", this.activeEvents[i].time);
			}
		}
		this.solveSection(duration - this.time);
	}

	solveSection(duration) {
		console.log("Solving", this.time, "-", (this.time+duration));
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
		this.population = [...sol.y[sol.y.length-1]]; // Copy
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

	getValueAt(speciesIndex, pos) {
		if (pos <= this.result.x[0]) {
			return this.result.y[0][speciesIndex];
		}
		if (pos >= this.result.x[this.result.x.length-1]) {
			return this.result.y[this.result.x.length-1][speciesIndex];
		}

		// Binary search for closest x pair
		let index = Math.floor(this.result.x.length / 2);
		let step = Math.floor(index / 2);
		while (this.result.x[index] > pos || pos > this.result.x[index+1]) {
			if (this.result.x[index] < pos) {
				index += step;
			}
			else {
				index -= step;
			}
			step = Math.ceil(step / 4);
		}

		let minX = this.result.x[index];
		let maxX = this.result.x[index+1];
		let minY = this.result.y[index][speciesIndex];
		let maxY = this.result.y[index+1][speciesIndex];

		if (minX == maxX || minY == maxY) {
			return minY;
		}
		else {
			let slope = (maxY - minY) / (maxX - minX);
			return minY + slope * (pos - minX);
		}
	}
}


function scenario_1 () {
	//	var						name		pop		growth	self	color
	let grass	= new Organism( "Grass",	1.0,	1.00,	-1.0,	'gräs',		'#8BC34A' );
	let berry	= new Organism( "Berry",	1.0,	1.00,	-1.0,	'blåbär',	'#4CAF50' );
	let rabbit	= new Organism( "Rabbit",	0.1,	-0.01,	-0.1,	'hare',		'#2196F3' );
	let deer	= new Organism( "Deer",		0.1,	-0.01,	-0.1,	'rådjur',	'#3F51B5' );
	let fox		= new Organism( "Fox",		0.1,	-0.01,	-0.1,	'räv',		'#F44336' );

	addRelationship( rabbit,	0.1,	grass,	-1.0 );
	addRelationship( rabbit,	0.1,	berry,	-1.0 );
	addRelationship( deer,		0.1,	grass,	-1.0 );
	addRelationship( fox,		0.1,	rabbit,	-1.0 );
	addRelationship( fox,		0.02,	deer,	-0.2 );

	return [grass, berry, rabbit, deer, fox];
}

function scenario_2 () {
	//	var						name		pop		growth	self	color
	let blabar	= new Organism( "Blåbär",	1.0,	1.0,	-1.0,	'blåbär',	'#536DFE');
	let orter	= new Organism( "Örter",	1.0,	1.0,	-1.0,	'ört',		'#26A69A');
	let gras	= new Organism( "Gräs",		1.0,	1.0,	-1.0,	'gräs',		'#66BB6A');
	let svamp	= new Organism( "Svamp",	1.0,	1.0,	-1.0,	'svamp',	'#AFB42B');
	let hare	= new Organism( "Hare",		0.1,	-0.01,	-0.1,	'hare',		'#FFD54F');
	let radjur	= new Organism( "Rådjur",	0.1,	-0.05,	-0.1,	'rådjur',	'#FFA726');
	let rav		= new Organism( "Räv",		0.1,	-0.05,	-0.1,	'räv',		'#FF3D00');

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
	let sur		= new Organism(	"Sur växt",		1.0,	1.0,	-1.0,	'gräs',		'#FF3D00',	"plant" );
	let normal	= new Organism(	"Normal växt",	1.0,	1.0,	-1.0,	'gräs',		'#66BB6A',	"plant" );
	let basisk	= new Organism(	"Basisk växt",	1.0,	1.0,	-1.0,	'gräs',		'#536DFE',	"plant" );
	let ph		= new Organism(	"PH värde",		0.01,	0.1,	-0.1,	'missing',	'#9E9E9E',	"component" );

	// target value, healthy range, decay range
	sur.requires	( ph, normRange(0.4, 0.1, 0.5) );
	normal.requires	( ph, normRange(0.5, 0.1, 0.5) );
	basisk.requires	( ph, normRange(0.6, 0.1, 0.5) );

	addEqualCompetition([sur, normal, basisk], -0.05);

	return [sur, normal, basisk, ph];
}

function scenario_4 () {
	//	var						name		pop		growth	self	image		color
	let rodrav	= new Carnivore( "Rödräv",	0.1,	-0.05,	-0.1,	'räv',		'#FF3D00' );

	let hare	= new Herbivore( "Hare",	0.1,	-0.05,	-0.1,	'hare',		'#FFD54F' );
	let radjur	= new Herbivore( "Rådjur",	0.1,	-0.05,	-0.1,	'rådjur',	'#FFA726' );
	let dovhjort= new Herbivore( "Dovhjort",0.1,	-0.05,	-0.1,	'dovhjort',	'#FB8C00' );
	let koltrast= new Herbivore( "Koltrast",0.1,	-0.05,	-0.1,	'koltrast',	'#FFF176' );

	let blabar	= new Plant( "Blåbär",	1.0,	1.0,	-1.0,	'blåbär',	'#536DFE' );
	let trad	= new Plant( "Träd",	1.0,	1.0,	-1.0,	'träd',		'#795548' );
	let gras	= new Plant( "Gräs",	1.0,	1.0,	-1.0,	'gräs',		'#66BB6A' );
	let orter	= new Plant( "Örter",	1.0,	1.0,	-1.0,	'ört',		'#26A69A' );
	let svamp	= new Plant( "Svamp",	1.0,	1.0,	-1.0,	'svamp',	'#AFB42B' );

	// namn			ålder	mat		barn
	// Dovhjort		14.0	3.5		1.2
	// Rådjur 		10.0	3.0		2.0
	// Hare			3.5		2.5		12.0
	// Koltrast		3.0		0.3		10.0
	// Räv			3.5		1.0		4.0

	rodrav.setDiet(
		hare,		0.6,
		blabar,		0.6,
		svamp,		0.4,
		dovhjort,	0.2,
		radjur,		0.2,
		koltrast,	0.2,
	);
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

	addEqualCompetition([hare, radjur, dovhjort, koltrast], -0.01);
	addEqualCompetition([blabar, gras, orter], -0.05);

	blabar.requires(trad, normRange(0.7, 0.2, 0.4));
	svamp.requires(trad, normRange(0.7, 0.3, 0.5));

	return [rodrav, hare, radjur, dovhjort, koltrast, blabar, trad, gras, orter, svamp];
}


let web = new EcoWeb();

//window.onload = function() {
function initWeb() {
	initChart();

	web.setScenarios([
		scenario_4,
		scenario_1,
		scenario_2,
		scenario_3,
	]);
	//web.startScenario(0);

	//web.build(scenario_4());
	//web.initWiggle();
	//web.solve(100);

	let database = new Database();
}
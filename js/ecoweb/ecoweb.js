class EcoWeb {
	constructor() {
		// Number of species
		this.size = 4;
		// Current time step of simulation
		this.time = 0;
		this.maxTime = 200;
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

		this.events = [];
		this.activeEvents = [];
	}

	startScenario(i) {
		this.currentScenarioIndex = i;
		this.activeEvents = [];

		this.currentScenario = new Scenario(window.database.scenarios[i]);
		this.build(this.currentScenario.species);
		this.maxTime = this.currentScenario.maxTime;

		for (const event of this.currentScenario.events) {
			this.events.push(event);
			if (event.type == "automatic") {
				this.setEvent(event, event.autoTime);
			}
		}

		//this.stabilize();
		this.solve(this.maxTime);
		updateChart();

		if (!this.vue) {
			this.vue = createGraphTools();
		}
		this.vue.species = this.species;
	}

	restart() {
		this.startScenario(this.currentScenarioIndex);
	}

	getSpeciesIndex(name) {
		for (let i = 0; i < this.species.length; i++) {
			if (lowercase(name) == lowercase(this.species[i].name)) {
				return i;
			}
		}
		console.error("Unknown component:", name);
	}

	getComponent(name) {
		this.species[this.getSpeciesIndex(name)];
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
						this.A[i][j] = s.relationship[p.name] * s.getFoodAmount();

					if (s.requirements[p.name] != null)
						this.B[i][j] = s.requirements[p.name];
				}
			}
		}

		/*
		this.events = [
			new BaseEvent("Stödmata", "detrius",
				`Stödmatar man så ser man till så att hjortdjuren i ett område får extra mat över vintern så att färre dör på grund av svält.
				\nDet är vanligt att man gör detta så att man kan skjuta fler av dem under jaktsäsongen utan att det blir för få individer i ett område.`,
				function() {
					console.log("Apply event:", "Stödmata");
					let d = this.getSpeciesIndex("Dovhjort");
					let r = this.getSpeciesIndex("Rådjur");
					this.r[d] /= 1.5; // Öka growth rate
					this.r[r] /= 1.5; // Öka growth rate
			}.bind(this)),

			new BaseEvent("Plantera skog", "träd",
				`Man kan plantera träd och på så vis få en större areal av landskapet att bli skog.
				\nMånga djur gynnas av skogen så som harar och rådjur, men även svampar och växter så som blåbär kan också gynnas av att det blir mer skog i landskapet.`,
				function() {
					console.log("Apply event:", "Plantera skog");
					let t = this.getSpeciesIndex("Träd");
					this.population[t] += 0.25;
			}.bind(this)),

			new BaseEvent("Avverka skog", "träd",
				`Man kan hugga ned hela skogen och på så vis bli av med alla träd.
				\nMånga djur mår dåligt av att skogen försvinner så som dovhjort, rådjur, harar, rävar, och koltrastar. Även växter kan skadas av att skogen försvinner, blåbär tillexempel är beroende av skogen för sin överlevnad, samt många svamparter.`,
				function() {
					console.log("Apply event:", "Avverka skog");
					let t = this.getSpeciesIndex("Träd");
					this.population[t] *= 0.0;
			}.bind(this)),

			new BaseEvent("Plantera in lodjur", "lo",
				`Planterar man in lodjur i ett område så kommer de att börja jaga de andra djuren i området. Lodjur är en hyperkarnivor vilket betyder att deras diet är mestadels kött och de kan inte överleva på en växtbaserad diet.
				\nLodjuren gillar främst att jaga stora hovdjur så som dovhjort och rådjur. De äter också mycket skogsharar och koltrastar, och kan även ta sig en räv ibland.`,
				function() {
					console.log("Apply event:", "Plantera in lodjur");
					let l = this.getSpeciesIndex("Lo");
					let d = this.getSpeciesIndex("Dovhjort");
					let r = this.getSpeciesIndex("Rådjur");
					this.population[l] += 0.1; // Lägg till lo
					this.A[r][d] = 0; // Ta bort rådjurs-dovhjorts straff
			}.bind(this)),

			new BaseEvent("Jaga räv", "räv",
				`Man kan skicka ut jägare för att jaga räv, man kan jaga dem med ett drev hundar, lura dem nära med åtel och sedan skjuta dem, skicka in hundar i deras gryt, eller sätta ut fällor.
				\nMinskar man rävpopulationen på detta vis så gynnar man mest smådjur så som skogsharar och koltrastar.`,
				function() {
					console.log("Apply event:", "Jaga räv");
					let r = this.getSpeciesIndex("Rödräv");
					console.log(this.r[r]);
					this.r[r] *= 2;
					console.log(this.r[r]);
			}.bind(this)),
		];
		*/

		this.reset();
	}

	refresh() {
		this.build(this.species);
		this.solve(this.maxTime);
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

	setEvent(event, time) {
		/*for (var i = this.activeEvents.length - 1; i >= 0; i--) {
			if (this.activeEvents[i].time == time) {
				this.activeEvents.splice(i, 1);
			}
		}*/
		if (event) {
			this.activeEvents.push(new ActiveEvent(event, time));
		}

		//this.refresh();
	}

	applyEvent(event) {
		console.log("> Apply event:", event.name, event.effects);

		for (const effect of event.effects) {
			console.log(effect.node.name, effect.something);

			let i = this.getSpeciesIndex(effect.node.name);
			console.log(effect.node.name, i);
			this.population[i] -= effect.something;
			//this.A[r][d] = 0; // Ta bort rådjurs-dovhjorts straff
		}
	}

	getActivityMap() {
		let map = {};
		for (let i = 0; i < this.species.length; i++) {
			const id = this.species[i].id;
			map[id] = [];

			for (const activeEvent of this.activeEvents) {
				if (activeEvent.active) {
					for (const effect of activeEvent.event.effects) {
						if (id == effect.node.id) {
							effect.startTime = activeEvent.startTime;
							map[id].push(effect);
						}
					}
				}
			}
		}
		return map;
	}

	solve(duration) {
		let timestamps = [];
		for (const event of this.activeEvents) {
			timestamps.push({
				activeEvent: event,
				time: event.startTime,
				value: true
			});
			timestamps.push({
				activeEvent: event,
				time: event.endTime,
				value: false
			});
		}
		timestamps.sort((a,b) => (a.time > b.time) ? 1 : -1);

		for (var i = 0; i < timestamps.length; i++) {
			const activeEvent = timestamps[i].activeEvent;
			const time = timestamps[i].time;

			if (time >= duration) {
				break;
			}

			if (time >= this.time) {
				this.solveSection(time - this.time, this.getActivityMap());
				//this.applyEvent(this.activeEvents[i].event);
			}
			else {
				console.warn("Event out of scope at", time);
			}

			console.log("> Turning " + (timestamps[i].value ? "on " : "off ") + activeEvent.event.name + " at " + time);
			activeEvent.setActive(timestamps[i].value);
		}
		this.solveSection(duration - this.time, this.getActivityMap());
	}

	solveSection(duration, activityMap={}) {
		if (duration <= 0)
			return;

		console.log("> Solving", this.time, "-", (this.time+duration));
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
						//let sigmoid_eating = eating[j] / total;
						let sigmoid_eating = Phaser.Math.Easing.Cubic.InOut(eating[j] / total);
						matrix[i][j] += 0.3 * sigmoid_eating; // Predator
						matrix[j][i] += -1.0 * sigmoid_eating; // Prey
						//console.log(s.name, 'eats', this.species[j].name, this.A[i][j], this.A[j][i]);
					}
				}
				//matrix[i][i] = s.selfCompetition;
			}
			for (let i = 0; i < pop.length; i++) {
				for (let j = 0; j < pop.length; j++) {
					matrix[i][j] += this.A[i][j];
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

				if (pop[i] < DEATH_THRESHOLD || pop[i] > 100) {
					dPopList[i] = 0;
				}
				else {
					dPopList[i] = pop[i] * ( this.r[i] + sum );
				}


				if (this.species[i].popFuncDt) {
					dPopList[i] = this.species[i].popFuncDt.evaluate({t});
				}


				// Events
				let node = this.species[i];
				if (activityMap[node.id]) {
					for (const effect of activityMap[node.id]) {
						const value = effect.derivative.evaluate({t: (t-effect.startTime) / effect.duration});
						dPopList[i] += effect.something * value / effect.duration;
						//const value = effect.derivative.evaluate({t: t-this.time});
						//dPopList[i] += value;
					}
				}
			}

			return dPopList;
		}

		// ODE Solver
		let start = this.time;
		let end = start + duration;
		let sol = numeric.dopri(start, end, this.population, f.bind(this), 1e-6, 2000);
		this.population = [...sol.y[sol.y.length-1]]; // Copy
		this.time = end;

		if (sol.x[0] == this.result.x[this.result.x.length-1]) {
			this.result.x.pop();
			this.result.y.pop();
		}

		this.result.x.push(...sol.x);
		this.result.y.push(...sol.y);
	}

	stabilize() {
		this.build(this.species);
		this.solve(10 * this.maxTime);
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
	let rodrav	= new Carnivore( "Rödräv",	0.1,	-0.05,	-0.01,	'räv',		'#FF3D00' );
	let lo		= new Carnivore( "Lo",		0.0,	-0.05,	-0.01,	'lo',		'#FF7D00' );

	let hare	= new Herbivore( "Hare",	0.1,	-0.05,	-0.01,	'hare',		'#FFD54F' );
	let radjur	= new Herbivore( "Rådjur",	0.1,	-0.05,	-0.01,	'rådjur',	'#FFA726' );
	let dovhjort= new Herbivore( "Dovhjort",0.1,	-0.05,	-0.01,	'dovhjort',	'#FB8C00' );
	let koltrast= new Herbivore( "Koltrast",0.1,	-0.05,	-0.01,	'koltrast',	'#FFF176' );

	let blabar	= new Plant( "Blåbär",	1.0,	1.0,	-1.0,	'blåbär',	'#536DFE' );
	let trad	= new Plant( "Träd",	1.0,	0.1,	-0.01,	'träd',		'#795548' );
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
		hare,		0.5,
		blabar,		0.4,
		svamp,		0.2,
		dovhjort,	0.2,
		radjur,		0.2,
		koltrast,	0.6,
	);
	lo.setDiet(
		hare,		0.1,
		dovhjort,	0.9,
		radjur,		0.4,
		koltrast,	0.2,
	);
	dovhjort.setDiet(
		trad,	0.5,
		orter,	0.6,
		blabar,	0.4,
		gras,	0.5,
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

	//addEqualCompetition([hare, radjur, dovhjort, koltrast], -0.01);
	//addEqualCompetition([blabar, gras, orter], -0.05);

	addRelationship( dovhjort,	0.0,	radjur,	-0.05 );

	blabar.requires(trad, normRange(0.7, 0.2, 0.4));
	svamp.requires(trad, normRange(0.7, 0.3, 0.5));

	return [rodrav, lo, hare, radjur, dovhjort, koltrast, blabar, trad, gras, orter, svamp];
}

// TVÅ NYA SCENARIER
// Kattuggla – skogssork – hasselbuskar
// Problem: Under förra vintern låg snön djup under en lång tid. Det innebar att kattugglepopulationen minskade kraftigt. Du vill återigen ha fler kattugglor i din skog. Hur kan du få dess population att öka?
// Lösning: Genom att öppna upp kring hasselsnåren (buskar) så kan du öka antalet hasselnötter som bildas. Skogssorken är kattugglans huvudföda och skogssorkens huvudföda är hasselnötter. Fler hasselnötter kommer att ge fler kattugglor. 

// Räv – dovhjort – träd
// Problem: För några år sen planterade du ett fint bestånd aspar i skogen.  Under senare år har antalet dovhjortar ökat kraftigt och de äter på de små asparna och gör så de dör. Hur kan du få populationen dovhjort att minska?
// Lösning: Du har ett fint bergigt parti i din skog som skulle passa för lodjur. En orienteringsklubb brukar springa mycket där och därför slår sig inte lodjuren ner där. Du erbjuder föreningen en annan (bättre!) plats att träna och då kn lodjuren flytta in. Lodjuren äter mycket dovhjort och på så sätt gåt deras population ner och asparna kan återhämta sig. 



let web = new EcoWeb();
const DEATH_THRESHOLD = 1E-3;

//window.onload = function() {
function initWeb() {
	initChart();

	// Global
	window.database = new Database();
}
class Simulator2 {
	constructor() {
		this.simTime = 20;
	}

	loadScenario(scenarioData) {
		this.scenario = new Scenario(scenarioData);

		this.time = 0;
		this.history = {x:[], y:[]};
		this.population = [];
		this.growthRate = [];
		this.carryingCapacity = [];
		this.interactionMatrix = [];
		this.relationMap = {};

		const L = this.species.length;

		// Init arrays for x, r, alpha
		for (let i = 0; i < L; i++) {
			this.population[i] = 0;

			this.growthRate[i] = (this.species[i].type == 'animal') ? -0.1 : 1;
			// this.growthRate[i] = 1;

			// this.carryingCapacity[i] = (this.species[i].type == 'plant') ? 2 : 1;
			this.carryingCapacity[i] = 1;

			this.interactionMatrix[i] = [];
			this.relationMap[i] = [];

			for (let j = 0; j < L; j++) {
				// Update this in `addOrRemove`
				this.interactionMatrix[i][j] = 0;

				let pref = this.getRelationPref(i, j);
				if (pref > 0) {
					this.relationMap[i].push({
						index: j,
						value: pref
					});
				}
			}

			// Self competition
			this.interactionMatrix[i][i] = -1;

			// Sort relations by size
			this.relationMap[i].sort((a, b) => (a.value < b.value) ? 1 : -1);
		}

		this.solve(0, 1);
	}

	getRelationPref(predIndex, preyIndex) {
		for (let item of this.species[predIndex].diet) {
			if (item.node.id == this.species[preyIndex].id) {
				return item.pref;
			}
		}
		return 0;
	}

	addOrRemoveSpecies(species, active) {
		let index = this.species.findIndex(x => x.id == species.id);

		if (active) {
			this.population[index] = 0.05;
		}
		else {
			this.population[index] = 0;
		}
	}

	changeGrowthRate(species, value) {
		let index = this.species.findIndex(x => x.id == species.id);

		// if ((value == 1 && this.growthRate[index] > 0) || (value == -1 && this.growthRate[index] < 0)) {
		if (value == 1) {
			this.interactionMatrix[index][index] /= 2;
		}
		else {
			this.interactionMatrix[index][index] *= 2;
		}
	}

	reset() {
		this.time = 0;
		this.history = {x:[], y:[]};

		for (let i = 0; i < this.species.length; i++) {
			this.population[i] = 0;
			this.interactionMatrix[i][i] = -1;
		}
	}

	run(startTime) {
		this.updateInteractions();
		this.solve(startTime, this.simTime);
	}

	updateInteractions() {
		const L = this.species.length;

		// Reset interactions
		for (let i = 0; i < L; i++) {
			for (let j = 0; j < L; j++) {
				if (i != j) {
					this.interactionMatrix[i][j] = 0;
				}
			}
		}

		// Set interactions
		for (let i = 0; i < L; i++) {
			if (true || this.population[i] > 0) {

				// Points to distribute
				let weights = [1.0, 0.4, 0.2];

				for (const rel of this.relationMap[i]) {
					let j = rel.index;

					// Stop lions from eating themselves
					if (i == j) {
						continue;
					}

					if (this.population[j] > 0 && weights.length > 0) {
						let value = weights.shift();
						this.interactionMatrix[i][j] = value;
						this.interactionMatrix[j][i] = -value;
					}
					else if (this.population[j] <= 0) {
						this.interactionMatrix[i][j] = 0.5;
						this.interactionMatrix[j][i] = -0.5;
					}
				}
			}
		}
	}


	solve(startTime, duration) {
		console.log("> Solving", startTime.toFixed(0), "-", (startTime+duration).toFixed(0));

		// ODE Solver
		let start = startTime;
		let end = start + duration;
		let population = this.population;

		this.sol = numeric.dopri(start, end, population, this.getDerivative.bind(this), 1e-6, 2000);
		this.population = [...this.sol.y[this.sol.y.length-1]]; // Copy
		this.time = end;

		// Discard history that'll be overwritten
		for (let i = 0; i < this.history.x.length; i++) {
			if (this.history.x[i] > start) {
				this.history.x.splice(i);
				this.history.y.splice(i);
				break;
			}
		}

		this.history.x = this.history.x.concat(this.sol.x);
		this.history.y = this.history.y.concat(this.sol.y);

		// if (this.sol.x[0] == this.result.x[this.result.x.length-1]) {
			// this.result.x.pop();
			// this.result.y.pop();
		// }

		// for (let i = 0; i < this.sol.x.length; i++) {
			// console.log( "{0}: [{1}]".format(this.sol.x[i].toFixed(2), this.sol.y[i].map(x => x.toFixed(2)).join(", ")) );
		// }

		// SOL.AT is pretty useful
		// console.log(this.sol.at(0));

		// this.result.x.push(...this.sol.x);
		// this.result.y.push(...this.sol.y);
	}

	// Lotka-Volterra equation (classical model for predator-prey interaction)
	// t: time
	// x: population at time t
	getDerivative(t, pop) {
		let dPop = [];
		for (let i = 0; i < pop.length; i++) {

			// Sum of all interactions on species i
			let sum = 0;
			for (let j = 0; j < pop.length; j++) {
				sum += this.interactionMatrix[i][j] * pop[j];
			}

			// dPop[i] = this.growthRate[i] * pop[i] * (1 - sum / this.carryingCapacity[i]);
			dPop[i] = this.growthRate[i] * pop[i] + pop[i] * sum;
		}
		return dPop;
	}


	getPopulationAt(t) {
		if (!this.sol || t >= this.time) {
			return this.population;
		}
		else if (t <= this.sol.x[0]) {
			return this.sol.y[0];
		}
		else {
			return this.sol.at(t);
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

	get species() { return this.scenario.species; }
	get speciesMap() { return this.scenario.speciesMap; }
}


window.simulator2 = new Simulator2();
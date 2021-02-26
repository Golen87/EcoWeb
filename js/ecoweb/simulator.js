class Simulator {
	constructor() {
		// Current time step of simulation
		this.time = 0;
		// Size of the population at a given time
		this.population = [];
		// Results from solve
		this.result = {};

		this.events = [];
		this.activeEvents = [];

		this.showNodes = true;
		this.showStages = false;
		this.showBiomass = false;
	}

	loadScenario(scenarioData) {
		// this.activeEvents = [];

		this.scenario = new Scenario(scenarioData);
		this.world = new World();

		// TODO: Add function to solve scenario sections?

		// for (const event of this.scenario.events) {
		// 	this.events.push(event);
		// 	if (event.type == "automatic") {
		// 		this.setEvent(event, event.autoTime);
		// 	}
		// }


		if (!this.vue) {
			this.vue = createGraphTools();
		}
		this.vue.species = this.scenario.species;
		this.vue.maxTime = this.scenario.maxTime;
		this.vue.deltaTime = this.scenario.deltaTime;
		this.vue.sunlight = this.scenario.sunlight;
		this.vue.territory = this.scenario.territory;
		this.vue.showNodes = this.showNodes;
		this.vue.showStages = this.showStages;
		this.vue.showBiomass = this.showBiomass;

		// this.refresh();
	}

	// restart() {
	// 	this.startScenario(this.scenarioIndex);
	// }

	refresh() {
		this.reset();
		this.solve2(this.maxTime);
		updateChart();
	}

	reset() {
		this.time = 0;

		// Set popupation to start population
		this.population = [];
		for (const i in this.species) {
			let s = this.species[i];
			this.population[i] = (s.enable ? s.startPopulation : 0);
		}


		for (let s of this.species) {
			if (s.reset) {
				s.reset(this.deltaTime);
			}
		}

		this.resetResults();

		resetChart(this.species);

		// Reset events as well
	}

	resetResults() {
		this.result = {
			timestamps: [],
			population: {},
			health: {}
		};
		for (let s of this.species) {
			this.result.population[s.id] = [];
			this.result.health[s.id] = [];
			if (s.stages) {
				for (const id in s.stages) {
					this.result.population[id] = [];
					this.result.health[id] = [];
				}
			}
		}
	}

	stabilize() {
		this.time = 0;
		this.resetResults();
		this.solve2(this.maxTime);
		updateChart();
	}

	setEvent(event, time) {
		if (event) {
			this.activeEvents.push(new ActiveEvent(event, time));
		}
	}

	getActivityMap() {
		let map = {};
		for (const i in this.species) {
			const id = this.species[i].id;
			map[id] = [];

			for (const activeEvent of this.activeEvents) {
				if (activeEvent.active) {
					for (const effect of activeEvent.event.effects) {
						if (id == effect.node_id) {

							let slope = 0;
							if (effect.method == EFFECT_METHODS[0].value) {
								slope = effect.value;
							}
							else if (effect.method == EFFECT_METHODS[1].value) {
								slope = effect.value - this.population[i];
							}
							else if (effect.method == EFFECT_METHODS[2].value) {
								slope = (effect.value - 1) * this.population[i];
							}

							map[id].push({
								effect,
								slope,
								startTime: activeEvent.startTime
							});
						}
					}
				}
			}
		}
		return map;
	}

	// solve(duration, includeEvents=true) {
	// 	for (const activeEvent of this.activeEvents) {
	// 		activeEvent.setActive(false);
	// 	}

	// 	let timestamps = [];
	// 	for (const event of this.activeEvents) {
	// 		timestamps.push({
	// 			activeEvent: event,
	// 			time: event.startTime,
	// 			value: true
	// 		});
	// 		timestamps.push({
	// 			activeEvent: event,
	// 			time: event.endTime,
	// 			value: false
	// 		});
	// 	}
	// 	timestamps.sort((a,b) => (a.time > b.time) ? 1 : -1);

	// 	for (const i in timestamps) {
	// 		const activeEvent = timestamps[i].activeEvent;
	// 		const time = timestamps[i].time;

	// 		if (time >= duration) {
	// 			break;
	// 		}

	// 		if (time >= this.time) {
	// 			this.solveSection(time - this.time, this.getActivityMap(), includeEvents);
	// 			//this.applyEvent(this.activeEvents[i].event);
	// 		}
	// 		else {
	// 			console.warn("Event out of scope at", time);
	// 		}

	// 		console.log("> Turning " + (timestamps[i].value ? "on " : "off ") + activeEvent.event.name + " at " + time);
	// 		activeEvent.setActive(timestamps[i].value);
	// 	}
	// 	this.solveSection(duration - this.time, this.getActivityMap(), includeEvents);
	// }

	getValueAt(id, time, key="population") {
		if (this.result.timestamps.length == 0) {
			return 0;
		}
		if (time <= this.result.timestamps[0]) {
			return this.result[key][id][0];
		}
		if (time >= this.result.timestamps[this.result.timestamps.length-1]) {
			return this.result[key][id][this.result.timestamps.length-1];
		}

		// Binary search for closest x pair
		let index = Math.floor(this.result.timestamps.length / 2);
		let step = Math.floor(index / 2);
		while (this.result.timestamps[index] > time || time > this.result.timestamps[index+1]) {
			if (this.result.timestamps[index] < time) {
				index += step;
			}
			else {
				index -= step;
			}
			step = Math.ceil(step / 4);
		}

		let minX = this.result.timestamps[index];
		let maxX = this.result.timestamps[index+1];
		let minY = this.result[key][id][index];
		let maxY = this.result[key][id][index+1];

		if (minX == maxX || minY == maxY) {
			return minY;
		}
		else {
			let slope = (maxY - minY) / (maxX - minX);
			return minY + slope * (time - minX);
		}
	}

	getDerivativeAt(id, time, key="population") {
		let a = this.getValueAt(id, time - this.deltaTime/2, key);
		let b = this.getValueAt(id, time + this.deltaTime/2, key);
		return (b - a) / this.deltaTime;
	}

	solve2(duration) {
		this.pushPopulation();

		const result = this.distributeFood();

		for (const node of this.species) {
			for (const id in node.stages) {
				const stage = node.stages[id];
				if (result.health[id] != null) {
					stage.setHealth(result.health[id]);
				}
			}
		}

		let limit = 1000;
		while (this.time <= duration+EPSILON && limit-- > 0 && this.deltaTime >= 0.001) {

			// NEW PLAN
			// - Birth new individuals (from previous health)
			// - Kill unhealthy individuals
			// - Check food availability and how much is eaten
			// -- Save eating info for later
			// -- Update health of stages
			// - Kill eaten individuals
			// - Finalize stages?
			// - Update populations

			console.warn('-------', this.time.toFixed(2));

			this.world.reset();


			for (let node of this.species) {
				if (!node.fixed) {
					// console.log("Pop", node.totalPopulation.toFixed(1));
					node.update(this.world, this.deltaTime);
				}
			}
			const result = this.distributeFood();

			for (const node of this.species) {
				for (const id in node.stages) {
					const stage = node.stages[id];
					if (result.health[id] != null) {
						let bonus = 1;
						if (stage.territory) {
							const max = this.scenario.territory;
							const density = max / (stage.total * stage.territory);
							bonus = 1 - Math.exp(-Math.pow(density, 4));
						}
						stage.setHealth(result.health[id], bonus);
					}
				}
			}


			for (const node of this.species) {
				if (!node.fixed) {
					for (const id in node.stages) {
						const stage = node.stages[id];
						if (result.death[id] != null) {
							//console.log("Eat", (-result.death[id] * stage.total).toFixed(1), this.getName(id));
							stage.population.killPercent(result.death[id]);
							// if (node.name == 'Havsfiskar' && this.time > 100) {
								// stage.population.killPercent(0.13);
							// }
						}
					}
				}
			}

			for (let s of this.species) {
			//for (let sss = this.species.length-1; sss >= 0; sss--) {
			//	let s = this.species[sss];
			//for (const stage of this.stages) {
				for (let something in s.diet) {
					//let t = this.stagesMap[id];
					// Ignoring amount for now: s.eats[id]

					// let demand_time = s.totalPopulation * s.consumption * 365 * this.deltaTime;
					// let demand_day = s.totalPopulation * s.consumption * 10;
					// let supply = t.totalPopulation * t.weight;
					// let success = 0.1 + 0.9 * Math.pow(1 - Math.exp(-1 * (supply/demand_day)), 3);
					// //let extra = Math.pow(1 - Math.exp(-1 * ((s.totalPopulation + t.totalPopulation)/10)), 3);
					// let extra = 0.1 + 0.9 * Math.pow(1 - Math.exp(-1 * (t.totalPopulation/1000)), 3);
					// let temp = success;
					// //console.log(s.totalPopulation.toFixed(0), s.consumption, demand.toFixed(0));
					// //console.log(t.totalPopulation.toFixed(0), t.weight, supply.toFixed(0));
					// success *= extra;


					// if (s.totalPopulation > 0) {
					// 	console.log("{0} eats {2}%+{3}% of demand".format( s.name, Math.round(success*100), Math.round(temp*100), Math.round(extra*100) ));
					// 	//console.log("---", t.totalPopulation.toFixed(0), extra.toFixed(2));
					// }

					// let survivalFunction = function(x) { return 1 - 0.9 * Math.pow(1 - x, 3); };
					// let fertileFunction = function(x) { return 3*Math.pow(x, 2*1.5) - 2*Math.pow(x, 3*1.5); };
					// s.fertileSuccess = fertileFunction(success);

					// if (!s.fixed) {
					// 	//s.kill(s.totalPopulation * (1 - success), 1 - success);
					// 	s.kill(s.totalPopulation * (1 - survivalFunction(success)), 1, "Starvation");
					// }
					// if (!t.fixed) {
					// 	t.kill(0.5 * demand_time * success / t.weight, success, "Predation");
					// }
					//console.log("{0} kills {1} {2}".format(s.name, Math.round(demand * success / t.weight), t.name));

					/*console.log("{0} ({1}kg) eats {2} ({3}kg) = {4} dies".format(
						s.name,
						Math.round(demand * 10) / 10,
						t.name,
						Math.round(supply * 10) / 10,
						Math.round(success * 100)
					));*/
				}
			}

			//for (let s of this.species) {
			//	s.kill(Math.max(0, s.totalPopulation - 10000));
			//}
			//let s = this.species[2];
			//s.kill(Math.max(0, s.totalPopulation - s.startPopulation), 1);

			this.pushPopulation();
			this.time += this.deltaTime;
		}

		for (let node of this.species) {
			if (!node.fixed) {
				// console.log("Pop", node.totalPopulation.toFixed(1));
			}
		}

		this.printAverageLifespan();
	}

	getName(id) {
		if (this.stagesMap[id])
			return "{0}({1})".format(this.stagesMap[id].parent.name, this.stagesMap[id].name);
		else
			return id;
	}
	distributeFood() {
		// Create supply and demand
		let demand = {};
		let supply = {};
		for (const node of this.species) {
			for (const id in node.stages) {
				const stage = node.stages[id];

				if (stage.parent.type == "animal"/* && stage.consumption*/) {
					demand[stage.id] = stage.total * stage.consumption;// * 365 * this.deltaTime;
				}
				if (stage.parent.type == "plant"/* && stage.sunlight*/) {
					demand[stage.id] = stage.total * stage.sunlight;
				}
				if (stage.isEdible) {
					supply[stage.id] = stage.total * stage.weight;
				}
			}
		}
		//console.log(this.scenario.territory, this.scenario.sunlight);
		supply.sunlight = this.scenario.sunlight;

		// Create edges
		let edges = {};
		for (const node of this.species) {
			for (const id in node.stages) {
				const stage = node.stages[id];

				if (demand[stage.id]) {
					edges[stage.id] = {};
					for (const item of node.diet) {
						if (supply[item.stage.id]) {
							edges[stage.id][item.stage.id] = item.pref * stage.efficiency;
							// MIGHT HELP WITH FAVORING THE MORE PREVALENT FOOD
							//let fac = Math.pow(1 - Math.exp(-1 * supply[item.stage.id] / demand[stage.id]), 2);
							//edges[stage.id][item.stage.id] *= fac;
							// console.log("- {0} -> {1}".format(this.getName(stage.id), this.getName(item.stage.id)), edges[stage.id][item.stage.id].toFixed(2), fac);
						}
					}
					if (stage.parent.type == "plant") {
						edges[stage.id].sunlight = (1 + stage.layer) * stage.shade;
						// console.log("- {0} -> {1}".format(this.getName(stage.id), 'sunlight'), edges[stage.id].sunlight.toFixed(2));
					}

				}

			}
		}

		let demandOrig = JSON.parse(JSON.stringify(demand));
		let supplyOrig = JSON.parse(JSON.stringify(supply));
		let supplyBonus = {};

		// 	let percent = Math.pow(1 - Math.exp(-1 * supply / demand), 1);
		// PUNISH DEMANDS DEPENDING ON SUPPLY

		console.log("Demand");
		for (const id in demand) {
			if (demand[id]) {
				console.log("-", this.getName(id), demand[id].toFixed(1), "kg");
			}
		}

		console.log("Supply");
		for (const id in supply) {
			if (supply[id]) {
				console.log("-", this.getName(id), supply[id].toFixed(1), "kg");

				if (id != "sunlight") {
					// AND IN TOTAL THERE IS X AMOUNT OF FOOD AVAILABLE; THUS LIMITING MY HUNTING POWERS
					let total = 0;
					//for (const prey in edges[id]) {
					for (const pred in edges) {
						if (edges[pred][id]) {
							total += demand[pred];
						}
					}
					let fac = Math.pow(1 - Math.exp(-1 * supply[id] / total), 10);
					let temp = Math.round(total / supply[id] * 100);
					supplyBonus[id] = supply[id] - fac * supply[id];
					// supplyBonus[id] = 0;
					supply[id] *= fac;
					if (fac < 0.99) {
						console.error('-- and others want', total.toFixed(1), "({0}% of pop)".format(temp), "so I only give", "{0}%".format(fac.toFixed(2)*100), "=", supply[id].toFixed(1));
					}
				}
				else {
					supplyBonus[id] = 0;
				}
			}
		}


		function getDelta(x) {
			let minimum = Infinity;
			let demandFlow = {};
			let supplyFlow = {};
			for (const pred in edges) {
				for (const prey in edges[pred]) {
					if (demand[pred] > EPSILON && supply[prey] > EPSILON) {
						demandFlow[pred] = (demandFlow[pred] || 0) + edges[pred][prey];
						supplyFlow[prey] = (supplyFlow[prey] || 0) + edges[pred][prey];
					}
				}
			}
			for (const id in demandFlow) {
				if (demand[id] / demandFlow[id] > EPSILON) {
					// console.log('>>>', x.getName(id), demand[id].toFixed(1), demandFlow[id].toFixed(1), (demand[id] / demandFlow[id]).toFixed(1));
					minimum = Math.min(minimum, demand[id] / demandFlow[id]);
				}
			}
			for (const id in supplyFlow) {
				if (supply[id] / supplyFlow[id] > EPSILON) {
					// console.log('>>>', x.getName(id), supply[id].toFixed(1), supplyFlow[id].toFixed(1), (supply[id] / supplyFlow[id]).toFixed(1));
					minimum = Math.min(minimum, supply[id] / supplyFlow[id]);
				}
			}
			// console.log('minimum', minimum);
			// for (const pred in edges) {
			// 	for (const prey in edges[pred]) {
			// 		console.warn(x.getName(pred), x.getName(prey), edges[pred][prey] * minimum);
			// 	}
			// }
			return minimum;
		}

		// console.log("Edges");
		let active = true;
		let limit = 0;
		while (active) {
			active = false;

			const delta = getDelta(this);
			// console.warn("Step", limit, '-', delta);
			if (delta > EPSILON && delta != Infinity) {

				for (const pred in edges) {
					for (const prey in edges[pred]) {
						const flow = edges[pred][prey] * delta;
						if (flow > 0 && demand[pred] > EPSILON && supply[prey] > EPSILON) {
							active = true;
							// console.log("- {0} -> {1}".format(this.getName(pred), this.getName(prey)), flow.toFixed(2), "({0}/{1})".format(demand[pred].toFixed(1), supply[prey].toFixed(1)));
							// console.log(flow.toFixed(1), demand[pred].toFixed(1), supply[prey].toFixed(1));

							//let fac = Math.pow(1 - Math.exp(-1 * supply[prey] / demand[pred]), 1);
							//fac = 1;

							demand[pred] -= flow;
							console.assert(demand[pred] > -EPSILON, "{0} demand: {1}".format(this.getName(pred), demand[pred].toFixed(1)));
							supply[prey] -= flow;
							console.assert(supply[prey] > -EPSILON, "{0} supply: {1}".format(this.getName(prey), supply[prey].toFixed(1)));
							// if (demand[pred] < EPSILON) {console.warn("BOOM", this.getName(pred), "is FULL");}
							// if (supply[prey] < EPSILON) {console.warn("BOOM", this.getName(prey), "is DEAD");}
						}
					}
				}
			}
			if (limit++ > 1000) { throw "SIMULATION INCOMPLETE"; }
		}
		//console.log("... {0} iterations".format(limit));

		// console.log("Demand");
		// for (const id in demand) {
		// 	if (demand[id]) {
		// 		console.log("-", this.getName(id), demand[id].toFixed(1), "kg");
		// 	}
		// }

		// console.log("Supply");
		// for (const id in supply) {
		// 	if (supply[id]) {
		// 		console.log("-", this.getName(id), supply[id].toFixed(1), "kg");
		// 	}
		// }

		let health = {};
		// console.log("Happiness");
		for (const id in demandOrig) {
			if (demandOrig[id]) {
				health[id] = (demandOrig[id] - demand[id]) / demandOrig[id];
				console.assert(health[id] !== null && health[id] !== undefined && !isNaN(health[id]), health[id]);
				// if (!this.stagesMap[id].parent.fixed)
					// console.log("- {0} {1}% satisfied".format(this.getName(id), health[id].toFixed(2) * 100));
			}
		}

		let death = {};
		// console.log("Percent eaten");
		for (const id in supplyOrig) {
			if (supplyOrig[id]) {
				death[id] = (supplyOrig[id] - supply[id] - supplyBonus[id]) / supplyOrig[id];
				console.assert(death[id] !== null && death[id] !== undefined && !isNaN(death[id]), death[id]);
				console.log("- {0} {1}% dead".format(this.getName(id), death[id].toFixed(2) * 100));
			}
		}

		return {health, death};
	}

	pushPopulation() {
		let pop = [];
		for (let s of this.species) {
			this.result.population[s.id].push(this.showBiomass ? s.totalBiomass : s.totalPopulation);
			this.result.health[s.id].push(0);
			if (s.stages) {
				for (const id in s.stages) {
					const stage = s.stages[id];
					this.result.population[id].push(this.showBiomass ? stage.total * stage.weight : stage.total);
					this.result.health[id].push(stage.health);
				}
			}
		}
		this.result.timestamps.push(Math.floor(this.time * 100) / 100);
	}

	printAverageLifespan() {
		// for (let s of this.species) {
		// 	let sum = 0;
		// 	for (let time = 0; time <= s.length; time++) {
		// 		sum += (time*this.deltaTime) * s.pop[time];
		// 	}
		// 	let average = (s.totalPopulation > 0) ? sum/s.totalPopulation : 0;
		// 	//console.log(s.name, 'average:', Math.round(average * 100)/100, 'years');
		// }
	}

	get species() { return this.scenario.species; }
	get speciesMap() { return this.scenario.speciesMap; }
	get stages() { return this.scenario.stages; }
	get stagesMap() { return this.scenario.stagesMap; }
	get maxTime() { return this.scenario.maxTime; }
	get deltaTime() { return Math.max(this.scenario.deltaTime, 0.01); }
}


window.simulator = new Simulator();
//const DEATH_THRESHOLD = 1E-3;
const EPSILON = 1E-6;
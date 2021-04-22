class Organism {
	constructor(node, actor) {
		this.id = node.id;
		this.name = node.name;
		// this.image = node.type == 'plant' ? "placeholder_plant" : node.image;
		this.image = node.image;
		this.color = node.color;
		this.description = node.description;
		this.type = node.type;
		this.relations = node.relations;
		this.stages = {};
		this.group = node.group; // Serengeti

		this.x = actor.position[0];
		this.y = actor.position[1];
		this.visibility = actor.visibility;
		this.fixed = actor.fixed;

		this.events = [];

		// Simulation
		this.startPopulation = actor.population;
		//this.growthRate = 0;
		//this.selfCompetition = 0;
		//this.popFunc = null;
		//this.popFuncDt = null;
		//this.carryingCapacity = 1000;

		this.diet = [];

		this.enable = (this.startPopulation > 0);
		//this.showGraph = (this.visibility == "explored");
		this.show = false;


		/* Simulation */

		this.init(node, actor);
	}

	get showGraph() {
		return !this.fixed;
	}

	addEvent(event) {
		this.events.push(event);
	}

	addDiet(node, stage, pref) {
		this.diet.push({
			node, stage, pref
		});
	}

	// requires(component, level) {
	// 	this.requirements[component.name] = level;
	// }


	/* Simulation */

	/*
	reset(dt) {
		this.dt = dt;
		this.length = Math.ceil(this.maxAge / dt);

		// Population integral
		this.pop = [];
		this.fertileChance = [];
		this.deathChance = [];
		this.starveChance = [];

		for (let time = 0; time <= this.length; time++) {
			//this.pop[time] = (time == 0) ? (this.enable * this.startPopulation) : 0;
			this.pop[time] = (this.enable * this.startPopulation) / (this.length + 1);
			this.fertileChance[time] = this.fertileFunction(time * dt);
			this.deathChance[time] = this.deathFunction(time * dt);
			this.starveChance[time] = this.starveFunction(time * dt);
		}

		// Temp
		this.fertileSuccess = 1.0;
	}

	// getFoodAvailability() {
	// 	let food = Math.pow(1 - Math.exp(-2 * (demand/supply)), 3);
	// 	return this.getTotalPop() * this.consumption;
	// }

	update(world, dt) {
		let born = 0;
		for (let time = 0; time <= this.length; time++) {
			//let dead = normalRandomSum(this.pop[time] * this.deathChance[time]);
			//this.pop[time] -= Math.min(this.pop[time], dead);

			//born += normalRandomSum(this.pop[time] * this.fertileChance[time] * this.fertileSuccess * dt * dt);
			born += this.pop[time] * this.fertileChance[time] * dt;
		}
		this.pop.unshift(born);
		if (born > 0) console.log(this.name, 'births', Math.round(born), this.fertileSuccess.toFixed(2));
		this.pop.splice(this.pop.length-1);
	}

	kill(amount, chance=1, reason="God") {
		let total = this.totalPopulation;
		if (total < 1) {
			this.exterminate();
		}

		if (total > 0 && amount * chance > 0) {
			console.log("{3} kills {1} ({2}%) of {0}".format(this.name, (amount*chance).toFixed(0), (amount*chance/total*100).toFixed(0), reason));
			//let survival = 0.1 * Math.exp(chance - 1);
			//amount = normalRandomSum(amount * chance);
			//amount = amount * chance;
			//console.log("{0} {1} starve".format(Math.round(amount), this.name));

			let sum = 0;
			for (let time = 0; time <= this.length; time++) {
				sum += this.pop[time] * this.starveChance[time];
			}

			let avg = Math.max(1, total / 10000);
			while (amount > 0.1) {
				let target = randReal(0, sum);
				let targetSum = 0;
				for (let time = 0; time <= this.length; time++) {
					targetSum += this.pop[time] * this.starveChance[time];
					if (target < targetSum) {
						let tbk = Math.min(this.pop[time], avg);
						this.pop[time] -= tbk;
						amount -= tbk;
						sum -= tbk * this.starveChance[time];
						break;
					}
				}
				if (targetSum == 0) {
					return;
				}
			}
		}
	}

	exterminate() {
		for (let time = 0; time <= this.length; time++) {
			this.pop[time] = 0;
		}
	}
	*/

	// Return sum of integral population
	get totalPopulation() {
		let sum = 0;
		for (const id in this.stages) {
			const stage = this.stages[id];
			if (stage.isPopulation) {
				sum += stage.population.total;
			}
		}
		return sum;
		//return this.pop.reduce(function(a, b) { return a + b; }, 0);
	}

	// Return sum of integral population
	get totalBiomass() {
		let sum = 0;
		for (const id in this.stages) {
			const stage = this.stages[id];
			if (stage.isEdible) {
				sum += stage.population.total * stage.weight;
			}
		}
		return sum;
		//return this.pop.reduce(function(a, b) { return a + b; }, 0);
	}

	// kill(amount, chance=1, reason="God") {
	// }

	//neutralism
	//amensalism
	//commensalism
	//competition
	//mutualism
	//predation/parasitism


	init(node, actor) {
		/*this.maxAge = 10;

		this.deathFunction = function(x) {
			x /= this.maxAge;
			return Math.pow(0.3*Math.exp(-10*x) + 1.0*Math.exp(7.6*(x-1)), 1);
		};

		this.fertileFunction = null;


		this.consumption = 1;
		this.weight = 10;
		this.age = 400;
		this.offspring = 10;

		this.fertileFunction = createSmoothstepPlateau(
			0,//40,
			0,//100,
			10,//300,
			20,//400,
			this.offspring
 		);

		this.starveFunction = function(x) {
			x /= this.maxAge;
			return Math.exp(-10 * x);
		};*/
		// this.weight = 1;


		/* Stages */

		this.stages = {};
		for (const data of node.stages) {
			this.stages[data.id] = new Stage(data, this);
		}

		for (const data of node.stages) {
			const stage = this.stages[data.id];

			if (this.stages[data.next]) {
				stage.setNext(this.stages[data.next]);
			}
			else if (data.next != null) {
				console.error(node.name, data.name, "has unknown stage.next id:", data.next);
			}

			if (data.isProducing) {
				for (const id in data.produces) {
					const product = this.stages[id];
					const amount = data.produces[id];
					stage.addProduce(product, amount);
				}
			}
		}
	}

	reset(dt) {
		for (const id in this.stages) {
			const stage = this.stages[id];
			stage.reset(dt);
			// if (stage.isPopulation) {
				stage.population.populate(this.enable && this.startPopulation);
			// }
		}
	}

	update(world, dt) {
		for (const id in this.stages) {
			this.stages[id].update(dt);
		}

		for (const id in this.stages) {
			this.stages[id].finalize(dt);
		}
	}

	isPlant() { return false; }
	isAnimal() { return false; }
	isHerbivore() { return false; }
	isCarnivore() { return false; }
}


class Animal extends Organism {
	constructor(node, actor) {
		super(node, actor);

		this.size = node.animal.size;
		this.food = node.animal.food;
		// this.consumption = node.animal.consumption;
		// this.weight = node.animal.weight;
		// this.age = node.animal.age;
		// this.offspring = node.animal.offspring;

		// this.maxAge = this.age;

		// this.fertileFunction = createSmoothstepPlateau(
		// 	0.6,
		// 	1.0,
		// 	10+3.0,
		// 	10+4.0,
		// 	this.offspring
		// 	//0.5 * 3.5 * 3
		// );

		// this.starveFunction = function(x) {
		// 	//return 1 + x;
		// 	x /= this.maxAge;
		// 	return Math.pow(x, 4 * x) - 0.4 * Math.exp(-10 * x);
		// };
	}

	isAnimal() { return true; }
	isHerbivore() { return this.food == 'herbivore'; }
	isCarnivore() { return this.food == 'carnivore'; }
}


class Plant extends Organism {
	// growthrate = vatten x ljus x pollination
	constructor(node, actor) {
		super(node, actor);
	}

	update(world, dt) {
		super.update(world, dt);
		/*
		let born = 0;
		for (let time = 0; time <= this.length; time++) {
			//let dead = normalRandomSum(this.pop[time] * this.deathChance[time]);
			//this.pop[time] -= Math.min(this.pop[time], dead);

			//born += normalRandomSum(this.pop[time] * this.fertileChance[time] * this.fertileSuccess * dt * dt);
			//born += this.pop[time] * this.fertileChance[time] * dt;
		}
		this.pop.unshift(born);
		this.pop.splice(this.pop.length-1);*/

		//this.leaves.birth(this.leavesMax * dt);
		//this.acorns.birth(this.acornsMax * dt);

		// function absorb(stage, shade) {
		// 	let demand = stage.getRequirement('sunlight');
		// 	let supply = world.sunlight;
		// 	let percent = Math.pow(1 - Math.exp(-1 * supply / demand), 1);
		// 	let consumed = percent * demand * shade;

		// 	stage.health = percent;
		// 	world.sunlight -= consumed;
		// }

		// const prev = world.sunlight;
		// absorb(this.stages.ancient, 0.75);
		// absorb(this.stages.mature, 0.75);
		// absorb(this.stages.sapling, 0.50);
		// absorb(this.stages.seedling, 0.25);
		// console.warn("Sunlight {0}%  Health {1}% {2}% {3}%".format(
		// 	(100*(world.sunlight / prev)).toFixed(0),
		// 	(100*this.stages.seedling.health).toFixed(0),
		// 	(100*this.stages.sapling.health).toFixed(0),
		// 	(100*this.stages.mature.health).toFixed(0),
		// 	(100*this.stages.ancient.health).toFixed(0)
		// ));

		// console.log("({0}) {1} {2} {3} {4} ({5} {6} {7})".format(
		// //console.log("{1} {2} {3}".format(
		// 	this.stages.acorn.population.total.toFixed(0),
		// 	this.stages.seedling.population.total.toFixed(0),
		// 	this.stages.sapling.population.total.toFixed(0),
		// 	this.stages.mature.population.total.toFixed(0),
		// 	this.stages.ancient.population.total.toFixed(0),
		// 	//this.stages.snag.population.total.toFixed(0)
		// 	this.stages.smallLeaves.population.total.toFixed(0),
		// 	this.stages.mediumLeaves.population.total.toFixed(0),
		// 	this.stages.largeLeaves.population.total.toFixed(0)
		// ));
	}

	isPlant() { return true; }
}


class Fungi extends Organism {
	constructor(node, actor) {
		super(node, actor);

		// ...
	}
}


class Abiotic extends Organism {
	constructor(node, actor) {
		super(node, actor);

		const func = actor.popfunc;

		if (func) {
			this.popFunc = math.compile(func);
			this.popFuncDt = math.derivative(func, 't').compile();
			this.startPopulation = this.popFunc.evaluate({t: 0});
		}
	}
}


class Service extends Organism {
}


class World {
	constructor() {
		this.reset();
	}

	reset() {
		this.sunlight = 1000000;
		this.water = 0;
		this.nutrients = 0;
	}
}



class Stage {
	constructor(data, parent) {
		this.parent = parent;
		this.id = data.id;
		this.name = data.name;
		this.age = data.age;
		this.survival = data.survival / 100;

		this.isEdible = data.isEdible;
		this.isProducing = data.isProducing;
		this.isPopulation = data.isPopulation;

		if (this.parent.type == "animal") {
			this.consumption = data.animal.consumption;
			this.efficiency = data.animal.efficiency;
			this.territory = data.animal.territory;
		}
		if (this.parent.type == "plant") {
			this.sunlight = data.plant.sunlight || 0;
			this.layer = data.plant.layer;
			this.shade = data.plant.shade;
		}
		if (this.isEdible) {
			this.weight = data.weight;
		}

		this.next = null;
		this.produces = [];
		this.requirements = {};
		this.population = null;
		this.health = null;
		this.health2 = null;
	}

	reset(dt) {
		this.population = new Population(this.age, dt);
		this.setHealth(1.0);
	}

	setNext(stage) {
		this.next = stage;
	}

	setHealth(value, bonus=1) {
		this.health = Math.min(Math.max(value, 0), 1);
		this.health2 = Math.min(Math.max(bonus, 0), 1);
	}

	addProduce(stage, amountPerYear) {
		this.produces.push({
			stage,
			amountPerYear
		});
	}

	addRequirement(resource, amount, priority) {
		this.requirements[resource] = {
			amount,
			priority
		};
	}

	/*getRequirement(resource) {
		if (this.requirements[resource]) {
			return this.population.total * this.requirements[resource].amount;
		}
		return 0;
	}*/

	update(dt) {
		let oldTotal = this.total;

		// Kill population based on health
		let exp = 1 + Math.pow(this.population.maxAge / 10, 0.5);
		let survival = 1 - Math.pow(1 - this.health*this.health2, exp);
		//console.log("Starve", (-(1 - Math.pow(survival, dt)) * this.total).toFixed(1), this.parent.name);
		this.population.killPercent(1 - Math.pow(survival, dt)); // TODO: Try pow(1-survival, dt)

		let dead = this.population.birth(0);
		//console.log("Old age", (-dead).toFixed(1));

		// Send survivors to the next stage
		if (this.next) {
			this.next.population.queue(this.survival * dead);
		}

		// Produce other stages (children and products)
		if (this.isProducing) {
			let fertility = Math.pow(this.health*this.health2, 2);
			for (const produce of this.produces) {
				//console.log("Birth", (fertility * oldTotal * produce.amountPerYear * dt).toFixed(1), produce.stage.parent.name);
				produce.stage.population.queue(fertility * oldTotal * produce.amountPerYear * dt);
			}
		}
	}

	finalize(dt) {
		//for (const produce of this.produces) {
		//	produce.stage.population.queue(this.health * this.population.buffer * produce.amountPerYear * dt);
		//}
		this.population.finalize();
	}

	get pop() {
		return this.population.pop;
	}

	get total() {
		return this.population.total;
	}
}


class Population {
	constructor(maxAge, dt) {
		this.maxAge = maxAge;
		this.length = Math.ceil(this.maxAge / dt);

		// Population integral
		this.pop = [];
		this.buffer = 0;

		for (let time = 0; time < this.length; time++) {
			this.pop[time] = 0;
		}

		this._total = 0;
	}

	reset() {
		for (let time = 0; time < this.length; time++) {
			this.pop[time] = 0;
		}
		this._total = 0;
	}

	populate(amount) {
		for (let time = 0; time < this.length; time++) {
			this.pop[time] = amount / this.length;
		}
		this._total += amount;
	}

	killPercent(percent) {
		percent = Math.min(Math.max(percent, 0), 1);
		for (let time = 0; time < this.length; time++) {
			this.pop[time] *= 1 - percent;
		}
		this._total = this._total * (1 - percent);
	}

	kill(amount) {
		this.killPercent(amount / this.total);
	}

	birth(amount) {
		this.pop.unshift(amount);
		const dead = this.pop.splice(this.length)[0];
		this._total += amount - dead;
		return dead;
	}

	queue(amount) {
		this.buffer += amount;
	}

	finalize() {
		this.pop[0] += this.buffer;
		this._total += this.buffer;
		this.buffer = 0;
	}

	updateTotal() {
		this._total = this.pop.reduce(function(a, b) { return a + b; }, 0);
	}

	// Return sum of integral population
	get total() {
		return this._total;
	}

	get(time) {
		return this.pop[time];
	}
}
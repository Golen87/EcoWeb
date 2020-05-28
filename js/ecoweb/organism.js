// Component
// - Abiotic
// - Organism
// --- Carnevore

class Organism {
	constructor(node, actor) {
		this.id = node.id;
		this.name = node.name;
		this.image = node.image;
		this.color = node.color;
		this.description = node.description;
		this.type = node.type;
		this.x = actor.position[0];
		this.y = actor.position[1];
		this.visibility = actor.visibility;

		this.events = [];

		// Simulation
		this.startPopulation = 0;
		this.growthRate = 0;
		this.selfCompetition = 0;
		this.popFunc = null;
		this.popFuncDt = null;
		this.carryingCapacity = 1.0;

		if (isAbiotic(this.type)) {
			const func = actor.popfunc;

			if (func) {
				this.popFunc = math.compile(func);
				this.popFuncDt = math.derivative(func, 't').compile();
				this.startPopulation = this.popFunc.evaluate({t: 0});
			}
		}
		else {
			this.startPopulation = actor.population;

			// TODO: Improve (base values on weight/offspring/etc.)
			if (this.type == "animal") {
				this.growthRate = -0.05;
				this.selfCompetition = -0.01;

				this.animal = {};
				this.animal.size = node.animal.size;
				this.animal.food = node.animal.food;
				this.animal.consumption = node.animal.consumption;
				this.animal.weight = node.animal.weight;
				this.animal.age = node.animal.age;
				this.animal.offspring = node.animal.offspring;
			}
			else if (this.type == "plant") {
				this.growthRate = 1.0;
				this.selfCompetition = -1.0;
			}
			else if (this.type == "fungi") {
				this.growthRate = 0.5;
				this.selfCompetition = -0.5;
			}
		}


		this.relationship = {};
		//this.relationship[this] = selfCompetition;
		//this.predators = [];
		//this.preys = [];
		this.requirements = {};
		this.diet = {};

		this.enable = true;
		this.showGraph = (this.visibility == "explored");
		this.show = false;
	}

	getFoodAmount() {
		return 1.0;
	}


	addEvent(event) {
		this.events.push(event);
	}

	addPrey(prey, benefit) {
		this.relationship[prey.name] = benefit;
	}

	addPredator(predator, penalty) {
		this.relationship[predator.name] = penalty;
	}

	eats(prey, benefit) {
		let penalty = -10 * benefit;
		this.addPrey(prey, benefit);
		prey.addPredator(this, penalty);
	}

	setDiet() {
		let total = 0;
		for (let i = 0; i < arguments.length; i+=2) {
			total += arguments[i+1];
		}

		for (let i = 0; i < arguments.length; i+=2) {
			let prey = arguments[i];
			let amount = arguments[i+1];
			this.diet[prey.name] = amount / total;
		}
	}

	requires(component, level) {
		this.requirements[component.name] = level;
	}

	//neutralism
	//amensalism
	//commensalism
	//competition
	//mutualism
	//predation/parasitism
}

class Carnivore extends Organism {
	getFoodAmount() {
		return 1.0;
	}
}
class Herbivore extends Organism {
	getFoodAmount() {
		return 1.0;
	}
}
class Plant extends Organism {
	getFoodAmount() {
		return 1.0;
	}
}



function addRelationship(predator, benefit, prey, penalty) {
	predator.addPrey(prey, benefit);
	prey.addPredator(predator, penalty);
}

function addEqualCompetition(species, penalty) {
	for (let i = 0; i < species.length; i++) {
		let s = species[i];
		for (let j = i+1; j < species.length; j++) {
			let t = species[j];

			addRelationship(s, penalty, t, penalty);
		}
	}
}
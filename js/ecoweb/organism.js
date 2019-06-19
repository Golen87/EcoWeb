// Component
// - Abiotic
// - Organism
// --- Carnevore

class Organism {
	constructor(name, startPopulation, growthRate, selfCompetition, image, color, type) {
		this.name = name;
		this.type = type;
		this.image = image;
		this.color = color;
		this.startPopulation = startPopulation;
		this.growthRate = growthRate;
		this.selfCompetition = selfCompetition;
		this.carryingCapacity = 1.0;

		this.relationship = {};
		//this.relationship[this] = selfCompetition;
		//this.predators = [];
		//this.preys = [];
		this.requirements = {};
		this.diet = {};

		this.enable = true;
		this.showGraph = true;
		this.show = false;
	}

	getGrowthRate() {
		let max = this.growthRate;
		for (var name in this.requirements) {
			if (this.requirements.hasOwnProperty(name)) {
				let component = web.getComponent(name);
				let diff = this.requirements[name] - component.startPopulation;
				max -= Math.abs(diff);
			}
		}
		return max;
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
		for (var i = 0; i < arguments.length; i+=2)
			total += arguments[i+1];

		for (var i = 0; i < arguments.length; i+=2) {
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

class Carnivore extends Organism {}
class Herbivore extends Organism {}
class Plant extends Organism {}



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
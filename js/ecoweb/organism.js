// Component
// - Abiotic
// - Organism
// --- Carnevore

class Organism {
	constructor(name, startPopulation, growthRate, selfCompetition, color, type) {
		this.name = name;
		this.type = type;
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

		this.enable = true;
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

	requires(component, level) {
		this.requirements[component.name] = level;
	}

	test(x) {
		console.log(this, x);
	}

	//neutralism
	//amensalism
	//commensalism
	//competition
	//mutualism
	//predation/parasitism
}


function addRelationship(predator, benefit, prey, penalty) {
	predator.addPrey(prey, benefit);
	prey.addPredator(predator, penalty);
}

function addEqualCompetition(species, penalty) {
}
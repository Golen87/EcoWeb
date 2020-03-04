class Scenario {
	constructor(data) {
		this.species = [];

		this.name = data.name;
		this.maxTime = data.time;
		this.budget = data.budget;
		this.description = data.description;
		this.cameraPos = {x: data.position[0], y: data.position[1]};


		for (let actor of data.actors) {
			let node = window.database.getNodeById(actor.node_id);

			// actor.visibility

			let name = node.name;
			let pop = actor.population;
			let growth = 0;
			let self = 0;
			let image = node.image;
			let color = node.color;
			let position = actor.position;

			// TODO: Improve
			if (node.type == "animal") {
				growth = -0.05;
				self = -0.01;
			}
			else if (node.type == "plant") {
				growth = 1.0;
				self = -1.0;
			}

			let organism = new Organism(name, pop, growth, self, image, color, position);

			// node.animal.size
			// node.animal.food
			// node.animal.consumption
			// node.animal.weight
			// node.animal.age
			// node.animal.offspring

			/*for (let pair of window.database.getOutgoingRelations(node)) {
				let other = pair.node;
				let rel = pair.relation;

				console.log('rel', node.name, '->', other.name, rel.preference);
				//console.log
			}*/

			let prefTot = 0;
			for (let rel of node.relations) {
				prefTot += rel.preference;
			}

			for (let rel of node.relations) {
				if (rel.type == "node") {
					let other = window.database.getNodeById(rel.node_id);
					organism.diet[other.name] = rel.preference / prefTot;
				}
				else if (rel.type == "tags") {
					let others = window.database.getNodesByTags(rel.tags);
					for (let other of others) {
						organism.diet[other.name] = rel.preference / others.length / prefTot;
					}
				}
				// rel.interaction
			}

			/*
			let total = 0;
			for (var i = 0; i < arguments.length; i+=2)
				total += arguments[i+1];

			for (var i = 0; i < arguments.length; i+=2) {
				let prey = arguments[i];
				let amount = arguments[i+1];
				this.diet[prey.name] = amount / total;
			}
			*/

			//organism.setDiet();
			this.species.push(organism);
		}
		//data.events;
		return;
		/*
		//	var						name		pop		growth	self	image		color
		let rodrav	= new Carnivore( "Rödräv",	0.1,	-0.05,	-0.01,	'räv',		'#FF3D00' );
		let blabar	= new Plant( "Blåbär",	1.0,	1.0,	-1.0,	'blåbär',	'#536DFE' );

		rodrav.setDiet(
			hare,		0.5,
			blabar,		0.4,
			svamp,		0.2,
			dovhjort,	0.2,
			radjur,		0.2,
			koltrast,	0.6,
		);

		//addEqualCompetition([hare, radjur, dovhjort, koltrast], -0.01);
		//addEqualCompetition([blabar, gras, orter], -0.05);

		addRelationship( dovhjort,	0.0,	radjur,	-0.05 );

		blabar.requires(trad, normRange(0.7, 0.2, 0.4));
		svamp.requires(trad, normRange(0.7, 0.3, 0.5));

		return [rodrav, lo, hare, radjur, dovhjort, koltrast, blabar, trad, gras, orter, svamp];
		*/
	}
}
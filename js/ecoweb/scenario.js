class Scenario {
	constructor(data) {
		this.species = [];

		this.name = data.name;
	
		this.maxTime = data.time.intro + data.time.sections * data.time.length + data.time.outro;
		this.timeIntro = data.time.intro;
		this.timeOutro = data.time.outro;
		this.sectionCount = data.time.sections;
		this.sectionLength = data.time.length;
		this.playSpeed = data.time.playspeed;

		this.budget = data.budget;
		this.description = data.description;
		this.cameraPos = {x: data.position[0], y: data.position[1]};
		this.conditions = data.conditions;

		// Create time sections list
		this.sections = [];
		let t = this.timeIntro;
		this.sections.push({ start: 0, end: this.timeIntro });
		for (let i = 0; i < this.sectionCount; i++) {
			this.sections.push({
				start: t,
				end: t + this.sectionLength
			});
			t += this.sectionLength;
		}
		this.sections.push({ start: this.maxTime - this.timeOutro, end: this.maxTime });


		for (let actor of data.actors) {
			let node = window.database.getNodeById(actor.node_id);

			let organism = new Organism(node, actor);

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
			for (const rel of node.relations) {
				prefTot += rel.preference;
			}

			for (const rel of node.relations) {
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

		this.events = [];

		for (let action of data.actions) {
			let eventData = window.database.getEventById(action.event_id);
			let event = new BaseEvent(eventData, action);
			this.events.push(event);

			for (const organism of this.species) {
				if (organism.id == event.owner_id) {
					organism.addEvent(event);
				}
			}
		}

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
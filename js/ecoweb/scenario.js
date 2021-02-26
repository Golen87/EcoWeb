class Scenario {
	constructor(data) {
		this.species = [];
		this.speciesMap = {};
		this.stages = [];
		this.stagesMap = {};

		this.id = data.id;
		this.name = data.name;

		this.deltaTime = data.time.deltatime; // Years
		this.maxTime = data.time.intro + data.time.sections * data.time.length + data.time.outro;
		this.timeIntro = data.time.intro;
		this.timeOutro = data.time.outro;
		this.sectionCount = data.time.sections;
		this.sectionLength = data.time.length;
		this.playSpeed = data.time.playspeed;
		this.fastSpeed = data.time.fastspeed;

		this.budget = data.budget;
		this.budgetReward = data.budgetreward;
		this.research = data.research;
		this.researchReward = data.researchreward;
		this.description = data.description;
		this.cameraPos = {x: data.position[0], y: data.position[1]};
		this.conditions = data.conditions;

		this.sunlight = data.sunlight;
		this.territory = data.territory;

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


		// Add organisms with classes
		for (let actor of data.actors) {
			let data = window.database.getNodeById(actor.node_id);

			let nodeClass = {
				"animal":	Animal,
				"plant":	Plant,
				"fungi":	Fungi,
				"abiotic":	Abiotic,
				"service":	Service,
			}[data.type];

			let node = new nodeClass(data, actor);

			this.species.push(node);
			this.speciesMap[node.id] = node;
			for (const id in node.stages) {
				let stage = node.stages[id];
				this.stages.push(stage);
				this.stagesMap[id] = stage;
			}
		}

		// Set relations
		for (let organism of this.species) {
			// Find all available relations
			let relations = [];
			for (const rel of organism.relations) {
				if (rel.type == "node") {
					let other = window.database.getNodeById(rel.node_id);
					if (this.speciesMap[other.id]) {
						let node = this.speciesMap[other.id];
						if (rel.stage_id) {
							let stage = this.speciesMap[other.id].stages[rel.stage_id];
							relations.push([node, stage, rel]);
						}
						else {
							// console.error('Relation {0}->{1} is missing Stage'.format(organism.name, other.name));
							for (let id in this.speciesMap[other.id].stages) {
								let stage = this.speciesMap[other.id].stages[id];
								if (stage.isEdible) {
									relations.push([node, stage, rel]);
								}
							}
						}
					}
				}
				else if (rel.type == "tags") {
					console.warn("Ignoring tag relation");
					// let others = window.database.getNodesByTags(rel.tags);
					// for (let other of others) {
					// 	if (this.speciesMap[other.id]) {
					// 		relations.push([this.speciesMap[other.id], rel]);
					// 	}
					// }
				}
			}

			// Filter predation relations
			let prey = relations.filter(pair => (pair[2].interaction == "predation" || pair[2].interaction == "herbivory" || pair[2].interaction == "parasitism" || pair[2].interaction == "amensalism"));
			let prefTot = prey.reduce(function(a, b) { return a + b[2].preference; }, 0);

			// Set diet
			for (const pair of prey) {
				let node = pair[0];
				let stage = pair[1];
				let rel = pair[2];
				organism.addDiet(node, stage, rel.preference / prefTot);
			}
		}


		/* Events */

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
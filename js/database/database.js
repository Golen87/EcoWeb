const DATABASE_VERSION = 4;
const DATABASE_LOCKED = true;

class Database {
	constructor() {
		//this.uniqueIdCounter = 1;

		this.nodes = [];
		this.events = [];
		this.scenarios = [];
		this.customTags = [];

		this.load();
	}


	/* Data management */

	importJSON(json) {
		let data = JSON.parse(json);

		if (data && isPlainObject(data) && data.version == DATABASE_VERSION) {
			this.loadNodes(data.nodes);
			this.loadEvents(data.events);
			this.loadScenarios(data.scenarios);
			this.loadCustomTags(data.tags);

			//this.updateUniqueId();
		}
		else {
			console.error("Ignore loading old database.");
			return false;
		}

		this.nodes.sort(this.nodeCompare);
		return true;
	}

	exportJSON(prettyprint=false) {
		let data = {
			"version": DATABASE_VERSION,
			"nodes": this.nodes,
			"events": this.events,
			"scenarios": this.scenarios,
			"tags": this.customTags,
		};
		return JSON.stringify(data, null, prettyprint ? "\t" : null);
	}

	load() {
		let success = false;
		let localdata = localStorage.getItem("database");
		if (localdata && !DATABASE_LOCKED) {
			success = this.importJSON(localdata);
		}

		if (!success) {
			console.log("Loading default database");
			this.importJSON(defaultDatabase);
		}

		this.save();
	}

	save() {
		if (!DATABASE_LOCKED) {
			localStorage.setItem("database", this.exportJSON());
		}
	}

	getUniqueId() {
		return uuidv4();
		//return this.uniqueIdCounter++;
	}

	// updateUniqueId() {
	// 	for (const node of this.nodes) {
	// 		this.uniqueIdCounter = Math.max(this.uniqueIdCounter, node.id + 1);
	// 		for (const stage of node.stages) {
	// 			this.uniqueIdCounter = Math.max(this.uniqueIdCounter, stage.id + 1);
	// 		}
	// 	}
	// 	for (const event of this.events) {
	// 		this.uniqueIdCounter = Math.max(this.uniqueIdCounter, event.id + 1);
	// 	}
	// 	for (const scenario of this.scenarios) {
	// 		this.uniqueIdCounter = Math.max(this.uniqueIdCounter, scenario.id + 1);
	// 	}
	// }


	/* Nodes */

	newNode() {
		return {
			"id": this.getUniqueId(),
			"name": "", // Latin
			"eng": "", // English
			"swe": "", // Swedish
			"chi": "", // Chinese
			"group": -1, // Serengeti node group
			"image": "missing",
			"color": "#000000",
			"description": null,
			"type": null,
			"tags": [],
			"animal": {
				"size": null,
				"food": null,
				// "consumption": 1.0,
				// "weight": 1.0,
				// "age": 1.0,
				// "offspring": 1.0
			},
			// "plant": {
				// "size": null
			// },
			// "fungi": {
				// "size": null
			// },
			"abiotic": {},
			"service": {
				"category": null
			},
			"notes": "",
			"relations": [],
			"stages": []
		};
	}

	loadNodes(list) {
		this.nodes.splice(0, this.nodes.length);

		if (list && Array.isArray(list)) {
			for (const data of list) {
				if (isPlainObject(data)) {
					let node = this.newNode();
					this.transferObject(data, node);

					// TODO: Possibly remove bad tags and delete incomplete relations
					node.relations = [];
					for (const r in data.relations) {
						this.addRelation(node, data.relations[r].type);
						this.transferObject(data.relations[r], node.relations[r]);
					}

					// TODO: Possibly remove bad tags and delete incomplete relations
					node.stages = [];
					for (const s in data.stages) {
						this.addStage(node);
						this.transferObject(data.stages[s], node.stages[s]);
						// TODO: Check if stages still exist
						node.stages[s].produces = data.stages[s].produces;
					}
					// TODO: Move all of this to "repair" function, or change database to sql already
					const stageIdList = node.stages.map(function(stage) { return stage.id; });
					for (const stage of node.stages) {
						for (const id in stage.produces) {
							if (!stageIdList.includes(id)) {
								delete stage.produces[id];
							}
						}
					}
					// Add default stage if none exists
					if (node.stages.length == 0) {
						this.addStage(node);
						node.stages[0].name = "Vuxen";
						node.stages[0].age = node.animal.age;
						node.stages[0].weight = node.animal.weight;
						node.stages[0].produces[node.stages[0].id] = node.animal.offspring;
						node.stages[0].isEdible = true;
						node.stages[0].isProducing = true;
						node.stages[0].isPopulation = true;
					}

					if (JSON.stringify(node) !== JSON.stringify(data)) {
						console.warn("Legacy node data updated");
					}

					this.nodes.push(node);
				}
			}
		}
	}

	addNode(node) {
		this.addObj(this.nodes, node);
		this.nodes.sort(this.nodeCompare);
	}

	getNodeById(id) {
		for (const node of this.nodes) {
			if (node.id == id) {
				return node;
			}
		}
		console.error("Could not find node with id '" + id + "'");
		return this.newNode();
	}

	getNodesByTags(tags) {
		let result = [];
		for (const node of this.nodes) {
			if (this.hasTags(node, tags)) {
				result.push(node);
			}
		}
		return result;
	}

	hasTags(node, otherTags) {
		let myTags = node.tags.slice();

		if (node.type)
			myTags.push("Type: " + getTextFromValue(NODE_TYPES, node.type));
		if (node.animal.food)
			myTags.push("Animal Diet: " + getTextFromValue(ANIMAL_FOODS, node.animal.food));
		if (node.animal.size)
			myTags.push("Animal Size: " + getTextFromValue(ANIMAL_SIZES, node.animal.size));
		if (node.service.category)
			myTags.push("Service Category: " + getTextFromValue(SERVICE_CATEGORIES, node.service.category));

		for (const tag of otherTags) {
			if (!myTags.includes(tag)) {
				return false;
			}
		}
		return true;
	}

	cloneNode(id) {
		let clone = JSON.parse(JSON.stringify(this.getNodeById(id)));
		if (clone) {
			clone.id = this.getUniqueId();
			clone.name = null;
			for (const stage of clone.stages) {
				stage.id = this.getUniqueId();
				stage.next = {};
				stage.produces = {};
			}
			return clone;
		}
	}

	deleteNode(id) {
		this.deleteObj(this.nodes, id);
	}

	nodeCompare(a, b) {
		if (a.type != b.type) {
			if (NODE_TYPES_VALUES.indexOf(a.type) < NODE_TYPES_VALUES.indexOf(b.type)) {
				return -1;
			}
			if (NODE_TYPES_VALUES.indexOf(a.type) > NODE_TYPES_VALUES.indexOf(b.type)) {
				return 1;
			}
		}
		if (a.type == "animal") {
			if (ANIMAL_FOODS_VALUES.indexOf(a.animal.food) < ANIMAL_FOODS_VALUES.indexOf(b.animal.food)) {
				return -1;
			}
			if (ANIMAL_FOODS_VALUES.indexOf(a.animal.food) > ANIMAL_FOODS_VALUES.indexOf(b.animal.food)) {
				return 1;
			}
		// 	if (a.animal.weight > b.animal.weight) {
		// 		return -1;
		// 	}
		// 	if (a.animal.weight < b.animal.weight) {
		// 		return 1;
		// 	}
		}
		if (a.type == "service") {
			if (SERVICE_CATEGORIES_VALUES.indexOf(a.service.category) < SERVICE_CATEGORIES_VALUES.indexOf(b.service.category)) {
				return -1;
			}
			if (SERVICE_CATEGORIES_VALUES.indexOf(a.service.category) > SERVICE_CATEGORIES_VALUES.indexOf(b.service.category)) {
				return 1;
			}
		}
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	}

	addRelation(node, type) {
		if (!["node", "tags"].includes(type)) {
			console.error("Unknown relation type");
			return;
		}
		node.relations.push({
			"type": type,
			"node_id": null,
			"stage_id": null,
			"tags": [],
			//"category": "",
			"interaction": "",
			"preference": 100,
		});
	}

	deleteRelation(node, index) {
		node.relations.splice(index, 1);
	}

	isAffected(relation, node) {
		if (relation && node) {
			if (relation.type == "node") {
				if (relation.node_id == node.id) {
					return true;
				}
			}
			// TODO: Add animal data non-tag checking
			if (relation.type == "tags") {
				if (relation.tags.length > 0 && this.hasTags(node, relation.tags)) {
					return true;
				}
			}
		}
		return false;
	}

	getAffectedNodes(relation) {
		let results = [];
		for (const node of this.nodes) {
			if (this.isAffected(relation, node)) {
				results.push(node);
			}
		}
		return results;
	}

	getIncomingRelations(node) {
		let results = [];
		for (const other of this.nodes) {
			if (node.id != other.id) {

				if (other.relations) {
					for (const rel of other.relations) {

						if (this.isAffected(rel, node)) {
							results.push({
								"node": other,
								"relation": rel,
							});
						}
					}
				}
			}
		}
		return results;
	}

	getOutgoingRelations(node) {
		let results = [];
		for (const other of this.nodes) {
			if (node.id != other.id) {

				if (node.relations) {
					for (const rel of node.relations) {

						if (this.isAffected(rel, other)) {
							results.push({
								"node": other,
								"relation": rel,
							});
						}
					}
				}
			}
		}
		return results;
	}

	getRelationPreference(node, relation) {
		let total = 0;
		for (const rel of node.relations) {
			if (rel.preference) {
				total += rel.preference;
			}
		}
		return relation.preference / total;
	}

	addStage(node) {
		node.stages.push({
			"id": this.getUniqueId(), // Unique stage id
			"name": null, // Stage name
			"age": null, // Maximum age
			"weight": null, // Edible weight
			"next": null, // The next stage the population is transferred to
			"survival": 100, // Odds of transfering to next
			"animal": {
				"consumption": 1.0, // Food kg/day
				"efficiency": 50, // Hunting "velocity" in competition for food
				"territory": 1, // Area km² per individual for intra-species competition
			},
			"plant": {
				"sunlight": 0, // Sunlight m² requirement
				"layer": STAGE_LAYERS[0].value, // Canopy layers in forests
				"shade": STAGE_SHADES[0].value, // Percentage of light passing through
			},
			"produces": {}, // Production of other stages within the species
			"isEdible": false, // Whether the stage is edible
			"isProducing": false, // Whether the stage can produce other stages
			"isPopulation": false // Whether the stage pop counts to the total pop
		});
	}

	deleteStage(node, index) {
		node.stages.splice(index, 1);
		// TODO: Reset other stages next/produces/requirements
	}

	getStageById(stage_id, node_id=null) {
		for (const node of this.nodes) {
			if (node_id == null || node.id == node_id) {
				for (const stage of node.stages) {
					if (stage.id == stage_id) {
						return stage;
					}
				}
			}
		}
		console.error("Could not find stage with id '" + stage_id + "'");
		return null;
	}


	/* Events */

	newEvent() {
		return {
			"id": this.getUniqueId(),
			"name": null,
			"description": null,
			"image": "missing",
			"duration": 0,
			"owner_id": null,
			"effects": []
		};
	}

	loadEvents(list) {
		this.events.splice(0, this.events.length);

		if (list && Array.isArray(list)) {
			for (const data of list) {
				if (isPlainObject(data)) {
					let event = this.newEvent();
					this.transferObject(data, event);

					// TODO: Possibly remove bad tags and delete incomplete effects
					event.effects = [];
					for (const r in data.effects) {
						this.addEffect(event, data.effects[r].type);
						this.transferObject(data.effects[r], event.effects[r]);
						// To be removed
						if (data.effects[r].something) {
							event.effects[r].value = data.effects[r].something;
						}
					}

					if (JSON.stringify(event) !== JSON.stringify(data)) {
						console.warn("Legacy event data updated");
					}

					this.events.push(event);
				}
			}
		}
	}

	addEvent(event) {
		this.addObj(this.events, event);
	}

	getEventById(id) {
		for (const event of this.events) {
			if (event.id == id) {
				return event;
			}
		}
		console.error("Could not find event with id '" + id + "'");
		return this.newEvent();
	}

	getEventsByOwner(id) {
		let results = [];
		for (const event of this.events) {
			if (event.owner_id == id) {
				results.push(event);
			}
		}
		return results;
	}

	cloneEvent(id) {
		let clone = JSON.parse(JSON.stringify(this.getEventById(id)));
		if (clone) {
			clone.id = this.getUniqueId();
			clone.name = null;
			return clone;
		}
	}

	deleteEvent(id) {
		this.deleteObj(this.events, id);
	}

	moveEvent(id, dir) {
		this.moveObj(this.events, id, dir);
	}

	eventCompare(a, b) {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	}

	addEffect(event, type) {
		if (!["node", "tags"].includes(type)) {
			console.error("Unknown relation type");
			return;
		}
		let effect = {
			"type": type,
			"node_id": null,
			"tags": [],
			"method": EFFECT_METHODS[0].value,
			"value": 0
		};
		event.effects.push(effect);
		return effect;
	}

	deleteEffect(event, index) {
		event.effects.splice(index, 1);
	}


	/* Scenarios */

	newScenario() {
		return {
			"id": this.getUniqueId(), // Scenario id
			"name": null, // Scenario title
			"time": {
				"deltatime": 0.1,
				"intro": 50,
				"outro": 50,
				"sections": 5,
				"length": 40,
				"playspeed": 5,
				"fastspeed": 50,
			},
			"budget": 100, // Budget for purchasing actions
			"budgetreward": 20, // Budget awarded each section
			"research": 1, // Research points for exploring nodes
			"researchreward": 1, // Research points awarded each section
			"description": "", // Briefing message upon start
			"stars": 0, // Stars required to unlock the scenario
			"position": [50,50], // Camera default position
			"actors": [], // List of actor nodes of species
			"actions": [], // List of actions of events
			"conditions": { // Victory conditions for star-rewards
				0: {},
				1: {},
				2: {},
				3: {},
			},
			"sunlight": 1000000,
			"territory": 100000,
		};
	}

	loadScenarios(list) {
		this.scenarios.splice(0, this.scenarios.length);

		if (list && Array.isArray(list)) {
			for (const data of list) {
				if (isPlainObject(data)) {
					let scenario = this.newScenario();
					this.transferObject(data, scenario);

					// TODO: Possibly remove bad tags and delete incomplete actors
					scenario.actors = [];
					for (const r in data.actors) {
						if (this.getNodeById(data.actors[r].node_id).name) {
							this.addActor(scenario);
							this.transferObject(data.actors[r], scenario.actors[scenario.actors.length-1]);
						}
					}

					if (data.conditions) {
						for (const tier in scenario.conditions) {
							if (data.conditions[tier]) {
								scenario.conditions[tier] = data.conditions[tier];
							}
						}
					}

					if (JSON.stringify(scenario) !== JSON.stringify(data)) {
						console.warn("Legacy scenario data updated");
					}

					this.scenarios.push(scenario);
				}
			}
		}
	}

	addScenario(scenario) {
		this.addObj(this.scenarios, scenario);
	}

	getScenarioById(id) {
		for (const scenario of this.scenarios) {
			if (scenario.id == id) {
				return scenario;
			}
		}
		console.error("Could not find scenario with id '" + id + "'");
		return this.newScenario();
	}

	cloneScenario(id) {
		let clone = JSON.parse(JSON.stringify(this.getScenarioById(id)));
		if (clone) {
			clone.id = this.getUniqueId();
			clone.name = null;
			return clone;
		}
	}

	deleteScenario(id) {
		this.deleteObj(this.scenarios, id);
	}

	moveScenario(id, dir) {
		this.moveObj(this.scenarios, id, dir);
	}

	scenarioCompare(a, b) {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	}

	// Actor: node in a scenario
	addActor(scenario) {
		let actor = {
			"node_id": null,
			"population": 1,
			"popfunc": "0.5",
			"visibility": ACTOR_VISIBILITY[0].value,
			"position": [0,0],
			"fixed": false,
		};
		scenario.actors.push(actor);
		return actor;
	}

	setActors(scenario, nodeList) {
		// Save old data
		let data = {};
		for (const i in scenario.actors) {
			let actor = scenario.actors[i];
			data[actor.node_id] = actor;
		}
		scenario.actors.splice(0, scenario.actors.length);

		// Add new actors from list in order
		for (const node of this.nodes) {
			if (nodeList.includes(node.id)) {
				let actor = this.addActor(scenario);
				this.transferObject(data[node.id], actor);
				actor.node_id = node.id;
			}
		}
	}

	// Action: event in a scenario
	addAction(scenario) {
		let action = {
			"event_id": null,
			"type": ACTION_TYPES[0].value,
			"time": 0,
			"cost": 0,
		};
		scenario.actions.push(action);
		return action;
	}

	setActions(scenario, eventList) {
		// Save old data
		let data = {};
		for (const i in scenario.actions) {
			let action = scenario.actions[i];
			data[action.event_id] = action;
		}
		scenario.actions.splice(0, scenario.actions.length);

		// Add new actions from list in order
		for (const event of this.events) {
			if (eventList.includes(event.id)) {
				let action = this.addAction(scenario);
				this.transferObject(data[event.id], action);
				action.event_id = event.id;
			}
		}
	}

	setConditions(scenario, newConditions, activeList) {
		for (const tier in scenario.conditions) {
			scenario.conditions[tier] = {};

			for (const id in newConditions[tier]) {
				if (activeList[tier][id]) {
					const range = newConditions[tier][id];
					if (Array.isArray(range) && range[0] !== null && range[1] !== null) {
						scenario.conditions[tier][id] = newConditions[tier][id];
					}
				}
			}

			scenario.conditions[tier].description = newConditions[tier].description;
		}
	}


	/* Tags */

	parseTags(list) {
		let result = [];
		let occupied = this.getDefaultTags();
		let allowSpace = false;

		for (const tag of list) {
			if ((!result.includes(tag) && !occupied.includes(tag)) || (tag == "" && allowSpace)) {
				result.push(tag);

				if (tag != "") {
					allowSpace = true;
				}
			}
		}

		// Remove trailing spaces
		while (result[result.length-1] == "") {
			result.splice(result.length-1, 1);
		}

		return result;
	}

	// Check for removed tags that break nodes or relations
	checkTagWarnings(list) {
		return this.setCustomTags(list, false);
	}

	setCustomTags(list, overwrite=true) {
		let warnings = [];
		let extra = this.getDefaultTags();

		// Remove legacy tags (should issue warning)
		for (const node of this.nodes) {
			let t = node.tags.length;
			while (t--) {
				let tag = node.tags[t];
				if (!list.includes(tag)) {
					warnings.push({tag, text: "removed from node", name: node.name});
					if (overwrite) {
						node.tags.splice(t, 1);
					}
				}
			}

			for (const rel of node.relations) {
				let t = rel.tags.length;
				while (t--) {
					let tag = rel.tags[t];
					if (!list.includes(tag) && !extra.includes(tag)) {
						warnings.push({tag, text: "removed from relation in node", name: node.name});
						if (overwrite) {
							rel.tags.splice(t, 1);
						}
					}
				}
			}
		}

		for (const event of this.events) {
			for (const eff of event.effects) {
				let e = eff.tags.length;
				while (e--) {
					let tag = eff.tags[e];
					if (!list.includes(tag) && !extra.includes(tag)) {
						warnings.push({tag, text: "removed from effect in event", name: event.name});
						if (overwrite) {
							eff.tags.splice(e, 1);
						}
					}
				}
			}
		}

		if (overwrite) {
			this.customTags.splice(0, this.customTags.length);
			for (const tag of this.parseTags(list)) {
				this.customTags.push(tag);
			}

			for (const warning of warnings) {
				console.warn(warning.tag, warning.text, warning.name);
			}
		}

		return warnings;
	}

	getCustomTags (removeEmpty=false) {
		if (removeEmpty) {
			return this.customTags.filter(Boolean);
		}
		return this.customTags;
	}

	getDefaultTags () {
		let result = [];

		function addCategory(list, name) {
			result.push("");
			for (const tag of list) {
				result.push(name + ": " + tag.text);
			}
		}

		addCategory(NODE_TYPES, "Type");
		addCategory(ANIMAL_FOODS, "Animal Diet");
		addCategory(ANIMAL_SIZES, "Animal Size");
		addCategory(SERVICE_CATEGORIES, "Service Category");

		return result;
	}

	getAllTags (customTags) {
		let result = customTags.slice();
		return result.concat(this.getDefaultTags());
	}

	loadCustomTags(list) {
		if (list && Array.isArray(list)) {
			this.setCustomTags(list);
		}
	}


	/* General actions */

	addObj(objs, obj) {
		for (let i = objs.length-1; i >= 0; i--) {
			if (objs[i].id == obj.id) {
				objs[i] = obj;
				return;
			}
		}
		objs.push(obj);
	}

	deleteObj(objs, id) {
		for (let i = objs.length-1; i >= 0; i--) {
			if (objs[i].id == id) {
				objs.splice(i, 1);
			}
		}
	}

	moveObj(objs, id, dir) {
		for (let i = objs.length-1; i >= 0; i--) {
			if (objs[i].id == id && objs[i+dir]) {
				let min = Math.min(i, i+dir);
				let max = Math.max(i, i+dir);
				objs.splice(min, 2, objs[max], objs[min]);
				return;
			}
		}
	}

	// Recursively copies data where keys match
	transferObject(data, obj) {
		if (!isPlainObject(data)) {
			return;
		}
		for (const key in obj) {
			if (data.hasOwnProperty(key)) {
				if (isPlainObject(data[key])) {
					this.transferObject(data[key], obj[key]);
				}
				else if ((typeof obj[key] === typeof data[key] || (!isNaN(obj[key]) && !isNaN(data[key]))) || obj[key] === null) {
					obj[key] = data[key];
				}
				else {
					console.warn("Type changed variable discarded:", obj[key], data[key]);
				}
			}
		}
	}
}
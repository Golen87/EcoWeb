class Database {
	constructor() {
		this.uniqueIdCounter = 1;

		this.nodes = [];
		this.events = [];
		this.scenarios = [];
		this.customTags = [];

		this.load();

		createDatabaseTools(this);
	}


	/* Data management */

	importJSON(json) {
		let data = JSON.parse(json);

		if (data) {
			this.loadNodes(data["nodes"]);
			this.loadEvents(data["events"]);
			this.loadScenarios(data["scenarios"]);
			this.loadCustomTags(data["tags"]);

			this.updateUniqueId();
		}

		this.nodes.sort(this.nodeCompare);
		this.save();
	}

	exportJSON(prettyprint=false) {
		let data = {
			"version": 1,
			"nodes": this.nodes,
			"events": this.events,
			"scenarios": this.scenarios,
			"tags": this.customTags,
		};
		return JSON.stringify(data, null, prettyprint ? "\t" : null);
	}

	load() {
		let localdata = localStorage.getItem("database");
		if (localdata) {
			this.importJSON(localdata);
		}
		else {
			this.importJSON(defaultDatabase);
		}
	}

	save() {
		localStorage.setItem("database", this.exportJSON());
	}

	getUniqueId() {
		return this.uniqueIdCounter++;
	}

	updateUniqueId() {
		for (const node of this.nodes) {
			this.uniqueIdCounter = Math.max(this.uniqueIdCounter, node.id + 1);
		}
		for (const event of this.events) {
			this.uniqueIdCounter = Math.max(this.uniqueIdCounter, event.id + 1);
		}
		for (const scenario of this.scenarios) {
			this.uniqueIdCounter = Math.max(this.uniqueIdCounter, scenario.id + 1);
		}
	}


	/* Nodes */

	newNode() {
		return {
			"id": this.getUniqueId(),
			"name": null,
			"image": "missing",
			"color": "#000000",
			"type": null,
			"tags": [],
			"animal": {
				"size": null,
				"food": null,
				"consumption": 1.0,
				"weight": 1.0,
				"age": 1.0,
				"offspring": 1.0
			},
			"plant": {
				"size": null
			},
			"fungi": {
				"size": null
			},
			"abiotic": {
				"category": null
			},
			"notes": "",
			"relations": []
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
					for (let r in data.relations) {
						this.addRelation(node, data.relations[r].type);
						this.transferObject(data.relations[r], node.relations[r]);
					}

					if (JSON.stringify(node) !== JSON.stringify(data)) {
						console.warn("Legacy node data found");
					}

					this.nodes.push(node);
				}
			}
		}
	}

	addNode(node) {
		this.deleteNode(node.id, false);
		this.nodes.push(node);
		this.nodes.sort(this.nodeCompare);
	}

	getNodeById(id) {
		for (const node of this.nodes) {
			if (node.id == id) {
				return node;
			}
		}
		throw "Could not find node with id '" + id + "'"
	}

	getNodesByTags(tags) {
		let result = [];
		for (const node of this.nodes) {
			if (this.hasTags(node)) {
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
		if (node.abiotic.category)
			myTags.push("Abiotic Category: " + getTextFromValue(ABIOTIC_CATEGORIES, node.abiotic.category));

		for (const tag of otherTags) {
			if (!myTags.includes(tag)) {
				return false;
			}
		}
		return true;
	}

	cloneNode(id) {
		let clone = { ...this.getNodeById(id) };
		if (clone) {
			clone.id = this.getUniqueId();
			clone.name = null;
			return clone;
		}
	}

	deleteNode(id, check=true) {
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
			if (a.animal.weight > b.animal.weight) {
				return -1;
			}
			if (a.animal.weight < b.animal.weight) {
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
			throw "Unknown relation type";
		}
		node.relations.push({
			"type": type,
			"node_id": -1,
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


	/* Events */

	newEvent() {
		return {
			"id": this.getUniqueId(),
			"name": null,
			"description": null,
			"image": "missing",
			"category": null,
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
					for (let r in data.effects) {
						this.addEffect(event, data.effects[r].type);
						this.transferObject(data.effects[r], event.effects[r]);
					}

					if (JSON.stringify(event) !== JSON.stringify(data)) {
						console.warn("Legacy event data found");
					}

					this.events.push(event);
				}
			}
		}
	}

	addEvent(event) {
		this.deleteEvent(event.id);
		this.events.push(event);
	}

	getEventById(id) {
		for (const event of this.events) {
			if (event.id == id) {
				return event;
			}
		}
		throw "Could not find event with id '" + id + "'"
	}

	cloneEvent(id) {
		let clone = { ...this.getEventById(id) };
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
			throw "Unknown relation type";
		}
		event.effects.push({
			"type": type,
			"node_id": -1,
			"tags": [],
			"something": 0
		});
	}

	deleteEffect(event, index) {
		event.effects.splice(index, 1);
	}


	/* Scenarios */

	newScenario() {
		return {
			"id": this.getUniqueId(),
			"name": null,
			"time": 100,
			"actors": [],
			"events": [],
			//"notes": null
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
					for (let r in data.actors) {
						this.addActor(scenario, data.actors[r].type);
						this.transferObject(data.actors[r], scenario.actors[r]);
					}

					if (JSON.stringify(scenario) !== JSON.stringify(data)) {
						console.warn("Legacy scenario data found");
					}

					this.scenarios.push(scenario);
				}
			}
		}
	}

	addScenario(scenario) {
		this.deleteScenario(scenario.id);
		this.scenarios.push(scenario);
	}

	getScenarioById(id) {
		for (const scenario of this.scenarios) {
			if (scenario.id == id) {
				return scenario;
			}
		}
		throw "Could not find scenario with id '" + id + "'"
	}

	cloneScenario(id) {
		let clone = { ...this.getScenarioById(id) };
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

	addActor(scenario) {
		scenario.actors.push({
			"node_id": -1,
			"population": 1,
		});
	}

	deleteActor(scenario, index) {
		scenario.actors.splice(index, 1);
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

			for (let warning of warnings) {
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
		addCategory(ABIOTIC_CATEGORIES, "Abiotic Category");

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
				else {
					obj[key] = data[key];
				}
			}
		}
	}
}
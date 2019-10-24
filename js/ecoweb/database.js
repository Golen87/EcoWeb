class Database {
	constructor() {
		this.uniqueIdCounter = 1;

		this.nodes = [];
		this.events = [];
		this.scenarios = [];
		this.tags = [];

		this.load();

		createDatabaseTools(this);
	}


	// Data management

	importJSON(json) {
		let data = JSON.parse(json);

		if (data) {

			if (!("version" in data)) {
				if (Array.isArray(data)) {
					data["nodes"] = data[0];
				}
				else {
					console.error("Malformed JSON:", data);
					return;
				}
			}

			this.loadNodes(data["nodes"]);
			this.loadTags(data["tags"]);
			//this.copyList(this.events, data["events"]);
			//this.copyList(this.scenarios, data["scenarios"]);
			//this.copyList(this.tags, data["tags"]);

			//for (var i = 0; i < this.nodes.length; i++) {
			//	if (!Array.isArray(this.nodes[i].relations)) {
			//		this.nodes[i].relations = [];
			//	}
			//}

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
			"tags": this.tags,
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
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id+1 > this.uniqueIdCounter) {
				this.uniqueIdCounter = this.nodes[i].id+1;
			}
		}
	}


	// Nodes

	newNode() {
		return {
			"id": this.getUniqueId(),
			"name": null,
			"image": "missing",
			"color": "#000000",
			"type": null,
			"animal": {
				"size": null,
				"food": null,
				"consumption": 1.0,
				"weight": 1.0,
				"age": 1.0,
				"offspring": 1.0,
				"diet": {}
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
			"notes": null,
			"relations": []
		};
	}

	loadNodes(list) {
		this.nodes.splice(0, this.nodes.length);
		for (var i = 0; i < list.length; i++) {
			this.nodes.push(list[i]);
		}
	}

	addNode(node) {
		this.deleteNode(node.id);
		this.nodes.push(node);
		this.nodes.sort(this.nodeCompare);
	}

	getNodeById(id) {
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id == id) {
				return this.nodes[i];
			}
		}
		throw "Could not find node '" + id + "'"
	}

	cloneNode(id) {
		let clone = { ...this.getNodeById(id) };
		if (clone) {
			clone.id = this.getUniqueId();
			clone.name = null;
			return clone;
		}
	}

	deleteNode(id) {
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id == id) {
				this.nodes.splice(i, 1);
			}
		}
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

	addRelation(node) {
		node.relations.push({
			//"type": "",
			"node_id": "", // id
			//"category": "",
			"interaction": "",
			"preference": 100,
		});
	}

	deleteRelation(node, index) {
		node.relations.splice(index, 1);
	}

	getIncomingRelations(id) {
		let results = [];

		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id != id) {

				let relations = this.nodes[i].relations;
				if (relations) {
					for (var j = 0; j < relations.length; j++) {
						if (id == relations[j].node_id) {
							results.push({
								"node": this.nodes[i],
								"relation": relations[j],
							});
						}
					}
				}
			}
		}
		
		return results;
	}


	// Tags

	setTags(list) {
		this.tags.splice(0, this.tags.length);
		for (var i = 0; i < list.length; i++) {
			this.tags.push(list[i]);
		}
	}

	loadTags(list) {
		if (list) {
			this.setTags(list);
		}
	}
}
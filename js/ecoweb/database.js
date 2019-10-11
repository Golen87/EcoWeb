class Database {
	constructor() {
		this.uniqueIdCounter = 1;

		this.nodes = [];
		this.events = [];
		this.scenarios = [];
		this.extra = [];

		this.load();

		createDatabaseTools(this);
	}


	// Data management

	copyList(a, b) {
		a.splice(0, a.length);
		for (var i = 0; i < b.length; i++) {
			a.push(b[i]);
		}
	}

	importJSON(json) {
		let data = JSON.parse(json);

		if (data) {
			this.copyList(this.nodes, data[0]);
			this.copyList(this.events, data[1]);
			this.copyList(this.scenarios, data[2]);
			this.copyList(this.extra, data[3]);

			this.updateUniqueId();
		}

		this.save();
	}

	exportJSON() {
		let data = [
			this.nodes,
			this.events,
			this.scenarios,
			this.extra
		];
		return JSON.stringify(data);
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
			"notes": null
		};
	}

	addNode(node) {
		this.deleteNode(node.id);
		this.nodes.push(node);
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
}
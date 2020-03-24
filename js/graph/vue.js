function createDatabaseTools(database) {

	/* Shared functions */

	function all_nodes() { return window.database.nodes; }
	function all_events() { return window.database.events; }
	function all_scenarios() { return window.database.scenarios; }
	function all_tags() { return window.database.getAllTags(window.database.getCustomTags()); }
	function all_custom_tags() { return window.database.getCustomTags(); }

	function getImage(image) {
		return getTextFromValue(NODE_IMAGES, image);
	}

	function getNode(actor) {
		return window.database.getNodeById(actor.node_id);
	}

	function getEvent(action) {
		return window.database.getEventById(action.event_id);
	}

	function checkAbiotic(actor) {
		return isAbiotic(getNode(actor).type);
	}


	const databaseEditor = new Vue({
		el: "#databaseEditor",
		data: {
			show: true,
		},
		computed: {
			total_nodes() { return window.database.nodes.length; },
			total_events() { return window.database.events.length; },
			total_scenarios() { return window.database.scenarios.length; },
			total_custom_tags() { return window.database.getCustomTags(true).length; },
		},
		methods: {
			open() {
				this.show = true;
			},
			openNodes() {
				this.show = false;
				nodeList.open();
			},
			openEvents() {
				this.show = false;
				eventList.open();
			},
			openScenarios() {
				this.show = false;
				scenarioList.open();
			},
			editTags() {
				this.show = false;
				tagEditor.open();
			},
			importFile() {
				$("#importJsonInput").click();
				$("#importJsonInput").change(function(event) {
					event.stopImmediatePropagation();
					if (this.files.length === 0)
						return;

					var reader = new FileReader();
					reader.onload = function(event) {
						try {
							let success = database.importJSON(event.target.result);
							if (success) {
								alert("Success! Loaded ({0}) nodes.".format(database.nodes.length));
								database.save();
							}
							else {
								throw "Couldn't load old database.";
							}
						}
						catch(error) {
							alert(error);
						}
					};
					reader.readAsText(this.files[0]);
				});
			},
			exportFile() {
				let filename = "ecoweb-{0}.json".format(getDateAsString());

				$("<a />", {
					"download": filename,
					"href" : "data:application/json," + encodeURIComponent(database.exportJSON(true))
				}).appendTo("body")
				.click(function() {
					$(this).remove();
				})
				.get(0).click();
			},
		},
	});

	const nodeList = new Vue({
		el: "#nodeList",
		data: {
			show: false,
			list: [],
		},
		methods: {
			open() {
				this.show = true;
				this.list = database.nodes;
			},
			back() {
				this.show = false;
				databaseEditor.open();
			},
			editNode(node) {
				this.show = false;
				nodeEditor.open(database.getNodeById(node.id));
			},
			copyNode(node) {
				this.show = false;
				nodeEditor.open(database.cloneNode(node.id));
			},
			deleteNode(node) {
				warningModal.show(
					"delete",
					"Are you sure you want to permanently delete this node?",
					function() {
						database.deleteNode(node.id);
						database.save();
					}.bind(this)
				);
			},
			addNode() {
				this.show = false;
				nodeEditor.open(database.newNode());
			},
			getImage,
		},
	});

	const eventList = new Vue({
		el: "#eventList",
		data: {
			show: false,
			list: [],
		},
		methods: {
			open() {
				this.show = true;
				this.list = database.events;
			},
			back() {
				this.show = false;
				databaseEditor.open();
			},
			editEvent(event) {
				this.show = false;
				eventEditor.open(database.getEventById(event.id));
			},
			copyEvent(event) {
				this.show = false;
				eventEditor.open(database.cloneEvent(event.id));
			},
			deleteEvent(event) {
				warningModal.show(
					"delete",
					"Are you sure you want to permanently delete this event?",
					function() {
						database.deleteEvent(event.id);
						database.save();
					}.bind(this)
				);
			},
			moveEvent(event, dir) {
				database.moveEvent(event.id, dir);
				database.save();
			},
			addEvent() {
				this.show = false;
				let event = database.newEvent();
				database.addEffect(event, "node");
				eventEditor.open(event);
			},
			getImage,
		},
	});

	const scenarioList = new Vue({
		el: "#scenarioList",
		data: {
			show: false,
			list: [],
		},
		methods: {
			open() {
				this.show = true;
				this.list = database.scenarios;
			},
			back() {
				this.show = false;
				databaseEditor.open();
			},
			editScenario(scenario) {
				this.show = false;
				scenarioEditor.open(database.getScenarioById(scenario.id));
			},
			copyScenario(scenario) {
				this.show = false;
				scenarioEditor.open(database.cloneScenario(scenario.id));
			},
			deleteScenario(scenario) {
				warningModal.show(
					"delete",
					"Are you sure you want to permanently delete this scenario?",
					function() {
						database.deleteScenario(scenario.id);
						database.save();
					}.bind(this)
				);
			},
			moveScenario(scenario, dir) {
				database.moveScenario(scenario.id, dir);
				database.save();
			},
			addScenario() {
				this.show = false;
				let scenario = database.newScenario();
				scenarioEditor.open(scenario);
			},
			getImage,
			getNode,
		},
	});

	const nodeEditor = new Vue({
		el: "#nodeEditor",
		data: {
			show: false,
			tab: 1,
			node: database.newNode(),
			ANIMAL_FOODS, ANIMAL_SIZES, NODE_TYPES, NODE_IMAGES, SERVICE_CATEGORIES, RELATION_INTERACTIONS,
		},
		computed: {
			all_nodes,
			all_tags,
			all_custom_tags,
			incoming_relations() { return window.database.getIncomingRelations(this.node); },
			outgoing_relations() { return window.database.getOutgoingRelations(this.node); },
			form_changed() { return JSON.stringify(this.node) !== JSON.stringify(this.original); },
		},
		methods: {
			open(node) {
				this.original = node;
				this.node = JSON.parse(JSON.stringify(node));
				this.show = true;
			},
			save(e) {
				e.preventDefault();

				let newNode = JSON.parse(JSON.stringify(this.node));
				database.addNode(newNode);
				database.save();

				// Force form_changed to update
				this.original = JSON.parse(JSON.stringify(this.node));
				this.node = JSON.parse(JSON.stringify(newNode));
			},
			cancel() {
				this.show = false;
				nodeList.open();
			},
			redirect(node) {
				if (this.form_changed) {
					warningModal.show(
						"save",
						"Do you wish to save your changes?",
						function() {
							let form = $(this.$el);
							form.find(":submit").click();
							if (form[0].checkValidity()) {
								this.open(node);
							}
						}.bind(this),
						this.open.bind(this, node)
					);
				}
				else {
					this.open(node);
				}
			},
			setTab(tab) {
				let form = $(this.$el);
				if(!form[0].checkValidity()) {
					form.find(":submit").click();
				}
				else {
					this.tab = tab;
				}
			},
			addRelation(type) {
				database.addRelation(this.node, type);
			},
			deleteRelation(index) {
				database.deleteRelation(this.node, index);
			},
			getPreference(relation) {
				let perc = window.database.getRelationPreference(this.node, relation);
				let rounded = Math.round(100 * perc);
				return "~" + rounded + "%";
			},
			getStrippedPath(path) { return path.substring(path.lastIndexOf("/") + 1, path.length); },
			getImage,
		}
	});

	const eventEditor = new Vue({
		el: "#eventEditor",
		data: {
			show: false,
			tab: 1,
			event: database.newEvent(),
			NODE_IMAGES,
		},
		computed: {
			all_nodes,
			all_events,
			all_tags,
			form_changed() { return JSON.stringify(this.event) !== JSON.stringify(this.original); },
		},
		methods: {
			open(event) {
				this.original = event;
				this.event = JSON.parse(JSON.stringify(event));
				this.show = true;
			},
			save(e) {
				e.preventDefault();

				let newEvent = JSON.parse(JSON.stringify(this.event));
				database.addEvent(newEvent);
				database.save();

				// Force form_changed to update
				this.original = JSON.parse(JSON.stringify(this.event));
				this.event = JSON.parse(JSON.stringify(newEvent));
				//this.cancel();
			},
			cancel() {
				this.show = false;
				eventList.open();
			},
			addEffect(type) {
				database.addEffect(this.event, type);
			},
			deleteEffect(index) {
				database.deleteEffect(this.event, index);
			},
			getImage,
		},
	});

	const scenarioEditor = new Vue({
		el: "#scenarioEditor",
		data: {
			show: false,
			tab: 1,
			scenario: database.newScenario(),
			ACTOR_VISIBILITY, ACTION_TYPES,
		},
		computed: {
			all_nodes,
			form_changed() { return JSON.stringify(this.scenario) !== JSON.stringify(this.original); },
			abiotic_functions_valid() {
				for (const actor of this.scenario.actors) {
					const type = database.getNodeById(actor.node_id).type;
					if (isAbiotic(type)) {
						if (!this.checkAbioticFunction(actor)) {
							return false;
						}
					}
				}
				return true;
			},
		},
		methods: {
			open(scenario) {
				this.original = scenario;
				this.scenario = JSON.parse(JSON.stringify(scenario));
				this.show = true;
			},
			save(e) {
				e.preventDefault();

				for (const actor of this.scenario.actors) {
					const type = database.getNodeById(actor.node_id).type;
					if (isAbiotic(type)) {
						if (!this.checkAbioticFunction(actor)) {
							console.log("save fail");
							return false;
						}
					}
				}

				let newScenario = JSON.parse(JSON.stringify(this.scenario));
				database.addScenario(newScenario);
				database.save();

				// Force form_changed to update
				this.original = JSON.parse(JSON.stringify(this.scenario));
				this.scenario = JSON.parse(JSON.stringify(newScenario));
				//this.cancel();
			},
			cancel() {
				this.show = false;
				scenarioList.open();
			},
			setTab(tab) {
				var form = $(this.$el);
				if(!form[0].checkValidity()) {
					form.find(":submit").click();
				}
				else {
					this.tab = tab;
				}
			},
			openNodeSelector() {
				let idList = [];
				for (const actor of this.scenario.actors) {
					idList.push(actor.node_id);
				}
				nodeSelectorModal.show(
					"Select nodes",
					database.nodes,
					idList,
					this.setActors.bind(this)
				);
			},
			openEventSelector() {
				let idList = [];
				for (const action of this.scenario.actions) {
					idList.push(action.event_id);
				}
				nodeSelectorModal.show(
					"Select events",
					database.events,
					idList,
					this.setActions.bind(this)
				);
			},
			setActors(idList) {
				database.setActors(this.scenario, idList);
			},
			setActions(idList) {
				database.setActions(this.scenario, idList);
			},
			run() {
				let form = $(this.$el);
				form.find(":submit").click();
				if (form[0].checkValidity()) {
					// Hack
					for (var i = database.scenarios.length - 1; i >= 0; i--) {
						if (this.scenario.id == database.scenarios[i].id) {
							web.startScenario(i);
						}
					}
				}
			},
			getImage,
			getNode,
			getEvent,
			checkAbiotic,
			checkAbioticFunction(actor) {
				try {
					const result = math.evaluate(actor.popfunc, {t: 0});
					if (typeof result != 'number') {
						return false;
					}
				}
				catch(error) {
					return false;
				}
				return true;
			},
		},
	});

	const tagEditor = new Vue({
		el: "#tagEditor",
		data: {
			show: false,
			tags: "",
			tagMap: {}
		},
		computed: {
			parsed_tags() {
				return database.parseTags(this.tags.split("\n"));
			},
			tag_warnings() {
				let tags = this.tags.split("\n");
				tags = database.parseTags(tags);
				tags = database.getAllTags(tags);
				return database.checkTagWarnings(tags);
			},
		},
		methods: {
			open() {
				const customTags = database.getCustomTags();
				this.tags = customTags.join("\n");
				this.show = true;

				for (const tag of customTags) {
					Vue.set(this.tagMap, tag, []);
					for (const node of database.nodes) {
						if (node.tags.includes(tag)) {
							this.tagMap[tag].push(node.id);
						}
					}
				}
			},
			save(e) {
				e.preventDefault();

				if (this.tag_warnings.length > 0) {
					warningModal.show(
						"save",
						"Are you sure you wish to save? This will permanently delete tags from existing nodes and relations.",
						this.confirmSave.bind(this),
						this.cancel.bind(this)
					);
				}
				else {
					this.confirmSave();
				}
			},
			confirmSave() {
				let tags = this.tags.split("\n");

				for (const tag of tags) {
					for (const node of database.nodes) {
						if (this.tagMap[tag].includes(node.id)) {
							if (!node.tags.includes(tag)) {
								node.tags.push(tag);
							}
						}
						else {
							const index = node.tags.indexOf(tag);
							if (index > -1) {
								node.tags.splice(index, 1);
							}
						}
					}
				}

				database.setCustomTags(tags, true);
				database.save();

				this.cancel();
			},
			cancel() {
				this.show = false;
				databaseEditor.open();
			},
			getNodeCountByTag(tag) {
				if (this.tagMap[tag]) {
					return this.tagMap[tag].length;
				}
				return 0;
			},
			selectNodes(tag) {
				//let nodes = database.getNodesByTags([tag]);
				//const nodeList = nodes.map(function(node) { return node.id; });
				const idList = this.tagMap[tag];

				nodeSelectorModal.show(
					"Select nodes for tag <b>" + tag + "</b>",
					database.nodes,
					idList,
					this.setTagToNodes.bind(this, tag)
				);
			},
			setTagToNodes(tag, idList) {
				Vue.set(this.tagMap, tag, idList);
				//Vue.set(this.tagMap, tag, this.getNodeCountByTag(tag));
			}
		},
	});

	const warningModal = new Vue({
		el: "#warningModal",
		data: {
			titleText: "Warning",
			bodyText: "Body",
			acceptText: "Accept",
			denyText: "Deny",
			type: null,
			acceptCallback: null,
			denyCallback: null,
		},
		methods: {
			show(type, text, acceptCallback=null, denyCallback=null) {
				this.type = type;
				this.bodyText = text;
				this.acceptCallback = acceptCallback;
				this.denyCallback = denyCallback;

				if (type == "save") {
					this.acceptText = "Save";
					this.denyText = "Discard";
				}
				else if (type == "delete") {
					this.acceptText = "Delete";
					this.denyText = "Cancel";
				}

				$("#warningModal").modal("show");
			},
			hide() {
				$("#warningModal").modal("hide");
			},
			accept() {
				this.hide();
				if (this.acceptCallback) {
					this.acceptCallback();
				}
			},
			deny() {
				this.hide();
				if (this.denyCallback) {
					this.denyCallback();
				}
			},
		},
	});

	const nodeSelectorModal = new Vue({
		el: "#nodeSelectorModal",
		data: {
			selected: {},
			allNodes: [],
			titleText: null,
			bodyText: "Body",
			acceptText: "Accept",
			denyText: "Deny",
			callback: null,
		},
		methods: {
			show(titleText, allNodes, nodeList=[], callback=null) {
				this.titleText = titleText;
				this.allNodes = allNodes;
				this.callback = callback;

				for (const node of this.allNodes) {
					Vue.set(this.selected, node.id, nodeList.includes(node.id));
				}

				$("#nodeSelectorModal").modal("show");
			},
			hide() {
				$("#nodeSelectorModal").modal("hide");
			},
			accept() {
				let nodeList = [];
				for (const nodeId in this.selected) {
					if (this.selected[nodeId]) {
						nodeList.push(parseInt(nodeId));
					}
				}

				this.hide();
				if (this.callback) {
					this.callback(nodeList);
				}
			},
			getImage,
		}
	});

	//initNodeChart();
	//databaseEditor.openNodes();
	//nodeList.editTags();
	//nodeList.editNode(nodeList.list[0]);
	//nodeEditor.setTab(2);
}
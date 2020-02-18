function createGraphTools() {
	return new Vue({
		el: "#graphTools",
		data: {
			duration: 100,
			species: [],
			scenarios: [],
			main: {show: false},
			isActive: true
		},
		computed: {
			total: function () {
				return 10;
			}
		},
		methods: {
			wiggle(event) {
				web.initWiggle();
				this.updateGraph();
			},
			stabilize(event) {
				web.stabilize();
				this.updateGraph();
			},
			reset(event) {
				this.updateGraph();
			},
			startScenario(id) {
				web.startScenario(id);
			},
			updateValue(event, s, key) {
				s[key] = parseFloat(event.target.value);
				this.updateGraph();
			},
			updateDuration(event) {
				this.duration = parseFloat(event.target.value);
				web.maxTime = this.duration;
				this.updateGraph();
			},
			updateGraph() {
				web.refresh();
			},
			toggleShow(event, s) {
				s.show = !s.show;
			},
			toggleEnable(event, s) {
				s.enable = !s.enable;
				this.updateGraph();
			},
			toggleShowGraph(event, s) {
				s.showGraph = !s.showGraph;
				this.updateGraph();
			},
		},
	});
}

function createDatabaseTools(database) {

	let databaseEditor = new Vue({
		el: "#databaseEditor",
		data: {
			show: true,
		},
		computed: {
			nodeCount: function () {
				return database.nodes.length;
			},
			allData: function () {
				return database.exportJSON(true);
			},
			nodes: function () { return database.nodes; },
			events: function () { return database.events; },
			scenarios: function () { return database.scenarios; },
			tags: function () { return database.getCustomTags(true); },
		},
		methods: {
			open: function () {
				this.show = true;
			},
			openNodes: function () {
				this.show = false;
				nodeList.open();
			},
			openEvents: function () {
				this.show = false;
				eventList.open();
			},
			openScenarios: function () {
				this.show = false;
				scenarioList.open();
			},
			editTags: function () {
				this.show = false;
				tagEditor.open();
			},
			importFile: function () {
				$("#importJsonInput").click();
				$("#importJsonInput").change(function(event) {
					if (this.files.length === 0)
						return;

					var reader = new FileReader();
					reader.onload = function(event) {
						try {
							database.importJSON(event.target.result);
							alert("Success! Loaded ({0}) nodes.".format(
								database.nodes.length));
						}
						catch(error) {
							alert(error);
						}
					};
					reader.readAsText(this.files[0]);
				});
			},
			exportFile: function () {
				let filename = "ecoweb-{0}.json".format(getDateAsString());

				$("<a />", {
					"download": filename,
					"href" : "data:application/json," + encodeURIComponent(database.exportJSON(true))
				}).appendTo("body")
				.click(function() {
					$(this).remove()
				})
				.get(0).click();
			},
		},
	});

	let nodeList = new Vue({
		el: "#nodeList",
		data: {
			show: false,
			list: [],
		},
		methods: {
			open: function () {
				this.show = true;
				this.list = database.nodes;
			},
			back: function () {
				this.show = false;
				databaseEditor.open();
			},
			getImage: function (image) {
				return getTextFromValue(NODE_IMAGES, image);
			},
			editNode: function (node) {
				this.show = false;
				nodeEditor.open(database.getNodeById(node.id));
			},
			copyNode: function (node) {
				this.show = false;
				nodeEditor.open(database.cloneNode(node.id));
			},
			deleteNode: function (node) {
				warningModal.show(
					"delete",
					"Are you sure you want to permanently delete this node?",
					function() {
						database.deleteNode(node.id);
						database.save();
					}.bind(this)
				);
			},
			addNode: function () {
				this.show = false;
				nodeEditor.open(database.newNode());
			},
		},
	});

	let eventList = new Vue({
		el: "#eventList",
		data: {
			show: false,
			list: [],
		},
		methods: {
			open: function () {
				this.show = true;
				this.list = database.events;
			},
			back: function () {
				this.show = false;
				databaseEditor.open();
			},
			editEvent: function (event) {
				this.show = false;
				eventEditor.open(database.getEventById(event.id));
			},
			copyEvent: function (event) {
				this.show = false;
				eventEditor.open(database.cloneEvent(event.id));
			},
			deleteEvent: function (event) {
				warningModal.show(
					"delete",
					"Are you sure you want to permanently delete this event?",
					function() {
						database.deleteEvent(event.id);
						database.save();
					}.bind(this)
				);
			},
			moveEvent: function (event, dir) {
				database.moveEvent(event.id, dir);
				database.save();
			},
			addEvent: function () {
				this.show = false;
				let event = database.newEvent();
				database.addEffect(event, "node");
				eventEditor.open(event);
			},
			getImage: function (image) {
				return getTextFromValue(NODE_IMAGES, image);
			},
		},
	});

	let scenarioList = new Vue({
		el: "#scenarioList",
		data: {
			show: false,
			list: [],
		},
		methods: {
			open: function () {
				this.show = true;
				this.list = database.scenarios;
			},
			back: function () {
				this.show = false;
				databaseEditor.open();
			},
			editScenario: function (scenario) {
				this.show = false;
				scenarioEditor.open(database.getScenarioById(scenario.id));
			},
			copyScenario: function (scenario) {
				this.show = false;
				scenarioEditor.open(database.cloneScenario(scenario.id));
			},
			deleteScenario: function (scenario) {
				warningModal.show(
					"delete",
					"Are you sure you want to permanently delete this scenario?",
					function() {
						database.deleteScenario(scenario.id);
						database.save();
					}.bind(this)
				);
			},
			moveScenario: function (scenario, dir) {
				database.moveScenario(scenario.id, dir);
				database.save();
			},
			addScenario: function () {
				this.show = false;
				let scenario = database.newScenario();
				scenarioEditor.open(scenario);
			},
			getNodeImage: function (actor) {
				let image = database.getNodeById(actor.node_id).image;
				return getTextFromValue(NODE_IMAGES, image);
			},
			getNodeColor: function (actor) {
				return database.getNodeById(actor.node_id).color;
			},
			getNodeName: function (actor) {
				return database.getNodeById(actor.node_id).name;
			},
		},
	});

	let nodeEditor = new Vue({
		el: "#nodeEditor",
		data: {
			show: false,
			tab: 1,
			node: database.newNode()
		},
		computed: {
			incoming_relations: function () {
				return database.getIncomingRelations(this.node);
			},
			outgoing_relations: function () {
				return database.getOutgoingRelations(this.node);
			},
			imagesrc: function () {
				return getTextFromValue(NODE_IMAGES, this.node.image);
			},
			all_nodes: function () { return database.nodes; },
			custom_tags: function () { return database.getCustomTags(); },
			all_tags: function () { return database.getAllTags(database.getCustomTags()); },
			node_types: function () { return NODE_TYPES; },
			animal_foods: function () { return ANIMAL_FOODS; },
			animal_sizes: function () { return ANIMAL_SIZES; },
			node_images: function () { return NODE_IMAGES; },
			abiotic_categories: function () { return ABIOTIC_CATEGORIES; },
			relation_interactions: function () { return RELATION_INTERACTIONS; },
			form_changed: function () { return JSON.stringify(this.node) !== JSON.stringify(this.original); },
		},
		methods: {
			open: function (node) {
				this.original = node;
				this.node = JSON.parse(JSON.stringify(node));
				this.show = true;
			},
			save: function (e) {
				e.preventDefault();

				let newNode = JSON.parse(JSON.stringify(this.node));
				database.addNode(newNode);
				database.save();

				// Force form_changed to update
				this.original = JSON.parse(JSON.stringify(this.node));
				this.node = JSON.parse(JSON.stringify(newNode));
			},
			cancel: function () {
				this.show = false;
				nodeList.open();
			},
			redirect: function (node) {
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
			setTab: function (tab) {
				let form = $(this.$el);
				if(!form[0].checkValidity()) {
					form.find(":submit").click();
				}
				else {
					this.tab = tab;
				}
			},
			addRelation: function (type) {
				database.addRelation(this.node, type);
			},
			deleteRelation: function (index) {
				database.deleteRelation(this.node, index);
			},
			getImage: function (image) {
				return getTextFromValue(NODE_IMAGES, image);
			},
			getPreference: function (relation) {
				let perc = database.getRelationPreference(this.node, relation);
				perc *= 100;
				let rounded = Math.round(perc);
				return "~" + rounded + "%";
			},
		}
	});

	let eventEditor = new Vue({
		el: "#eventEditor",
		data: {
			show: false,
			tab: 1,
			event: database.newEvent()
		},
		computed: {
			outgoing_effects: function () {
				return database.getOutgoingRelations(this.event);
			},
			imagesrc: function () {
				return getTextFromValue(NODE_IMAGES, this.event.image);
			},
			all_nodes: function () { return database.nodes; },
			all_events: function () { return database.events; },
			custom_tags: function () { return database.getCustomTags(); },
			all_tags: function () { return database.getAllTags(database.getCustomTags()); },
			abiotic_categories: function () { return ABIOTIC_CATEGORIES; },
			node_images: function () { return NODE_IMAGES; },
			form_changed: function () { return JSON.stringify(this.event) !== JSON.stringify(this.original); },
		},
		methods: {
			open: function (event) {
				this.original = event;
				this.event = JSON.parse(JSON.stringify(event));
				this.show = true;
			},
			save: function (e) {
				e.preventDefault();

				let newEvent = JSON.parse(JSON.stringify(this.event));
				database.addEvent(newEvent);
				database.save();

				// Force form_changed to update
				this.original = JSON.parse(JSON.stringify(this.event));
				this.event = JSON.parse(JSON.stringify(newEvent));
				//this.cancel();
			},
			cancel: function () {
				this.show = false;
				eventList.open();
			},
			addEffect: function (type) {
				database.addEffect(this.event, type);
			},
			deleteEffect: function (index) {
				database.deleteEffect(this.event, index);
			},
			getImage: function (image) {
				return getTextFromValue(EVENT_IMAGES, image);
			},
			getPreference: function (effect) {
				let perc = database.getEffectPreference(this.event, effect);
				perc *= 100;
				let rounded = Math.round(perc);
				return "~" + rounded + "%";
			},
		},
	});

	let scenarioEditor = new Vue({
		el: "#scenarioEditor",
		data: {
			show: false,
			tab: 1,
			scenario: database.newScenario()
		},
		computed: {
			//imagesrc: function () {
			//	return getTextFromValue(NODE_IMAGES, this.scenario.image);
			//},
			all_nodes: function () { return database.nodes; },
			all_visibility: function () { return ACTOR_VISIBILITY; },
			form_changed: function () { return JSON.stringify(this.scenario) !== JSON.stringify(this.original); },
		},
		methods: {
			open: function (scenario) {
				this.original = scenario;
				this.scenario = JSON.parse(JSON.stringify(scenario));
				this.show = true;
			},
			save: function (e) {
				e.preventDefault();

				let newScenario = JSON.parse(JSON.stringify(this.scenario));
				database.addScenario(newScenario);
				database.save();

				// Force form_changed to update
				this.original = JSON.parse(JSON.stringify(this.scenario));
				this.scenario = JSON.parse(JSON.stringify(newScenario));
				//this.cancel();
			},
			cancel: function () {
				this.show = false;
				scenarioList.open();
			},
			setTab: function (tab) {
				var form = $(this.$el);
				if(!form[0].checkValidity()) {
					form.find(":submit").click();
				}
				else {
					this.tab = tab;
				}
			},
			openNodeSelector: function () {
				let idList = [];
				for (const actor of this.scenario.actors) {
					idList.push(actor.node_id);
				}
				nodeSelectorModal.show(
					"Select nodes",
					idList,
					this.setActors.bind(this)
				);
			},
			setActors(idList) {
				database.setActors(this.scenario, idList);
			},
			run: function () {
				$(this.$el).find(":submit").click();
				// Hack
				for (var i = database.scenarios.length - 1; i >= 0; i--) {
					if (this.scenario.id == database.scenarios[i].id) {
						web.startScenario(i);
					}
				}
			},
			getNodeImage: function (actor) {
				let image = database.getNodeById(actor.node_id).image;
				return getTextFromValue(NODE_IMAGES, image);
			},
			getNodeColor: function (actor) {
				return database.getNodeById(actor.node_id).color;
			},
			getNodeName: function (actor) {
				return database.getNodeById(actor.node_id).name;
			},
		},
	});

	let tagEditor = new Vue({
		el: "#tagEditor",
		data: {
			show: false,
			tags: "",
			tagMap: {}
		},
		computed: {
			parsed_tags: function () {
				return database.parseTags(this.tags.split("\n"));
			},
			tag_warnings: function () {
				let tags = this.tags.split("\n");
				tags = database.parseTags(tags);
				tags = database.getAllTags(tags);
				return database.checkTagWarnings(tags);
			},
		},
		methods: {
			open: function () {
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
			save: function (e) {
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
			confirmSave: function () {
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
			cancel: function () {
				this.show = false;
				databaseEditor.open();
			},
			getNodeCountByTag: function (tag) {
				if (this.tagMap[tag]) {
					return this.tagMap[tag].length;
				}
				return 0;
			},
			selectNodes: function (tag) {
				//let nodes = database.getNodesByTags([tag]);
				//const nodeList = nodes.map(function(node) { return node.id; });
				const idList = this.tagMap[tag];

				nodeSelectorModal.show(
					"Select nodes for tag <b>" + tag + "</b>",
					idList,
					this.setTagToNodes.bind(this, tag)
				);
			},
			setTagToNodes: function (tag, idList) {
				Vue.set(this.tagMap, tag, idList);
				//Vue.set(this.tagMap, tag, this.getNodeCountByTag(tag));
			}
		},
	});

	let warningModal = new Vue({
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
			show: function (type, text, acceptCallback=null, denyCallback=null) {
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

				$('#warningModal').modal('show');
			},
			hide: function () {
				$("#warningModal").modal("hide");
			},
			accept: function () {
				this.hide();
				if (this.acceptCallback) {
					this.acceptCallback();
				}
			},
			deny: function () {
				this.hide();
				if (this.denyCallback) {
					this.denyCallback();
				}
			},
		},
	});

	let nodeSelectorModal = new Vue({
		el: "#nodeSelectorModal",
		data: {
			selected: {},
			titleText: null,
			bodyText: "Body",
			acceptText: "Accept",
			denyText: "Deny",
			callback: null,
		},
		computed: {
			all_nodes: function () { return database.nodes; },
		},
		methods: {
			show: function (titleText, nodeList=[], callback=null) {
				this.titleText = titleText;
				this.callback = callback;

				for (const node of this.all_nodes) {
					Vue.set(this.selected, node.id, nodeList.includes(node.id));
				}

				$('#nodeSelectorModal').modal('show');
			},
			hide: function () {
				$("#nodeSelectorModal").modal("hide");
			},
			accept: function () {
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
			getImage: function (image) {
				return getTextFromValue(NODE_IMAGES, image);
			},
		}
	});

	//initNodeChart();
	//databaseEditor.openNodes();
	//nodeList.editTags();
	//nodeList.editNode(nodeList.list[0]);
	//nodeEditor.setTab(2);
}

$(document).ready(function() {
	//Vue.component("vue-multiselect", window.VueMultiselect.default);
	//$(".selectpicker").selectpicker();
});
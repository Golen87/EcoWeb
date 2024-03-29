function createDatabaseTools(database) {

	/* Shared functions */

	function all_nodes() { return window.database.nodes; }
	function all_events() { return window.database.events; }
	function all_scenarios() { return window.database.scenarios; }
	function all_tags() { return window.database.getAllTags(window.database.getCustomTags()); }
	function all_custom_tags() { return window.database.getCustomTags(); }

	function getImage(image) {
		return NODE_IMAGES_PATH_SMALL + getTextFromValue(NODE_IMAGES, image);
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


	function open() {
		this.show = true;
	}

	function close() {
		if (this.form_changed && this.trySubmit) {
			const response = confirm("Do you wish to save your changes?");
			if (response) {
				const success = this.trySubmit();
				if (!success) {
					throw "Invalid form";
				}
			}
		}
		this.show = false;
	}

	function trySubmit() {
		const form = $(this.$el);
		form.find(":submit").click();
		if (form[0].reportValidity()) {
			return true;
		}
		return false;
	}


	function resetTabs() {
		nodeList.close();
		eventList.close();
		scenarioList.close();
		nodeEditor.close();
		eventEditor.close();
		scenarioEditor.close();
		tagEditor.close();
	}

	function gotoNodes() {
		resetTabs();
		nodeList.open();
	}
	function gotoEvents() {
		resetTabs();
		eventList.open();
	}
	function gotoScenarios() {
		resetTabs();
		scenarioList.open();
	}
	function gotoTags() {
		resetTabs();
		tagEditor.open();
	}
	function gotoNodeEditor(node) {
		resetTabs();
		nodeEditor.open(node);
	}
	function gotoEventEditor(event) {
		resetTabs();
		eventEditor.open(event);
	}
	function gotoScenarioEditor(scenario) {
		resetTabs();
		scenarioEditor.open(scenario);
	}


	/* Editors */

	const databaseTabs = new Vue({
		el: "#databaseTabs",
		data: {
			database,
		},
		computed: {
			total_nodes() { return this.database.nodes.length; },
			total_events() { return this.database.events.length; },
			total_scenarios() { return this.database.scenarios.length; },
			total_custom_tags() { return this.database.getCustomTags(true).length; },
		},
		methods: {
			gotoNodes,
			gotoEvents,
			gotoScenarios,
			gotoTags,
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
								alert("Success! Loaded ({0}) nodes, ({1}) events, ({2}) scenarios, ({3}) tags.".format(
									databaseTabs.total_nodes,
									databaseTabs.total_events,
									databaseTabs.total_scenarios,
									databaseTabs.total_custom_tags
								));
								database.save();
								location.reload();
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
			close,
			editNode(node) {
				this.show = false;
				gotoNodeEditor(database.getNodeById(node.id));
			},
			copyNode(node) {
				this.show = false;
				gotoNodeEditor(database.cloneNode(node.id));
			},
			deleteNode(node) {
				const response = confirm("Are you sure you want to permanently delete this node?");
				if (response) {
					database.deleteNode(node.id);
					database.save();
				}
			},
			addNode() {
				this.show = false;
				gotoNodeEditor(database.newNode());

				//let node = database.newNode();
				//database.addStage(node);
				//gotoNodeEditor(node);
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
			close,
			editEvent(event) {
				this.show = false;
				gotoEventEditor(database.getEventById(event.id));
			},
			copyEvent(event) {
				this.show = false;
				gotoEventEditor(database.cloneEvent(event.id));
			},
			deleteEvent(event) {
				const response = confirm("Are you sure you want to permanently delete this event?");
				if (response) {
					database.deleteEvent(event.id);
					database.save();
				}
			},
			moveEvent(event, dir) {
				database.moveEvent(event.id, dir);
				database.save();
			},
			addEvent() {
				this.show = false;
				let event = database.newEvent();
				database.addEffect(event, "node");
				gotoEventEditor(event);
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
			close,
			editScenario(scenario) {
				this.show = false;
				gotoScenarioEditor(database.getScenarioById(scenario.id));
			},
			copyScenario(scenario) {
				this.show = false;
				gotoScenarioEditor(database.cloneScenario(scenario.id));
			},
			deleteScenario(scenario) {
				const response = confirm("Are you sure you want to permanently delete this scenario?");
				if (response) {
					database.deleteScenario(scenario.id);
					database.save();
				}
			},
			moveScenario(scenario, dir) {
				database.moveScenario(scenario.id, dir);
				database.save();
			},
			addScenario() {
				this.show = false;
				let scenario = database.newScenario();
				gotoScenarioEditor(scenario);
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
			original: database.newNode(),
			selectedStage: 0,
			ANIMAL_FOODS, ANIMAL_SIZES, NODE_TYPES, NODE_IMAGES, SERVICE_CATEGORIES, RELATION_INTERACTIONS, STAGE_LAYERS, STAGE_SHADES
		},
		computed: {
			all_nodes,
			all_tags,
			all_custom_tags,
			incoming_relations() { return window.database.getIncomingRelations(this.node); },
			outgoing_relations() { return window.database.getOutgoingRelations(this.node); },
			all_stages() { return [{value:null, text:"<none>"}].concat(this.node.stages.map((stage) => {return {value:stage.id, text:stage.name};})); },
			selected() { return this.node.stages[this.selectedStage]; },
			form_changed() { return this.show && JSON.stringify(this.node) !== JSON.stringify(this.original); },
		},
		methods: {
			gotoNodes,
			open(node) {
				this.original = node;
				this.node = JSON.parse(JSON.stringify(node));
				this.selectedStage = 0;
				this.show = true;
				this.tab = 1;
			},
			close,
			trySubmit,
			save(e) {
				e.preventDefault();

				let newNode = JSON.parse(JSON.stringify(this.node));
				database.addNode(newNode);
				database.save();

				// Force form_changed to update
				this.original = JSON.parse(JSON.stringify(this.node));
				this.node = JSON.parse(JSON.stringify(newNode));
			},
			gotoNodeEditor,
			setTab(tab) {
				if (this.checkForm()) {
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
			addStage() {
				if (this.checkForm()) {
					database.addStage(this.node);
					this.selectStage(this.node.stages.length - 1);
				}
			},
			selectStage(index) {
				if (this.checkForm()) {
					this.selectedStage = index;
					if (this.$refs.name) {
						this.$refs.name.focus();
					}
				}
			},
			moveStage(index, dir) {
				window.database.moveObj(this.node.stages, this.node.stages[index].id, dir);
			},
			deleteStage(index) {
				database.deleteStage(this.node.stages, index);
				if (index < this.selectedStage) {
					this.selectedStage -= 1;
				}
				else {
					this.selectedStage = Math.min(this.selectedStage, this.node.stages.length - 1);
				}
			},
			getEdibleStages(id) {
				if (id) {
					let stages = database.getNodeById(id).stages;
					return stages.filter(stage => stage.isEdible);
				}
				return [];
			},
			checkForm() {
				let form = $(this.$el);
				return form[0].reportValidity();
			},
			getStrippedPath(path) { return path.substring(path.lastIndexOf("/") + 1, path.length); },
			getImage,
		}
	});

	const eventEditor = new Vue({
		el: "#eventEditor",
		data: {
			show: false,
			event: database.newEvent(),
			NODE_IMAGES, EFFECT_METHODS,
		},
		computed: {
			all_nodes,
			all_events,
			all_tags,
			form_changed() { return this.show && JSON.stringify(this.event) !== JSON.stringify(this.original); },
		},
		methods: {
			gotoEvents,
			open(event) {
				this.original = event;
				this.event = JSON.parse(JSON.stringify(event));
				this.show = true;
			},
			close,
			trySubmit,
			save(e) {
				e.preventDefault();

				let newEvent = JSON.parse(JSON.stringify(this.event));
				database.addEvent(newEvent);
				database.save();

				// Force form_changed to update
				this.original = JSON.parse(JSON.stringify(this.event));
				this.event = JSON.parse(JSON.stringify(newEvent));
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
			form_changed() { return this.show && JSON.stringify(this.scenario) !== JSON.stringify(this.original); },
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
			gotoScenarios,
			open(scenario) {
				this.original = scenario;
				this.scenario = JSON.parse(JSON.stringify(scenario));
				this.show = true;
			},
			close,
			trySubmit,
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
			openConditionsEditor() {
				let idList = [];
				for (const actor of this.scenario.actors) {
					idList.push(actor.node_id);
				}
				conditionsEditorModal.show(
					idList,
					this.scenario.conditions,
					this.setConditions.bind(this)
				);
			},
			setActors(idList) {
				database.setActors(this.scenario, idList);
			},
			setActions(idList) {
				database.setActions(this.scenario, idList);
			},
			setConditions(conditions, active) {
				database.setConditions(this.scenario, conditions, active);
			},
			run() {
				let form = $(this.$el);
				form.find(":submit").click();
				if (form[0].reportValidity()) {
					// Hack
					for (var i = database.scenarios.length - 1; i >= 0; i--) {
						if (this.scenario.id == database.scenarios[i].id) {
							//web.startScenario(i);
							window.simulator.loadScenario(database.scenarios[i]);
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
			gotoNodeEditor,
			gotoEventEditor,
			getTotalTime() {
				return this.scenario.time.intro + this.scenario.time.sections * this.scenario.time.length + this.scenario.time.outro;
			},
		},
	});

	const tagEditor = new Vue({
		el: "#tagEditor",
		data: {
			show: false,
			tags: "",
			originalTags: "",
			tagMap: {},
			originalTagMap: {}
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
			form_changed() { return this.show && (JSON.stringify(this.tags) !== JSON.stringify(this.originalTags) || JSON.stringify(this.tagMap) !== JSON.stringify(this.originalTagMap)); },
		},
		methods: {
			open() {
				const customTags = database.getCustomTags();
				this.tags = customTags.join("\n");
				this.originalTags = JSON.parse(JSON.stringify(this.tags));
				this.show = true;

				this.tagMap = {};
				for (const tag of customTags) {
					Vue.set(this.tagMap, tag, []);
					for (const node of database.nodes) {
						if (node.tags.includes(tag)) {
							this.tagMap[tag].push(node.id);
						}
					}
				}
				this.originalTagMap = JSON.parse(JSON.stringify(this.tagMap));
			},
			close,
			trySubmit,
			save(e) {
				e.preventDefault();

				if (this.tag_warnings.length > 0) {
					const response = confirm("Are you sure you wish to save? This will permanently delete tags from existing nodes and relations.");
					if (response) {
						this.confirmSave();
					}
				}
				else {
					this.confirmSave();
				}
			},
			confirmSave() {
				let tags = this.tags.split("\n");

				for (const tag of tags) {
					for (const node of database.nodes) {
						if (this.tagMap[tag] && this.tagMap[tag].includes(node.id)) {
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

				// Force form_changed to update
				this.open();
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


	/* Modals */

	const nodeSelectorModal = new Vue({
		el: "#nodeSelectorModal",
		data: {
			selected: {},
			allNodes: [],
			titleText: null,
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
						nodeList.push(nodeId);
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

	const conditionsEditorModal = new Vue({
		el: "#conditionsEditorModal",
		data: {
			titleText: "Set victory conditions",
			tiers: [0, 1, 2, 3],
			conditions: {},
			selected: 1,
			nodes: [],
			active: {},
			callback: null,
		},
		computed: {
			all_nodes,
		},
		methods: {
			show(nodeList, newConditions, callback=null) {
				this.callback = callback;
				this.selected = 1;

				const budgetNode = {
					id: "budget",
					name: "Budget",
					color: "#777777",
					image: "missing"
				};

				this.nodes = [budgetNode];

				for (const tier of this.tiers) {
					this.conditions[tier] = {};
					Vue.set(this.active, tier, {});

					this.conditions[tier].description = newConditions[tier].description;

					if (newConditions[tier].budget) {
						this.conditions[tier][budgetNode.id] = newConditions[tier].budget;
						Vue.set(this.active[tier], budgetNode.id, true);
					}
					else {
						this.conditions[tier][budgetNode.id] = [null, null];
						Vue.set(this.active[tier], budgetNode.id, false);
					}
				}

				for (const node of all_nodes()) {
					if (nodeList.includes(node.id) || node.id == "budget") {
						this.nodes.push(node);
						for (const tier of this.tiers) {
							this.conditions[tier][node.id] = [null, null];
							Vue.set(this.active[tier], node.id, false);

							if (newConditions[tier][node.id]) {
								this.conditions[tier][node.id] = newConditions[tier][node.id];
								Vue.set(this.active[tier], node.id, true);
							}
						}
					}
				}

				$("#conditionsEditorModal").modal("show");
			},
			hide() {
				$("#conditionsEditorModal").modal("hide");
			},
			accept() {
				this.hide();
				if (this.callback) {
					this.callback(this.conditions, this.active);
				}
			},
			isActive(id) {
				return this.active[this.selected][id];
			},
			toggleNode(event, id, activeCheck=false) {
				event.stopImmediatePropagation();
				if (activeCheck) {
					if (this.isActive(id)) {
						return;
					}
				}
				Vue.set(this.active[this.selected], id, !this.active[this.selected][id]);
			},
			getImage,
		}
	});


	/* Init */

	gotoScenarios();
}
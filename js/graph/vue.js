function createGraphTools() {
	return new Vue({
		el: '#graphTools',
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
		el: '#databaseEditor',
		data: {
			show: true,
			list: database.nodes,
		},
		computed: {
			nodeCount: function () {
				return database.nodes.length;
			},
			allData: function () {
				return database.exportJSON(true);
			},
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
				console.log("openEvents");
			},
			openScenarios: function () {
				console.log("openScenarios");
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
		el: '#nodeList',
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
			getImagesrc: function (image) {
				for (var i = NODE_IMAGES.length - 1; i >= 0; i--) {
					if (image == NODE_IMAGES[i].value) {
						return NODE_IMAGES[i].path;
					}
				}
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
				database.deleteNode(node.id);
				database.save();
			},
			addNode: function () {
				this.show = false;
				nodeEditor.open(database.newNode());
			},
			editTags: function () {
				this.show = false;
				tagEditor.open();
			},
		},
	});

	let nodeEditor = new Vue({
		el: '#nodeEditor',
		data: {
			show: false,
			tab: 1,
			node: database.newNode(),
			test: []
		},
		computed: {
			incoming_relations: function () {
				return database.getIncomingRelations(this.node.id);
			},
			imagesrc: function () {
				for (var i = NODE_IMAGES.length - 1; i >= 0; i--) {
					if (this.node.image == NODE_IMAGES[i].value) {
						return NODE_IMAGES[i].path;
					}
				}
			},
			all_nodes: function () { return database.nodes; },
			all_tags: function () { return database.tags; },
			node_types: function () { return NODE_TYPES; },
			animal_foods: function () { return ANIMAL_FOODS; },
			animal_sizes: function () { return ANIMAL_SIZES; },
			node_images: function () { return NODE_IMAGES; },
			abiotic_types: function () { return ABIOTIC_TYPES; },
			relation_types: function () { return RELATION_TYPES; },
			relation_interactions: function () { return RELATION_INTERACTIONS; },
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

				this.cancel();
			},
			cancel: function () {
				this.show = false;
				nodeList.open();
			},
			setTab: function (tab) {
				var $myForm = $('#nodeEditor');
				if(! $myForm[0].checkValidity()) {
				  $myForm.find(':submit').click();
				}
				else {
					this.tab = tab;
				}
			},
			addRelation: function () {
				database.addRelation(this.node);
			},
			deleteRelation: function (index) {
				database.deleteRelation(this.node, index);
			},
			getImagesrc: function (image) {
				for (var i = NODE_IMAGES.length - 1; i >= 0; i--) {
					if (image == NODE_IMAGES[i].value) {
						return NODE_IMAGES[i].path;
					}
				}
			},
		},
	});

	let tagEditor = new Vue({
		el: '#tagEditor',
		data: {
			show: false,
			tags: ''
		},
		computed: {
		},
		methods: {
			open: function () {
				this.tags = database.tags.join('\n');
				this.show = true;
			},
			save: function (e) {
				e.preventDefault();

				database.setTags(this.tags.split('\n'));
				database.save();

				this.cancel();
			},
			cancel: function () {
				this.show = false;
				nodeList.open();
			},
		},
	});

	initNodeChart();
	//databaseEditor.openNodes();
	//nodeList.editTags();
	//nodeList.editNode(nodeList.list[0]);
	//nodeEditor.setTab(2);
}

$(document).ready(function() {
	$('.my-select').selectpicker();
});

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
			}
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
				$("<a />", {
					"download": "ecoweb.json",
					"href" : "data:application/json," + encodeURIComponent(database.exportJSON())
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
				database.saveCookies();
			},
			addNode: function () {
				this.show = false;
				nodeEditor.open(database.newNode());
			},
		},
	});

	let nodeEditor = new Vue({
		el: '#nodeEditor',
		data: {
			show: false,
			node: database.newNode(),
			node_types: NODE_TYPES,
			animal_foods: ANIMAL_FOODS,
			animal_sizes: ANIMAL_SIZES,
			node_images: NODE_IMAGES,
			abiotic_types: ABIOTIC_TYPES,
		},
		computed: {
			imagesrc: function () {
				for (var i = NODE_IMAGES.length - 1; i >= 0; i--) {
					if (this.node.image == NODE_IMAGES[i].value) {
						return NODE_IMAGES[i].path;
					}
				}
			}
		},
		methods: {
			open: function (node) {
				this.original = node;
				this.node = { ...node };
				this.show = true;
			},
			save: function (e) {
				e.preventDefault();

				let newNode = JSON.parse(JSON.stringify(this.node));
				database.addNode(newNode);
				database.saveCookies();

				this.cancel();
			},
			cancel: function () {
				this.show = false;
				nodeList.open();
			},
		},
	});
}
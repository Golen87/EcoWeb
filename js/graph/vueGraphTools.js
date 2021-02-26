function createGraphTools() {
	return new Vue({
		el: "#graphTools",
		data: {
			maxTime: 100,
			deltaTime: 1,
			sunlight: 1,
			territory: 1,
			showNodes: true,
			showStages: true,
			showBiomass: true,
			species: [],
			scenarios: [],
			main: {show: false},
			isActive: true
		},
		computed: {
			total() {
				return 10;
			}
		},
		methods: {
			stabilize(event) {
				window.simulator.stabilize();
			},
			refresh(event) {
				window.simulator.refresh();
			},
			updateValue(event, s, key) {
				s[key] = parseFloat(event.target.value);
				this.updateGraph();
			},
			updateBool(event, s, key) {
				this.updateGraph();
			},
			updateMaxTime(event) {
				this.maxTime = parseFloat(event.target.value);
				window.simulator.scenario.maxTime = this.maxTime;
				this.updateGraph();
			},
			updateDeltaTime(event) {
				this.deltaTime = parseFloat(event.target.value);
				window.simulator.scenario.deltaTime = this.deltaTime;
				this.updateGraph();
			},
			updateSunlight(event) {
				this.sunlight = parseFloat(event.target.value);
				window.simulator.scenario.sunlight = this.sunlight;
				this.updateGraph();
			},
			updateTerritory(event) {
				this.territory = parseFloat(event.target.value);
				window.simulator.scenario.territory = this.territory;
				this.updateGraph();
			},
			updateShowNodes() {
				this.showNodes = !this.showNodes;
				window.simulator.showNodes = this.showNodes;
			},
			updateShowStages() {
				this.showStages = !this.showStages;
				window.simulator.showStages = this.showStages;
			},
			updateShowBiomass() {
				this.showBiomass = !this.showBiomass;
				window.simulator.showBiomass = this.showBiomass;
			},
			updateGraph() {
				window.simulator.refresh();
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
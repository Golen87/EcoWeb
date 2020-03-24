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
			total() {
				return 10;
			}
		},
		methods: {
			stabilize(event) {
				web.stabilize();
				this.updateGraph();
			},
			reset(event) {
				web.restart();
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
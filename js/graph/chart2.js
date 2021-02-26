let chartData2 = {
	labels: ["a", "b", "c", "d", "e", "f", "g"],
	datasets: [{
		barPercentage: 0.5,
		barThickness: 6,
		maxBarThickness: 8,
		minBarLength: 2,
		data: [10, 20, 30, 40, 50, 60, 70]
	}]
};

function initChart2() {
	let config = {
		type: 'bar',
		data: chartData2,
		options: {
			animation: false,
			scales: {
				xAxes: [{
					display: true,
					ticks: {
						suggestedMin: 0,
						suggestedMax: 1,
					}
				}],
				yAxes: [{
					display: true,
					ticks: {
						suggestedMin: 0,
						suggestedMax: 1,
					}
				}]
			}
		}
	};
	let ctx = document.getElementById('myChart2').getContext('2d');
	window.chart2 = Chart.Bar(ctx, config);
}

function resetChart2(species=[]) {
	chartData2.datasets = [];

	for (let i = 0; i < species.length; i++) {
		let s = species[i];
		addSpecies2(s.name, s.color, s.showGraph && s.enable, isAbiotic(s.type));
	}
}

function addSpecies2(name, color, showGraph, isAbiotic) {
	chartData2.datasets.push({
		label: name,
		data: [],
		backgroundColor: color,
		borderWidth: 0,
		barPercentage: 1.0,
		categoryPercentage: 1.0,
		hidden: !showGraph
	});
}

function updateChart2() {
	let length = Math.max.apply(Math, window.simulator.species.map(function(o) { return o.length; }));

	chartData2.labels = [];
	for (let time = 0; time <= length; time++) {
		chartData2.labels.push((time * window.simulator.deltaTime).toFixed(1));
	}

	for (let i = 0; i < window.simulator.species.length; i++) {
		let s = window.simulator.species[i];
		chartData2.datasets[i].data = [];
		for (let time = 0; time <= length; time++) {
			// CHOOSE WHICH STAGE TO SHOW
			let y = s.pop[time] || 0;
			chartData2.datasets[i].data.push(y);
			// Fix stages
		}
	}

	window.chart2.update();
}
let chartData = {
	labels: [],
	datasets: []
};

function initChart() {
	initChart2();
	let config = {
		type: 'line',
		data: chartData,
		options: {
			legend: {
				labels: {
					boxWidth: 12
				}
			},
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
					//type: 'logarithmic',
					ticks: {
						suggestedMin: 0,
						suggestedMax: 1,
					}
				}]
			}
		}
	};
	let ctx = document.getElementById('myChart').getContext('2d');
	window.chart = Chart.Scatter(ctx, config);
}

function resetChart(species=[]) {
	resetChart2(species);
	chartData.datasets = [];

	for (let i = 0; i < species.length; i++) {
		let s = species[i];
		addSpecies(s.id, s.name, s.color, s.showGraph && s.enable && window.simulator.showNodes, isAbiotic(s.type));
		if (s.stages) {
			for (let id in s.stages) {
				let stage = s.stages[id];
				addSpecies(id, stage.name, s.color, s.showGraph && s.enable && stage.isPopulation && window.simulator.showStages, isAbiotic(s.type), true);
			}
		}
	}
}

function addSpecies(id, name, color, showGraph, isAbiotic, subclass=false) {
	chartData.datasets.push({
		id: id,
		label: name,
		data: [],
		borderColor: color,
		borderWidth: subclass ? 2 : 3,
		pointRadius: isAbiotic ? 0 : 1,
		fill: false,
		tension: 0,
		showLine: true,
		borderDash: isAbiotic ? [3,6] : [],
		hidden: !showGraph
	});
}

function updateChart() {
	updateChart2();
	chartData.labels = [];
	const timestamps = window.simulator.result.timestamps;

	for (let i = 0; i < timestamps.length; i++) {
		let x = timestamps[i];
		chartData.labels.push(x);
	}

	for (const dataset of chartData.datasets) {
		dataset.data = [];

		let alive = true;
		for (let i = 0; i < timestamps.length; i++) {
			let x = timestamps[i];
			let y = window.simulator.result.population[dataset.id][i]+0.01;

			// Make sure to add a value of 0 at least once
			if (alive)
				dataset.data.push({x,y});
			alive = (y > 0.01);
		}
	}

	window.chart.update();
}
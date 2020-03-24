let chartData = {
	labels: [],
	datasets: []
};

function initChart() {
	let ctx = document.getElementById('myChart').getContext('2d');
	let config = {
		type: 'line',
		data: chartData,
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
	window.chart = Chart.Scatter(ctx, config);
}

function resetChart() {
	chartData.datasets = [];
}

function addSpecies(name, color, showGraph, isAbiotic) {
	chartData.datasets.push({
		label: name,
		data: [],
		borderColor: color,
		borderWidth: 3,
		pointRadius: isAbiotic ? 0 : 1,
		fill: false,
		tension: 0,
		showLine: true,
		borderDash: isAbiotic ? [3,6] : [],
		hidden: !showGraph
	});
}

function updateChart() {
	chartData.labels = [];

	for (let i = 0; i < web.result.x.length; i++) {
		let x = web.result.x[i];
		chartData.labels.push(x);
	}

	for (let j = 0; j < web.result.y[0].length; j++) {
		chartData.datasets[j].data = [];

		for (let i = 0; i < web.result.x.length; i++) {
			let x = web.result.x[i];
			let y = web.result.y[i][j];
			chartData.datasets[j].data.push({x,y});
		}
	}

	window.chart.update();
}
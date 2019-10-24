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
};

function resetChart() {
	chartData.datasets = [];
}

function addSpecies(name, color, showGraph) {
	chartData.datasets.push({
		label: name,
		data: [],
		borderColor: color,
		borderWidth: 3,
		pointRadius: 1,
		fill: false,
		tension: 0,
		showLine: true,
		hidden: !showGraph
	});
}

/*function addData(species, x, y) {
	chartData.datasets[species].data.push({x,y});
}*/

function updateChart() {
	chartData.labels = [];

	for (let i = 0; i < web.result.x.length; i++) {
		let x = web.result.x[i];
		chartData.labels.push(x);
	}

	for (let j = 0; j < web.result.y[0].length; j++) {
		chartData.datasets[j].data = [];
		//let isDead = (web.result.y[0][j] == 0);
		//if (isDead)
		//	continue;

		for (let i = 0; i < web.result.x.length; i++) {
			let x = web.result.x[i];
			let y = web.result.y[i][j];
			chartData.datasets[j].data.push({x,y});
		}
	}

	window.chart.update();
}


var randomScalingFactor = function() {
	return Math.round(Math.random() * 100);
};
function initNodeChart() {
	let ctx = document.getElementById('nodeChart').getContext('2d');
	let config = {
		type: 'doughnut',
		data: {
			datasets: [{
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
				],
				backgroundColor: [
					window.chartColors.red,
					window.chartColors.orange,
					window.chartColors.yellow,
					window.chartColors.green,
					window.chartColors.blue,
				],
				label: 'Dataset 1'
			}],
			labels: [
				'Red',
				'Orange',
				'Yellow',
				'Green',
				'Blue'
			]
		},
		options: {
			responsive: true,
			legend: {
				position: 'top',
			},
			animation: {
				animateScale: true,
				animateRotate: true
			}
		}
	};

	window.nodeChart = new Chart(ctx, config);
};
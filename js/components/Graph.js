class Graph extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.scene = scene;
		this.width = width;
		this.height = height;
		this.padding = 0.03 * this.width;
		this.history = 20;
		this.xstep = 1/8;
		this.ystep = 6;


		// this.setDepth(100);
		// this.setScrollFactor(0);

		this.background = scene.add.graphics({x: -this.width/2, y: -this.height/2});
		this.add(this.background);
		this.foreground = scene.add.graphics({x: -this.width/2, y: -this.height/2});
		this.add(this.foreground);
		this.foregroundSelected = scene.add.graphics({x: -this.width/2, y: -this.height/2});
		this.add(this.foregroundSelected);


		this.gridSize = 0.5;
		// this.stepSize = 1.0;
		this.axisSize = 1.0;
		this.lineSize = 2.5;
		this.nodeSize = 24;

		this.images = [];
		for (const species of window.simulator2.species) {
			let cont = scene.add.container(0, 0);
			cont.setVisible(false);
			this.add(cont);
			this.images.push(cont);

			let circle = scene.add.sprite(0, 0, 'circle');
			circle.setScale((this.nodeSize + 2*this.lineSize) / circle.height);
			circle.setTint(Phaser.Display.Color.HexStringToColor(species.color).color);
			cont.add(circle);

			let image = scene.add.sprite(0, 0, species.image);
			image.setScale(this.nodeSize / image.height);
			cont.add(image);
		}


		this.xLabels = [];
		this.createXLabels();
		this.createYLabels();

		this.drawBackground(0);
		this.draw(0);
	}


	createXLabels() {
		let fontSize = 12; // Font size
		let labelX = -0.5 * this.width; // Label left
		let labelY = 0.5 * this.height; // Label top
		let texts = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

		for (var i = 0; i < 12; i++) {
			let sep = 1 * this.padding;
			let x = labelX + (0.0 + 1/11*i) * (this.width - 2*sep) + sep;
			let y = labelY - 0.5*this.padding;
			let label = createText(this.scene, x, y, fontSize, "#FFF", texts[i]);
			label.setOrigin(0.5, 0.0);
			label.setAlpha(0.7);

			this.add(label);
			this.xLabels.push(label);
		}
	}

	createYLabels() {
		let fontSize = 16; // Font size
		let labelX = -0.5 * this.width - 4.7*fontSize + this.padding; // Label left
		let labelY = -0.5 * this.height; // Label top
		let texts = ["> 100,000", "> 10,000", "> 1,000", "> 100"];

		let title = createText(this.scene, labelX, labelY-0.5*fontSize, 1.2*fontSize, "#FFF", "Population size");
		title.setOrigin(0.0, 0.5);
		this.add(title);

		for (var i = 0; i < 4; i++) {
			let sep = 2.4 * this.padding;
			let x = labelX;
			let y = labelY + (0.0 + 1/3*i) * (this.height - 2*sep) + sep;
			let label = createText(this.scene, x, y, fontSize, "#FFF", texts[i]);
			label.setOrigin(0.0, 0.5);
			label.setAlpha(0.7);

			this.add(label);
		}
	}


	updateXLabels(time) {
		let right = Math.max(time, this.history);
		let left = right - this.history;
		let pos = left / this.history;
		let index = Math.floor(pos / this.xstep);

		for (var i = this.xLabels.length - 1; i >= 0; i--) {
			this.xLabels[i].setAlpha(0);
		}


		for (let i = 0; i <= 1+this.xstep; i += this.xstep) {
			const vx = -0.5*this.width + this.padding + (i - pos%this.xstep) * (this.width - 2*this.padding);
			const label = this.xLabels[index % this.xLabels.length];
			label.x = vx;

			let alpha = 0.7;
			if (i == 0) {
				// Rapid fade out
				alpha = 0.7 * (1 - 4 * (pos%this.xstep) / this.xstep);
			}
			else if (i > 1) {
				// Late fade in
				alpha = 0.7 * (-3 + 4 * (pos%this.xstep) / this.xstep);
			}
			label.setAlpha(alpha);

			index++;
		}
	}


	drawBackground(time) {
		this.background.clear();
		// this.background.fillStyle(0x666666, 1.0);
		// this.background.fillRect(0, 0, this.width, this.height);
		// this.background.fillStyle(0x222222, 1.0);
		// this.background.fillRect(2.5, 2.5, this.width-5, this.height-5);

		let right = Math.max(time, this.history);
		let left = right - this.history;

		right /= this.history;
		left /= this.history;

		// Help grid
		this.background.lineStyle(this.gridSize, 0xa77440, 0.5);
		for (let i = 0; i <= 1; i += this.xstep) {
			const vx = this.padding + Math.min(i+this.xstep - left%this.xstep, 1) * (this.width - 2*this.padding);
			this.background.lineBetween(vx, this.padding, vx, this.height-this.padding);
		}
		for (let i = 0; i <= this.ystep; i++) {
			const hy = this.padding + i / this.ystep * (this.height - 2*this.padding);
			this.background.lineBetween(this.padding, hy, this.width-this.padding, hy);
		}

		// Axis steps
		// this.background.lineStyle(this.stepSize, 0xffffff, 1.0);
		// for (let i = 0; i <= 1; i += 0.1) {
		// 	const hx = this.padding / 2;
		// 	const hy = this.padding + i * (this.height - 2*this.padding);
		// 	const vx = this.padding + i * (this.width - 2*this.padding);
		// 	const vy = this.height - this.padding / 2;

		// 	this.background.lineBetween(hx, hy, hx+this.padding, hy);
		// 	this.background.lineBetween(vx, vy, vx, vy-this.padding);
		// }

		// Axises
		this.background.lineStyle(this.axisSize, 0xffffff, 1.0);
		this.background.strokePoints([{x:this.padding, y:this.padding},{x:this.padding, y:this.height-this.padding}]);
		this.background.strokePoints([{x:this.padding, y:this.height-this.padding},{x:this.width-this.padding, y:this.height-this.padding}]);
	}

	draw(time) {
		this.drawBackground(time);
		this.updateXLabels(time);
		this.foreground.clear();
		this.foregroundSelected.clear();


		/* Data */

		let right = Math.max(time, this.history);
		let left = right - this.history;

		let data = [];

		// Collect data points within the graph's timeframe
		for (let i = 0; i < window.simulator2.history.x.length; i++) {
			let x = window.simulator2.history.x[i];

			// Remove duplicate x
			if (data.length > 0 && x == data[data.length-1].x) {
				data.splice(data.length-1, 1);
			}

			if (x < time) {
				if (x > time - this.history) {
					let y = window.simulator2.history.y[i];

					// Snap leftmost data point to 0 to prevent overlap
					if (data.length == 0 && i > 0) {
						let x2 = window.simulator2.history.x[i-1];
						let y2 = window.simulator2.history.y[i-1];
						let y3 = [];
						let k = (left-x2)/(x-x2);
						for (var j = 0; j < y.length; j++) {
							y3[j] = y2[j] + k * (y[j]-y2[j]);
						}
						data.push({x:left, y:y3});
					}

					data.push({x, y});
				}
			}
			else {
				x = time;
				let y = window.simulator2.sol.at(x);
				data.push({x, y});
				break;
			}
		}


		/* Nodes */

		for (let s = 0; s < window.simulator2.species.length; s++) {
			let species = window.simulator2.species[s];

			// let populations = window.simulator2.getPopulationAt(time);
			let points = [];
			let alive = false;

			for (var i = 0; i < data.length; i++) {
				let x = data[i].x;
				let y = data[i].y[s];

				y *= species.populationModifier;
				// y = Math.max(y, 1);
				// y = Math.log10(y) / Math.log10(10000);

				alive = alive || y > 0;
				x = (x - left) / (right - left);
				y = 1 - y;


				points.push({
					x: this.padding + x * (this.width - 2*this.padding),
					y: this.padding + y * (this.height - 2*this.padding),
					// alpha: Phaser.Math.Clamp((1-y)*5, 0, 1)
				});
			}

			const color = Phaser.Display.Color.HexStringToColor(species.color).color;
			const last = points[points.length-1];

			if (alive) { // species.showGraph
				this.foreground.lineStyle(this.lineSize, color);
				this.foreground.strokePoints(points, false, false);

				// Display data points as circles
				// for (const p of points) {
					// this.foreground.fillStyle(color);
					// this.foreground.fillCircle(p.x, p.y, 4.0);
				// }
			}

			this.images[s].setPosition(last.x + this.foreground.x, last.y + this.foreground.y);
			this.images[s].setVisible(alive);
			// this.images[s].setAlpha(last.alpha);

			// if (this.scene.selectedNode) {
			// 	if (species == this.scene.selectedNode.species) {
			// 		this.foregroundSelected.lineStyle(4.0, 0xffffff, 1.0);
			// 		this.foregroundSelected.strokePoints(points, false, false);

			// 		this.foregroundSelected.fillStyle(0xffffff, 1.0);
			// 		this.foregroundSelected.fillCircle(p.x, p.y, 5);
			// 	}
			// }
		}
	}

	update(time, delta) {
		// if (this.scene.selectedNode) {
		// 	const showGraph = this.scene.selectedNode.species.showGraph;
		// 	this.foregroundSelected.setAlpha(0.5 + (0.25 + 0.25 * showGraph) * Math.sin(time/200));
		// }
		// else {
		// 	this.foregroundSelected.setAlpha(0);
		// }
	}
}
class Graph extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.scene = scene;
		this.width = width;
		this.height = height;


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
			// this.images.push(image);
			// this.add(image);
		}


		// this.labels = [];
		// this.nextText = createText(this, sbX, sbY+0.20*sbH, 30, "#FFF", "Next");
		// this.nextText.setOrigin(0.5);


		this.drawBackground(0);
		this.draw(0);
	}

	drawBackground(time) {
		const PADDING = 0.03 * this.width;

		this.background.clear();
		// this.background.fillStyle(0x666666, 1.0);
		// this.background.fillRect(0, 0, this.width, this.height);
		// this.background.fillStyle(0x222222, 1.0);
		// this.background.fillRect(2.5, 2.5, this.width-5, this.height-5);

		let history = 30;
		let right = Math.max(time, history);
		let left = right - history;

		right /= history;
		left /= history;

		// Help grid
		this.background.lineStyle(this.gridSize, 0xa77440, 0.5);
		const xstep = 1/8;
		for (let i = 0; i <= 1; i += xstep) {
			const vx = PADDING + Math.min(i+xstep - left%xstep, 1) * (this.width - 2*PADDING);
			this.background.lineBetween(vx, PADDING, vx, this.height-PADDING);
		}
		const ystep = 1/6;
		for (let i = 0; i <= 1; i += ystep) {
			const hy = PADDING + i * (this.height - 2*PADDING);
			this.background.lineBetween(PADDING, hy, this.width-PADDING, hy);
		}

		// Axis steps
		// this.background.lineStyle(this.stepSize, 0xffffff, 1.0);
		// for (let i = 0; i <= 1; i += 0.1) {
		// 	const hx = PADDING / 2;
		// 	const hy = PADDING + i * (this.height - 2*PADDING);
		// 	const vx = PADDING + i * (this.width - 2*PADDING);
		// 	const vy = this.height - PADDING / 2;

		// 	this.background.lineBetween(hx, hy, hx+PADDING, hy);
		// 	this.background.lineBetween(vx, vy, vx, vy-PADDING);
		// }

		// Axises
		this.background.lineStyle(this.axisSize, 0xffffff, 1.0);
		this.background.strokePoints([{x:PADDING, y:PADDING},{x:PADDING, y:this.height-PADDING}]);
		this.background.strokePoints([{x:PADDING, y:this.height-PADDING},{x:this.width-PADDING, y:this.height-PADDING}]);
	}

	draw(time) {
		const PADDING = 0.03 * this.width;

		this.drawBackground(time);
		this.foreground.clear();
		this.foregroundSelected.clear();


		/* Data */

		let history = 30;
		let right = Math.max(time, history);
		let left = right - history;

		let data = [];

		for (let i = 0; i < window.simulator2.history.x.length; i++) {
			let x = window.simulator2.history.x[i];
			if (x < time) {
				if (x > time - history) {
					let y = window.simulator2.history.y[i];
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

				// y *= species.populationModifier;
				// y = Math.max(y, 1);
				// y = Math.log10(y) / Math.log10(10000);

				alive = alive || y > 0;
				x = (x - left) / (right - left);
				y = 1 - y;


				points.push({
					x: PADDING + x * (this.width - 2*PADDING),
					y: PADDING + y * (this.height - 2*PADDING),
					// alpha: Phaser.Math.Clamp((1-y)*5, 0, 1)
				});
			}

			const color = Phaser.Display.Color.HexStringToColor(species.color).color;
			const last = points[points.length-1];

			if (alive) { // species.showGraph
				this.foreground.lineStyle(this.lineSize, color);
				this.foreground.strokePoints(points, false, false);

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
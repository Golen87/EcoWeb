class Graph extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.width = width;
		this.height = height;

		this.setDepth(100);
		this.setScrollFactor(0);

		this.background = scene.add.graphics({x: -this.width/2, y: -this.height/2});
		this.add(this.background);
		this.foreground = scene.add.graphics({x: -this.width/2, y: -this.height/2});
		this.add(this.foreground);
		this.foregroundSelected = scene.add.graphics({x: -this.width/2, y: -this.height/2});
		this.add(this.foregroundSelected);

		this.drawBackground();
		this.draw(0);
	}

	drawBackground() {
		const PADDING = 0.03 * this.width;

		this.background.clear();
		this.background.fillStyle(0x666666, 1.0);
		this.background.fillRect(0, 0, this.width, this.height);
		this.background.fillStyle(0x222222, 1.0);
		this.background.fillRect(2.5, 2.5, this.width-5, this.height-5);

		// Help grid
		this.background.lineStyle(0.5, 0xffffff, 0.3);
		for (let i = 0; i <= 1; i += 0.1) {
			const hy = PADDING + i * (this.height - 2*PADDING);
			const vx = PADDING + i * (this.width - 2*PADDING);

			this.background.lineBetween(PADDING, hy, this.width-PADDING, hy);
			this.background.lineBetween(vx, PADDING, vx, this.height-PADDING);
		}

		// Axis steps
		this.background.lineStyle(1.0, 0xffffff, 1.0);
		for (let i = 0; i <= 1; i += 0.1) {
			const hx = PADDING / 2;
			const hy = PADDING + i * (this.height - 2*PADDING);
			const vx = PADDING + i * (this.width - 2*PADDING);
			const vy = this.height - PADDING / 2;

			this.background.lineBetween(hx, hy, hx+PADDING, hy);
			this.background.lineBetween(vx, vy, vx, vy-PADDING);
		}

		// Axises
		this.background.lineStyle(1.5, 0xffffff, 1.0);
		this.background.strokePoints([{x:PADDING, y:PADDING},{x:PADDING, y:this.height-PADDING}]);
		this.background.strokePoints([{x:PADDING, y:this.height-PADDING},{x:this.width-PADDING, y:this.height-PADDING}]);
	}

	draw(time) {
		const PADDING = 0.03 * this.width;

		this.foreground.clear();
		this.foregroundSelected.clear();


		/* Nodes */

		let fac = Math.min(1, time / window.simulator.scenario.maxTime);

		for (var s = 0; s < window.simulator.scenario.species.length; s += 1) {
			const species = window.simulator.scenario.species[s];

			let points = [];
			for (var i = 0; i <= fac; i += 0.001) {
				let value = Phaser.Math.Clamp(window.simulator.getValueAt(species.id, i * window.simulator.time), 0, 1);
				points.push({
					x: PADDING + i * (this.width - 2*PADDING),
					y: PADDING + (1-value) * (this.height - 2*PADDING)
				});
			}

			const color = Phaser.Display.Color.HexStringToColor(species.color).color;
			const p = points[points.length-1];

			if (species.showGraph) {
				this.foreground.lineStyle(4.0, color, 1.0);
				this.foreground.strokePoints(points, false, false);

				this.foreground.fillStyle(color, 1.0);
				this.foreground.fillCircle(p.x, p.y, 5);
			}

			if (this.scene.selectedNode) {
				if (species == this.scene.selectedNode.species) {
					this.foregroundSelected.lineStyle(4.0, 0xffffff, 1.0);
					this.foregroundSelected.strokePoints(points, false, false);

					this.foregroundSelected.fillStyle(0xffffff, 1.0);
					this.foregroundSelected.fillCircle(p.x, p.y, 5);
				}
			}
		}
	}

	update(time, delta) {
		if (this.scene.selectedNode) {
			const showGraph = this.scene.selectedNode.species.showGraph;
			this.foregroundSelected.setAlpha(0.5 + (0.25 + 0.25 * showGraph) * Math.sin(time/200));
		}
		else {
			this.foregroundSelected.setAlpha(0);
		}
	}
}
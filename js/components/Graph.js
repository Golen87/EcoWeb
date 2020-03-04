class Graph extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);
		scene.add.existing(this);

		this.setDepth(100);
		this.setScrollFactor(0);

		this.background = scene.add.graphics();
		this.add(this.background);
		this.foreground = scene.add.graphics();
		this.add(this.foreground);

		this.drawBackground();
		this.draw(0);
	}

	drawBackground() {
		const WIDTH = 300;
		const HEIGHT = 150;
		const PADDING = 0.02 * WIDTH;

		this.background.clear();
		this.background.fillStyle(0x222222, 1.0);
		this.background.lineStyle(1.0, 0xffffff, 1.0);

		this.background.fillRect(0, 0, WIDTH, HEIGHT);

		// Help grid
		this.background.lineStyle(0.5, 0xffffff, 0.3);
		for (var i = 0; i <= 1; i += 0.1) {
			const hy = PADDING + i * (HEIGHT - 2*PADDING);
			const vx = PADDING + i * (WIDTH - 2*PADDING);

			this.background.lineBetween(PADDING, hy, WIDTH-PADDING, hy);
			this.background.lineBetween(vx, PADDING, vx, HEIGHT-PADDING);
		}

		// Axis steps
		this.background.lineStyle(1.0, 0xffffff, 1.0);
		for (var i = 0; i <= 1; i += 0.1) {
			const hx = PADDING / 2;
			const hy = PADDING + i * (HEIGHT - 2*PADDING);
			const vx = PADDING + i * (WIDTH - 2*PADDING);
			const vy = HEIGHT - PADDING / 2;

			this.background.lineBetween(hx, hy, hx+PADDING, hy);
			this.background.lineBetween(vx, vy, vx, vy-PADDING);
		}

		// Axises
		this.background.lineStyle(1.5, 0xffffff, 1.0);
		this.background.strokePoints([{x:PADDING, y:PADDING},{x:PADDING, y:HEIGHT-PADDING}]);
		this.background.strokePoints([{x:PADDING, y:HEIGHT-PADDING},{x:WIDTH-PADDING, y:HEIGHT-PADDING}]);
	}

	draw(time) {
		const WIDTH = 300;
		const HEIGHT = 150;
		const PADDING = 0.02 * WIDTH;

		this.foreground.clear();


		/* Nodes */

		let fac = Math.min(1, time / web.currentScenario.maxTime);

		for (var s = 0; s < web.currentScenario.species.length; s += 1) {
			let points = [];
			for (var i = 0; i <= fac; i += 0.001) {
				let value = web.getValueAt(s, i * web.time);
				points.push({
					x: PADDING + i * (WIDTH - 2*PADDING),
					y: PADDING + (1-value) * (HEIGHT - 2*PADDING)
				});
			}

			const color = Phaser.Display.Color.HexStringToColor(web.currentScenario.species[s].color).color;
			this.foreground.lineStyle(2.0, color, 1.0);
			this.foreground.strokePoints(points, false, false);

			const p = points[points.length-1];
			this.foreground.fillStyle(color, 1.0);
			this.foreground.fillCircle(p.x, p.y, 4);
		}
	}

	update(time, delta) {
		//...
	}
}
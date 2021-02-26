class TimeAxis extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.width = width;
		this.height = height;

		this.setDepth(100);
		this.setScrollFactor(0);

		this.bg2 = scene.add.image(0, 0, 'frame_timeline');
		this.bg2.setScale(1.07 * this.width / this.bg2.width);
		this.bg2.setOrigin(0.495, 0.40);
		this.add(this.bg2);

		this.background = scene.add.graphics({x: -this.width/2, y: -this.height/2});
		this.add(this.background);

		this.foreground = scene.add.graphics({x: -this.width/2, y: -this.height/2});
		this.add(this.foreground);

		this.drawBackground();
		this.draw(0);
	}


	drawBackground() {

		const PADDING = 0.02 * this.width;
		const GRID_SIZE = 10;

		this.background.clear();
		// this.background.fillStyle(0x666666, 0.5);
		// this.background.fillRect(0, 0, this.width, this.height);
		// this.background.fillStyle(0x222222, 0.5);
		// this.background.fillRect(2.5, 2.5, this.width-5, this.height-5);

		// Axis steps
		const scenario = window.simulator.scenario;
		let sections = [0];
		for (const section of scenario.sections) {
			sections.push(section.end);
		}

		this.background.lineStyle(1.5, 0x000000);
		let x = 0;
		for (let duration of sections) {
			x = duration / scenario.maxTime;
			const vx = PADDING + x * (this.width - 2*PADDING);
			const vy = this.height / 2;

			this.background.lineBetween(vx, vy-GRID_SIZE, vx, vy+GRID_SIZE);
		}

		// Axises
		this.background.lineStyle(2, 0x000000);
		//this.background.strokePoints([{x:PADDING, y:this.height/2-GRID_SIZE},{x:PADDING, y:this.height/2+GRID_SIZE}]);
		//this.background.strokePoints([{x:this.width-PADDING, y:this.height/2-GRID_SIZE},{x:this.width-PADDING, y:this.height/2+GRID_SIZE}]);
		this.background.strokePoints([{x:PADDING, y:this.height/2},{x:this.width-PADDING, y:this.height/2}]);
	}

	draw(time) {
		const PADDING = 0.02 * this.width;

		this.foreground.clear();


		let fac = Math.min(1, time / window.simulator.scenario.maxTime);

		let points = [];
		points.push({
			x: PADDING + 0,
			y: 0.5 * this.height
		});
		points.push({
			x: PADDING + fac * (this.width - 2*PADDING),
			y: 0.5 * this.height
		});

		const color = 0x000000;
		const p = points[points.length-1];

		this.foreground.lineStyle(8.0, color);
		this.foreground.strokePoints(points, false, false);

		this.foreground.fillStyle(color);
		this.foreground.fillCircle(p.x, p.y, 8);
	}


	update(time, delta) {
	}
}
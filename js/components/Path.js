class Path extends Phaser.GameObjects.Container {
	constructor(scene, node1, node2, amount) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.node1 = node1;
		this.node2 = node2;
		this.amount = Phaser.Math.Easing.Sine.Out(amount);
		this.speed = (1300 - 600 * this.amount) * 4;

		this.middle = new Phaser.Math.Vector2(
			(node1.x + node2.x) / 2,
			(node1.y + node2.y) / 2
		);

		this.graphics = scene.add.graphics();
		this.graphics.setBlendMode(Phaser.BlendModes.ADD);
		this.add(this.graphics);
		//this.curve = new Phaser.Curves.QuadraticBezier(this.node1, this.middle, this.node2);
		this.curve = new Phaser.Curves.CubicBezier(
			this.node1,
			new Phaser.Math.Vector2(
				node1.x,
				node1.y + 75 + 20
			),
			new Phaser.Math.Vector2(
				node2.x,
				node1.y + 75 - 20
			),
			this.node2
		);


		this.speed *= this.curve.getLength() / 250;
		this.dotCount = 2 + amount * 3;

		this.drawBezier(0);
	}

	getWidth() {
		return (3 + 4 * this.amount) * this.alphaValue;
	}

	drawBezier(time) {
		this.graphics.clear();

		let color = 0xffffff;

		this.graphics.lineStyle(this.getWidth(), color);
		this.curve.draw(this.graphics);

		let count = Math.min(this.dotCount, 10);
		let radius = this.getWidth();
		let offset = (time / this.speed) % (1/count);
		while (offset < 1) {
			let value = offset;
			let pos = this.curve.getPoint(1-value);

			this.graphics.fillStyle(color);
			this.graphics.fillCircle(pos.x, pos.y, radius);

			offset += 1/count;
		}
		/*
		this.graphics.lineStyle(1, color);

		circleRadius = 20;
		minDistance = 40;
		let savedPoints = [];

		for (let d = 0; d <= 1; d += 0.001) {
			let pos = this.curve.getPoint(d);

			let collision = false;
			for (let point of savedPoints) {
				if (Phaser.Math.Distance.BetweenPoints(pos, point) < minDistance) {
					collision = true;
				}
			}

			if (!collision) {
				this.graphics.strokeCircle(pos.x, pos.y, circleRadius);
				savedPoints.push(pos);
			}
		}
		*/
	}

	update(time, delta) {
		let alive = Math.min(this.node1.aliveValue, this.node2.aliveValue);
		let hover = Math.max(this.node1.hoverValue, this.node2.hoverValue);
		let hover2 = Math.min(this.node1.hoverValue, this.node2.hoverValue);
		let explored = (this.node1.visibility == "explored" || this.node2.visibility == "explored");
		let visible = (this.node1.visibility == "explored" && this.node2.visibility == "explored");
		this.alphaValue = (visible ? hover : hover2) * alive * explored;
		this.setAlpha(this.alphaValue);

		if (this.node1.visibility == "hidden" && this.node2.visibility == "explored") {
			this.node1.setVisibility("unexplored");
			this.node1.popEasing = 1;
		}
		if (this.node2.visibility == "hidden" && this.node1.visibility == "explored") {
			this.node2.setVisibility("unexplored");
			this.node2.popEasing = 1;
		}

		if (this.alpha > 0) {
			this.drawBezier(time);
		}
	}
}
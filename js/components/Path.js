class Path extends Phaser.GameObjects.Container {
	constructor(scene, node1, node2, amount) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.node1 = node1;
		this.node2 = node2;
		this.amount = Phaser.Math.Easing.Sine.Out(amount);
		this.speed = (1500 - 1200 * this.amount) * 4;

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
		this.dotCount = 2 + amount * 5;

		this.drawBezier();
	}

	getWidth() {
		return (2 + 6 * this.amount) * this.alphaValue;
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
	}

	update(time, delta) {
		this.alphaValue = Math.max(this.node1.hoverValue, this.node2.hoverValue) * Math.min(this.node1.aliveValue, this.node2.aliveValue);
		this.setAlpha(this.alphaValue);

		if (this.alpha > 0) {
			this.drawBezier(time);
		}
	}
}
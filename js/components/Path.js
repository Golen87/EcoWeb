class Path extends Phaser.GameObjects.Container {
	constructor(scene, node1, node2, amount) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.node1 = node1;
		this.node2 = node2;
		this.amount = Phaser.Math.Easing.Sine.Out(amount);

		this.middle = new Phaser.Math.Vector2(
			(node1.x + node2.x) / 2,
			(node1.y + node2.y) / 2
		);

		this.graphics = scene.add.graphics();
		this.add(this.graphics);
		//this.curve = new Phaser.Curves.QuadraticBezier(this.node1, this.middle, this.node2);
		this.curve = new Phaser.Curves.CubicBezier(
			this.node1,
			new Phaser.Math.Vector2(
				node1.x,
				(node1.y + node2.y) / 2
			),
			new Phaser.Math.Vector2(
				node2.x,
				(node1.y + node2.y) / 2
			),
			this.node2
		);

		this.drawBezier();


		this.dotsNumber = 4;
		const d = 1500 - 1200 * amount;
		this.dots = [];

		for (let i = 0; i < this.dotsNumber; i++) {
			this.dots[i] = scene.add.image(0, 0, "arrow");
			this.add(this.dots[i]);
			this.dots[i].setScale(this.getWidth() * 2 / 59); // 0.2
			let tweenObject = {
				val: (i+1) / this.dotsNumber
			}
			scene.tweens.add({
				targets: tweenObject,
				val: i / this.dotsNumber,
				duration: d,
				repeat: -1,
				//ease: "Sine.easeInOut",
				callbackScope: this,
				onUpdate: function(tween, target) {
					let position = this.curve.getPoint(target.val);
					this.dots[i].x = position.x;
					this.dots[i].y = position.y;
					this.dots[i].angle = this.curve.getTangent(target.val).angle() * 180 / Math.PI;
				}
			});
		}
	}

	getWidth() {
		return (2 + 6 * this.amount) * this.alphaValue;
	}

	drawBezier() {
		this.graphics.clear();

		this.graphics.lineStyle(this.getWidth(), 0xffffff);
		this.curve.draw(this.graphics);

		this.graphics.lineStyle(6, 0xffffff);
		this.graphics.strokeCircle(this.node1.x, this.node1.y, 6);

		this.graphics.lineStyle(6, 0xffffff);
		this.graphics.strokeCircle(this.node2.x, this.node2.y, 6);
	}

	update(delta) {
		this.drawBezier();
		this.alphaValue = Math.max(this.node1.hoverAlpha, this.node2.hoverAlpha);
		for (let i = 0; i < this.dotsNumber; i++) {
			this.dots[i].setScale(this.getWidth() * 2 / 59); // 0.2
		}
		this.setAlpha(this.alphaValue);
	}
}
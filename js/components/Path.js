class Path extends Phaser.GameObjects.Container {
	constructor(scene, node1, node2) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.node1 = node1;
		this.node2 = node2;

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
		const d = 1000;
		this.dots = [];

		for (let i = 0; i < this.dotsNumber; i++) {
			this.dots[i] = scene.add.image(0, 0, "arrow");
			this.add(this.dots[i]);
			this.dots[i].setScale(0.2);
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

		this.alphaEasing = 0;
		this.alphaSpeed = 1 / 0.2;
	}

	drawBezier() {
		this.graphics.clear();

		this.graphics.lineStyle(4, 0xffffff);
		this.curve.draw(this.graphics);

		this.graphics.lineStyle(6, 0xff0000);
		this.graphics.strokeCircle(this.node1.x, this.node1.y, 12);

		this.graphics.lineStyle(6, 0x00ff00);
		this.graphics.strokeCircle(this.node2.x, this.node2.y, 6);
	}

	update(delta) {
		this.drawBezier();
		if (this.node1.isHover || this.node2.isHover) {
			this.alphaEasing = Math.min(this.alphaEasing + this.alphaSpeed * delta, 1.0);
		}
		else {
			this.alphaEasing = Math.max(this.alphaEasing - this.alphaSpeed * delta, 0.0);
		}
		this.alpha = Phaser.Math.Easing.Cubic.InOut(this.alphaEasing);
	}
}
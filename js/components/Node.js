class Node extends Button {
	constructor(scene, x, y, species) {
		super(scene, x, y);
		this.species = species;
		scene.add.existing(this);

		this.population = 0.5;
		this.wiggle = 0;
		this.size = 100;
		this.goalX  = x;
		this.goalY  = y;
		this.selected = false;

		this.circle = scene.add.image(0, 0, 'circle');
		this.circle.setScale((this.size+30) / this.circle.height);
		this.circle.setTint(0xd6e3d1);
		this.add(this.circle);

		this.innerCircle = scene.add.image(0, 0, 'circle');
		this.innerCircle.setScale(this.size / this.innerCircle.height);
		this.add(this.innerCircle);
		this.innerCircle.setTint(0xa9bfa1);

		this.image = scene.add.image(0, 0, this.species.image);
		this.image.setScale(this.size / Math.max(this.image.width, this.image.height));
		this.add(this.image);

		this.slider = scene.add.image(0, 0, 'growth_slider');
		this.slider.setScale(this.circle.scaleX * 320/779);
		this.slider.x += 61 * this.slider.scaleX;
		this.slider.y += -325 * this.slider.scaleY;
		this.add(this.slider);
		this.sendToBack(this.slider);

		this.arrow = scene.add.image(0, 0, 'growth_slider_arrow');
		this.arrow.setScale(0.2 * this.size / this.arrow.height);
		this.add(this.arrow);
		let tweenObject = {
			val: 0
		}
		scene.tweens.add({
			targets: tweenObject,
			val: 1,
			duration: 3000,
			repeat: -1,
			yoyo: true,
			//ease: "Sine.easeInOut",
			callbackScope: this,
			onUpdate: function(tween, target) {
				this.updateArrow(target.val);
			}
		});

		let shape = scene.make.graphics({ fillStyle: { color: 0x000000 }, add: false });
		let circle = new Phaser.Geom.Circle(0, 0, this.size*0.4);
		shape.fillCircleShape(circle);
		//let mask = shape.createGeometryMask();
		//this.image.setMask(mask);

		this.bindInteractive(this.circle);

		this.alphaEasing = 0;
		this.alphaSpeed = 1 / 0.2;
		this.hoverAlpha = 0;
	}


	getScale() {
		let smooth = 0.5 + Math.atan(3 * (this.population + this.wiggle - 0.5)) / Math.PI;
		return 0.5 + 0.6 * smooth;
	}

	updateArrow() {
		const sliderAngle = Phaser.Math.DegToRad(54.5);
		let smooth = this.population;
		// TODO: Inverse the easing for a set goal
		//let smooth = Phaser.Math.Easing.Sine.InOut(this.population);
		let angle = -Math.PI/2 - sliderAngle + 2 * sliderAngle * smooth;
		let radius = this.size * (0.74 + 0.2 * smooth);

		var vector = new Phaser.Math.Vector2();
		vector.setToPolar(angle, radius);

		this.arrow.x = vector.x;
		this.arrow.y = vector.y*0.97;
		this.arrow.angle = Phaser.Math.RadToDeg(vector.angle()) + 90;
	}

	setPopulation(pop, wiggle) {
		this.population = pop;
		this.wiggle = wiggle;
		this.setScale(this.getScale());
		this.updateArrow(pop);
	}


	//update(delta) {
	//	...
	//}


	onOut() {
		super.onOut();
		this.setScale(1.00 * this.getScale());
		this.image.setTint(0xDDDDDD);
	}

	onOver() {
		super.onOver();
		this.setScale(1.05 * this.getScale());
		this.image.setTint(0xFFFFFF);
	}

	onDown() {
		super.onDown();
		this.setScale(0.95 * this.getScale());
		this.image.setTint(0xBBBBBB);
	}

	onClick() {
		this.selected = !this.selected;
		this.circle.setTint(this.selected ? 0xffffff : 0xd6e3d1);

		this.setScale(1.00 * this.getScale());
		this.image.setTint(0xDDDDDD);
	}


	onDragStart(pointer, dragX, dragY) {
		this.offsetX = this.x;
		this.offsetY = this.y;
	}

	onDrag(pointer, dragX, dragY) {
		this.goalX = dragX + this.offsetX;
		this.goalY = dragY + this.offsetY;
	}

	onDragEnd(pointer, dragX, dragY, dropped) {
	}


	update(delta) {
		let speed = 2.0;
		this.x += (this.goalX - this.x) / speed;
		this.y += (this.goalY - this.y) / speed;

		if (this.hover || this.selected) {
			this.alphaEasing = Math.min(this.alphaEasing + this.alphaSpeed * delta, 1.0);
		}
		else {
			this.alphaEasing = Math.max(this.alphaEasing - this.alphaSpeed * delta, 0.0);
		}
		this.hoverAlpha = Phaser.Math.Easing.Cubic.InOut(this.alphaEasing);
		this.slider.alpha = this.hoverAlpha;
		this.arrow.alpha = this.hoverAlpha;
	}
}
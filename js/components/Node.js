class Node extends Button {
	constructor(scene, x, y, species) {
		super(scene, x, y);
		this.scene = scene;
		this.species = species;
		scene.add.existing(this);

		this.population = 0.5;
		this.wiggle = 0;
		this.size = scene.W / 8;
		this.goalX  = x;
		this.goalY  = y;
		this.selected = false;
		this.holdEasing = 0.0;

		//this.WHITE = 0xe3e3d1;
		this.WHITE = 0xFFFFFF;
		//this.BLACK = 0x332d24;
		//this.BLACK = 0x474741;
		//this.BLACK = 0x33312e;
		//this.BLACK = 0x6e6766;
		this.BLACK = Phaser.Display.Color.HexStringToColor(this.species.color).color;

		const LAYER_1 = 1.00 - 0 * 0.05;
		const LAYER_2 = 1.00 - 0 * 0.05;
		const LAYER_3 = 1.00 - 2 * 0.05;
		const LAYER_4 = 1.00 - 1.8 * 0.05;

		this.circle = scene.add.image(0, 0, 'circle');
		this.circle.setScale((LAYER_1 * this.size) / this.circle.height);
		this.circle.setTint(this.BLACK);
		this.add(this.circle);

		this.innerCircle = scene.add.image(0, 0, 'circle');
		this.innerCircle.setScale((LAYER_3 * this.size) / this.innerCircle.height);
		this.innerCircle.setTint(this.WHITE);
		this.add(this.innerCircle);

		//this.graphics = scene.add.graphics();
		//this.graphics.fillStyle(this.WHITE);
		//this.graphics.fillCircle(0, 0, LAYER_1 * this.size/2);
		//this.graphics.fillStyle(this.BLACK);
		//this.graphics.fillCircle(0, 0, LAYER_2 * this.size/2);
		//this.graphics.fillStyle(this.WHITE);
		//this.graphics.fillCircle(0, 0, LAYER_3 * this.size/2);
		//this.graphics.setAlpha(0.0, 0.0, 1.0, 1.0);
		//this.add(this.graphics);


		if (this.species.image != "missing") {
			this.image = scene.add.image(0, 0, this.species.image);
			this.image.setScale(LAYER_4 * this.size / Math.max(this.image.width, this.image.height));
		}
		else {
			let name = this.species.name;
			this.image = scene.add.text(0, 0, name, {
				font: "50px 'Crete Round'",
				color: "#000000"
			});
			this.image.setOrigin(0.5);
			this.image.setScale(0.9 * LAYER_4 * this.size / Math.max(this.image.width, this.image.height));
		}
		this.add(this.image);


		this.visibility = null;
		this.setVisibility(this.species.visibility);

		let shape = scene.make.graphics({ fillStyle: { color: 0x000000 }, add: false });
		let circle = new Phaser.Geom.Circle(0, 0, this.size*0.4);
		shape.fillCircleShape(circle);
		//let mask = shape.createGeometryMask();
		//this.image.setMask(mask);

		this.bindInteractive(this.circle);

		this.hoverSpeed = 1 / 0.3;
		this.hoverEasing = 0;
		this.hoverValue = 0;
		this.aliveSpeed = 2 / 0.3;
		this.aliveEasing = 0;
		this.aliveValue = 0;
		this.populationValue = this.population;

		this.spectrum = [
			Phaser.Display.Color.ValueToColor(0x518040), // Green
			Phaser.Display.Color.ValueToColor(0x92A537), // Lime
			Phaser.Display.Color.ValueToColor(0xBEB630), // Yellow
			Phaser.Display.Color.ValueToColor(0xCC9F2C), // Orange
			Phaser.Display.Color.ValueToColor(0xCC6D29), // Red
		];

		this.popEasing = 0;
		this.popEffect = scene.add.graphics();
		this.add(this.popEffect);
	}


	getScale() {
		let w = this.aliveValue;
		let smooth = 0.5 + Math.atan(4 * (this.populationValue - 0.5)) / Math.PI + w * this.wiggle;
		//let value = (0.3 + 1.0 * smooth) * (1+w)/2 + 0.1 * this.holdEasing;
		let value = (0.3 + 1.0 * smooth) * w - 0.1 * this.holdEasing;
		return value;
	}

	setPopulation(pop, immediate=false) {
		this.population = pop;
		if (immediate) {
			this.aliveEasing = this.isAlive();
			this.aliveValue = this.isAlive();
		}
	}

	setWiggle(wiggle) {
		this.wiggle = wiggle;
	}

	isAlive() {
		return (this.visible && this.population > DEATH_THRESHOLD);
	}

	setVisibility(value) {
		this.visibility = value;

		if (value == "explored") {
			this.setVisible(true);
			this.setAlpha(1.0);
			this.image.setTint(0xffffff);
			this.circle.setTint(this.BLACK);
			this.circle.setAlpha(1.0);
			this.innerCircle.setAlpha(0.75, 0.75, 1.0, 1.0);
		}
		else if (value == "unexplored") {
			this.setVisible(true);
			this.setAlpha(1.0);
			this.image.setTint(0x000000);
			this.circle.setAlpha(0.7);
			this.innerCircle.setAlpha(1);
			this.innerCircle.setAlpha(0.25, 0.25, 1.0, 1.0);

			let color = Phaser.Display.Color.Interpolate.ColorWithColor(
				Phaser.Display.Color.ColorToRGBA(this.BLACK),
				Phaser.Display.Color.ColorToRGBA(0x777777),
			100, 80);
			color = Phaser.Display.Color.ObjectToColor(color);
			color = color.color;
			this.circle.setTint(color);
		}
		else if (value == "hidden") {
			this.setVisible(true);
			this.setAlpha(0.2);
			this.image.setTint(0x000000);
			this.innerCircle.setAlpha(0);
			this.circle.setAlpha(0);
			this.circle.setTint(0x777777);
		}
	}


	updateScale() {
		this.setScale(this.getScale());
		//this.image.setAlpha(0.5 + 0.5*this.aliveValue);

		//this.updateArrow(pop);

		//let diff = Phaser.Math.Clamp(Math.abs(1 - 2*this.population), 0, 1);
		//diff = 0.1 + 0.9 * diff; // Due to green being +-0.5
		//let index = Phaser.Math.Clamp(Math.floor(diff * this.spectrum.length), 0, this.spectrum.length-1);
		//let rest = diff * this.spectrum.length - index;

		//let color = Phaser.Display.Color.Interpolate.ColorWithColor(this.spectrum[index], this.spectrum[index+1], 1, rest);
		//color = Phaser.Display.Color.ObjectToColor(color);
		//let color = this.spectrum[index];

			//color = Phaser.Display.Color.ValueToColor(0x777777);
			//this.innerCircle.setTint(color.color);
			//color.v = 0.8;
			//this.innerCircle2.setTint(color.color);
		//else
			//color.s = 0.8;
			//this.innerCircle.setTint(color.color);
			//color.s = 0.0;
			//color.v = 1.0;
			//this.innerCircle2.setTint(color.color);
	}

	setSelected(value) {
		this.selected = value;
	}


	onOut() {
		this.hover = false;
		this.hold = false;
		//this.setScale(1.00 * this.getScale());
		//this.image.setTint(0xEEEEEE);
	}

	onOver() {
		if (this.visibility != "hidden") {
			this.hover = true;
		}
		//this.soundHover.play();
		//this.setScale(1.05 * this.getScale());
		//this.image.setTint(0xFFFFFF);
	}

	onDown() {
		if (this.visibility != "hidden") {
			this.hold = true;
		}
		//this.soundRelease.play();
		//this.setScale(0.95 * this.getScale());
		//this.image.setTint(0xDDDDDD);
	}

	onUp() {
		if (this.hold) {
			//this.soundPress.play();
			this.hold = false;
			this.onClick();
		}
	}

	onClick() {
		this.emit('onClick', this);
		/*
		this.selected = !this.selected;
		this.circle.setTint(this.selected ? this.WHITE : this.BLACK);

		this.onOver();
		*/
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
		this.updateScale();

		let speed = 2.0;
		this.x += (this.goalX - this.x) / speed;
		this.y += (this.goalY - this.y) / speed;


		let hoverTarget = 0.37;
		// if (this.hover) {
		// 	hoverTarget = 1.0;
		// }
		// else if (this.selected) {
		// 	hoverTarget = 0.57;
		// }
		if (this.selected) {
			hoverTarget = 1.0;
		}

		let aliveTarget = this.isAlive() ? 1 : 0;

		const limit = this.hoverSpeed * delta;
		this.hoverEasing += Phaser.Math.Clamp(hoverTarget - this.hoverEasing, -limit, limit);
		this.hoverValue = Phaser.Math.Easing.Cubic.InOut(this.hoverEasing);

		this.holdEasing += 0.5 * (this.hold - this.holdEasing);

		this.aliveEasing += 10 * delta * (aliveTarget - this.aliveEasing);
		this.aliveValue = Phaser.Math.Easing.Quintic.InOut(this.aliveEasing);

		this.populationValue += 10 * delta * (this.population - this.populationValue);


		// Pop effect
		if (this.popEasing > 0) {
			this.popEffect.clear();
			this.popEffect.lineStyle(1.0, 0xffffff, Math.pow(this.popEasing, 2));
			this.popEffect.strokeCircle(0, 0, (3 - 2*Math.pow(this.popEasing, 4)) * this.size / 2);
			this.popEasing -= 2 * delta;
		}
	}
}
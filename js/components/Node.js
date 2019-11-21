class Node extends Button {
	constructor(scene, x, y, species) {
		super(scene, x, y);
		this.species = species;
		scene.add.existing(this);

		this.population = 0.5;
		this.wiggle = 0;
		this.size = scene.W / 8;
		this.goalX  = x;
		this.goalY  = y;
		this.selected = false;
		this.selectFactor = 0.0;

		//this.WHITE = 0xe3e3d1;
		this.WHITE = 0xffffff;
		//this.BLACK = 0x332d24;
		//this.BLACK = 0x474741;
		//this.BLACK = 0x33312e;
		this.BLACK = 0x6e6766;

		const LAYER_1 = 1.00 - 0 * 0.05;
		const LAYER_2 = 1.00 - 1 * 0.05;
		const LAYER_3 = 1.00 - 2 * 0.05;
		const LAYER_4 = 1.00 - 3 * 0.05;

		this.circle = scene.add.image(0, 0, 'circle');
		this.circle.setScale((LAYER_1 * this.size) / this.circle.height);
		this.circle.setTint(this.BLACK);
		this.add(this.circle);

		this.graphics = scene.add.graphics();
		this.graphics.fillStyle(this.WHITE);
		this.graphics.fillCircle(0, 0, LAYER_1 * this.size/2);
		this.graphics.fillStyle(this.BLACK);
		this.graphics.fillCircle(0, 0, LAYER_2 * this.size/2);
		this.graphics.fillStyle(this.WHITE);
		this.graphics.fillCircle(0, 0, LAYER_3 * this.size/2);
		this.add(this.graphics);


		this.image = scene.add.image(0, 0, this.species.image);
		this.image.setScale(LAYER_4 * this.size / Math.max(this.image.width, this.image.height));
		this.add(this.image);


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
	}


	getScale() {
		let w = this.aliveValue;
		let smooth = 0.5 + Math.atan(4 * (this.populationValue - 0.5)) / Math.PI + w * this.wiggle;
		let value = (0.3 + 1.0 * smooth) * (1+w)/2 + 0.1 * this.selectFactor;
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
		return (this.population > DEATH_THRESHOLD);
	}


	updateScale() {
		this.setScale(this.getScale());
		//this.updateArrow(pop);

		//let diff = Phaser.Math.Clamp(Math.abs(1 - 2*this.population), 0, 1);
		//diff = 0.1 + 0.9 * diff; // Due to green being +-0.5
		//let index = Phaser.Math.Clamp(Math.floor(diff * this.spectrum.length), 0, this.spectrum.length-1);
		//let rest = diff * this.spectrum.length - index;

		//let color = Phaser.Display.Color.Interpolate.ColorWithColor(this.spectrum[index], this.spectrum[index+1], 1, rest);
		//color = Phaser.Display.Color.ObjectToColor(color);
		//let color = this.spectrum[index];
			this.image.setAlpha(0.5 + 0.5*this.aliveValue);

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


	onOut() {
		super.onOut();
		this.setScale(1.00 * this.getScale());
		this.image.setTint(0xEEEEEE);
	}

	onOver() {
		super.onOver();
		this.setScale(1.05 * this.getScale());
		this.image.setTint(0xFFFFFF);
	}

	onDown() {
		super.onDown();
		this.setScale(0.95 * this.getScale());
		this.image.setTint(0xDDDDDD);
	}

	onClick() {
		this.selected = !this.selected;
		this.circle.setTint(this.selected ? this.WHITE : this.BLACK);

		this.onOver();
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
		if (this.hover) {
			hoverTarget = 1.0;
		}
		else if (this.selected) {
			hoverTarget = 0.57;
		}

		let aliveTarget = this.isAlive() ? 1 : 0;

		this.hoverEasing += Phaser.Math.Clamp(hoverTarget - this.hoverEasing, -this.hoverSpeed * delta, this.hoverSpeed * delta);
		this.hoverValue = Phaser.Math.Easing.Cubic.InOut(this.hoverEasing);

		this.aliveEasing += 10 * delta * (aliveTarget - this.aliveEasing);
		this.aliveValue = Phaser.Math.Easing.Quintic.InOut(this.aliveEasing);

		this.populationValue += 10 * delta * (this.population - this.populationValue);
	}
}
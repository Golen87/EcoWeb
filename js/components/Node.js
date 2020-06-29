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

		this.neighbours = [];

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

		const shape = isAbiotic(species.type) ? "diamond" : "circle";

		this.circle = scene.add.image(0, 0, shape);
		this.circle.setScale((LAYER_1 * this.size) / this.circle.height);
		this.circle.setTint(this.BLACK);
		this.add(this.circle);

		this.innerCircle = scene.add.image(0, 0, shape);
		this.innerCircle.setScale((LAYER_3 * this.size) / this.innerCircle.height);
		this.innerCircle.setTint(this.WHITE);
		this.add(this.innerCircle);


		if (this.species.image != "missing") {
			this.image = scene.add.image(0, 0, this.species.image);
			this.image.setScale(LAYER_4 * this.size / Math.max(this.image.width, this.image.height));
		}
		else {
			let name = this.species.name;
			this.image = createText(scene, 0, 0, 50, "#000", name);
			this.image.setOrigin(0.5);
			this.image.setScale(0.9 * LAYER_4 * this.size / Math.max(this.image.width, this.image.height));
		}
		this.add(this.image);

		this.unexplored = scene.add.image(0, 0, 'missing');
		this.unexplored.setScale(LAYER_4 * this.size / Math.max(this.unexplored.width, this.unexplored.height));
		this.add(this.unexplored);


		//let shape = scene.make.graphics({ fillStyle: { color: 0x000000 }, add: false });
		//let circle = new Phaser.Geom.Circle(0, 0, this.size*0.4);
		//shape.fillCircleShape(circle);
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


		const SEARCH_SIZE = 0.35 * this.size;
		const SEARCH_X = 0.35 * this.size;
		const SEARCH_Y = -0.35 * this.size;
		this.searchContainer = scene.add.container(SEARCH_X, SEARCH_Y);
		this.add(this.searchContainer);
 
		this.searchBg = scene.add.image(0, 0, 'circle');
		this.searchBg.setScale(SEARCH_SIZE / this.searchBg.height);
		this.searchBg.setTint(this.WHITE);
		this.searchContainer.add(this.searchBg);

		//this.searchBg2 = scene.add.image(0, 0, 'circle');
		//this.searchBg2.setScale(0.85 * SEARCH_SIZE / this.searchBg2.height);
		//this.searchBg2.setTint(this.WHITE);
		//this.searchContainer.add(this.searchBg2);

		this.exploreState = null;
		this.progressStart = 0;
		this.progressLength = 20;
		this.progressArc = scene.add.graphics();
		//this.searchContainer.add(this.progressArc);
		this.add(this.progressArc);
		this.updateProgress(0);

		this.bringToTop(this.searchContainer);


		this.search = scene.add.image(0, 0, 'search');
		this.search.setScale(0.75 * SEARCH_SIZE / Math.max(this.search.width, this.search.height));
		this.search.setTint(0);
		this.search.setTint(this.interpolateColor(this.BLACK, 0, 0.5));
		this.searchContainer.add(this.search);


		if (this.species.visibility == "unexplored") {
			this.startExploration(0);
			//this.updateProgress(9999);
		}

		this.visibility = null;
		this.setVisibility(this.species.visibility);
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
			this.image.setVisible(true);
			this.unexplored.setVisible(false);
			this.image.setTint(0xffffff);
			this.circle.setTint(this.BLACK);
			this.circle.setAlpha(1.0);
			this.innerCircle.setAlpha(0.75, 0.75, 1.0, 1.0);
			this.searchContainer.setVisible(false);
		}
		else if (value == "unexplored") {
			this.setVisible(true);
			this.setAlpha(1.0);
			if (this.exploreState == "ready") {
				this.image.setVisible(true);
				this.unexplored.setVisible(false);
			}
			else {
				this.image.setVisible(false);
				this.unexplored.setVisible(true);
			}
			this.image.setTint(0x000000);
			this.circle.setAlpha(0.7);
			this.circle.setAlpha(1);
			this.innerCircle.setAlpha(1);
			this.innerCircle.setAlpha(0.25, 0.25, 1.0, 1.0);

			let color = Phaser.Display.Color.Interpolate.ColorWithColor(
				Phaser.Display.Color.ColorToRGBA(this.BLACK),
				Phaser.Display.Color.ColorToRGBA(0x777777),
			100, 80);
			color = Phaser.Display.Color.ObjectToColor(color);
			color = color.color;
			this.circle.setTint(color);
			this.searchContainer.setVisible(true);
		}
		else if (value == "hidden") {
			this.setVisible(true);
			this.setAlpha(0.2);
			this.image.setVisible(false);
			this.unexplored.setVisible(true);
			this.image.setTint(0x000000);
			this.innerCircle.setAlpha(0.2);
			this.circle.setAlpha(0.2);
			this.circle.setTint(0x777777);
			this.searchContainer.setVisible(false);
		}
	}


	updateScale() {
		this.setScale(this.getScale());
		this.searchContainer.setScale(1/this.getScale());
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


	update(time, delta) {
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


		// Progress bar blinking
		if (this.exploreState == "loading") {
			this.progressArc.setAlpha(1);
		}
		else if (this.exploreState == "ready") {
			this.search.setAlpha(0.66 + (0.33) * Math.sin(time/150));
			this.progressArc.setAlpha(1);
		}
		else {
			this.progressArc.clear();
		}
	}

	canExplore() {
		return (this.visibility != "explored" && !this.exploreState);
	}

	startExploration(time) {
		if (this.canExplore()) {
			this.setVisibility("unexplored");
			this.exploreState = "loading";
			this.progressStart = time;
		}
	}

	resetExploration(time) {
		if (this.visibility == "unexplored") {
			this.exploreState = "loading";
			this.progressStart = time;
		}
	}

	finishExploration() {
		this.setVisibility("explored");
		this.exploreState = "done";
		this.holdEasing = 1;
		this.popEasing = 1;
	}

	updateProgress(time) {
		if (this.exploreState == "loading") {
			this.progress = (time - this.progressStart) / this.progressLength;
			this.progress = Phaser.Math.Clamp(this.progress, 0, 1);
			this.progressArc.clear();

			this.searchContainer.setVisible(false);

			if (this.progress > 0) {
				const thick = 0.08;
				const size = this.circle.displayWidth * (1 + thick/2);
				this.progressArc.beginPath();
				this.progressArc.lineStyle(thick * size, this.WHITE);
				this.progressArc.arc(this.searchBg.x, this.searchBg.y, (1 - thick) * size / 2,
					Phaser.Math.DegToRad(-90+360 * this.progress),
					Phaser.Math.DegToRad(-90),
				true, 0.0);
				this.progressArc.strokePath();
				this.progressArc.closePath();
			}

			if (this.progress >= 1) {
				this.exploreState = "ready";
				this.setVisibility(this.visibility);
			}
		}
	}


	interpolateColor(color1, color2, value) {
		return Phaser.Display.Color.ObjectToColor(
			Phaser.Display.Color.Interpolate.ColorWithColor(
				Phaser.Display.Color.ColorToRGBA(color1),
				Phaser.Display.Color.ColorToRGBA(color2),
			100, value * 100)
		).color;
	}
}
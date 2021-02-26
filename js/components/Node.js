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
		this.WHITE = 0xFAECDC;
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
		this.exploreQueued = false;
		this.exploreAvailable = true;
		this.progressStart = 0;
		this.progressLength = 20;
		this.progressArc = scene.add.graphics();
		//this.searchContainer.add(this.progressArc);
		this.add(this.progressArc);
		this.updateProgress(0);

		this.bringToTop(this.searchContainer);


		this.search = scene.add.image(0, 0, 'search');
		this.search.setScale(0.75 * SEARCH_SIZE / Math.max(this.search.width, this.search.height));
		this.search.setTint(this.interpolateColor(this.BLACK, 0, 0.5));
		this.searchContainer.add(this.search);


		const ARROWS_SIZE = 0.265 * this.size / 51;
		const ARROWS_X = 0.0 * this.size;
		const ARROWS_Y = 0.0 * this.size;
		this.arrowsContainer = scene.add.container(0*ARROWS_X, 0*ARROWS_Y);
		this.add(this.arrowsContainer);

		const arrows = [
			{x:0.54, y:0.40, s:'small'},
			{x:0.54, y:0.40, s:'big'},
			{x:0.38, y:0.54, s:'small'},
			{x:0.64, y:0.61, s:'small'},
			{x:0.73, y:0.31, s:'small'},
			{x:0.60, y:0.16, s:'small'},
		];
		this.downArrows = [];
		for (const a of arrows) {
			let arrow = scene.add.image(a.x*this.size, a.y*this.size, 'arrow_down_'+a.s);
			arrow.setScale(ARROWS_SIZE);
			this.arrowsContainer.add(arrow);
			this.downArrows.push(arrow);
		}
		this.upArrows = [];
		for (const a of arrows) {
			let arrow = scene.add.image(a.x*this.size, -a.y*this.size, 'arrow_up_'+a.s);
			arrow.setScale(ARROWS_SIZE);
			this.arrowsContainer.add(arrow);
			this.upArrows.push(arrow);
		}


		const RADIAL_SIZE = 0.4 * this.size;
		const RADIAL_X = -0.55 * this.size;
		const RADIAL_Y = -0.55 * this.size;
		this.radialContainer = scene.add.container(RADIAL_X, RADIAL_Y);
		this.add(this.radialContainer);
		
		this.radialBg = scene.add.image(0, 0, 'circle');
		this.radialBg.setScale(RADIAL_SIZE / this.radialBg.height);
		this.radialBg.setTint(this.WHITE);
		this.radialContainer.add(this.radialBg);
		this.radialBg.setInteractive({ useHandCursor: true })
			.on('pointerup', this.onKill.bind(this));
		this.radialContainer.bringToTop();

		this.radialMag = scene.add.image(0, 0, 'frame_search');
		this.radialMag.setScale(1.2*RADIAL_SIZE / this.radialBg.height);
		this.radialContainer.add(this.radialMag);


		//if (this.species.visibility == "explored") {
			//this.startExploration(0);
			//this.updateProgress(9999);
		//}

		this.visibility = null;
		this.setVisibility(this.species.visibility);
	}
	onKill() {
		console.log(this.scene.timeController.time);
	}


	getScale() {
		let w = 0.8 + 0.2 * this.aliveValue;
		let smooth = 0.5 + Math.atan(4 * (this.populationValue - 0.5)) / Math.PI + w * this.wiggle;
		//let value = (0.3 + 1.0 * smooth) * (1+w)/2 + 0.1 * this.holdEasing;
		let value = (0.3 + 1.0 * smooth) * w - 0.1 * this.holdEasing;
		return 0.8;
		return value;
	}

	setPopulation(pop, der, immediate=false) {
		this.population = pop;
		this.derivative = der;
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
		else if (value == "explorable") {
			this.setVisible(true);
			this.setAlpha(1.0);
			if (this.exploreState == "loading" || this.exploreState == "finished" || window.profile.isExplored(this.species)) {
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
			this.searchContainer.setVisible(this.exploreQueued || this.exploreAvailable || this.exploreState == "finished");
			if (this.exploreState == "finished") {
				this.search.setTexture("check");
			}
			else if (this.exploreQueued) {
				this.search.setTexture("check");
			}
			else {
				this.search.setTexture("search");
			}
		}
		else if (value == "hidden" || value == "unexplored") {
			this.setVisible(true);
			this.setAlpha(0.2);
			if (window.profile.isExplored(this.species)) {
				this.image.setVisible(true);
				this.unexplored.setVisible(false);
			}
			else {
				this.image.setVisible(false);
				this.unexplored.setVisible(true);
			}
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
		this.image.setAlpha(0.5 + 0.5*this.aliveValue);
		if (this.visibility == "explored") {
			this.circle.setTint(this.interpolateColor(0x777777, this.BLACK, this.aliveValue));
		}

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
		console.log(value);
	}


	onOut() {
		this.hover = false;
		this.hold = false;
		//this.setScale(1.00 * this.getScale());
		//this.image.setTint(0xEEEEEE);
	}

	onOver() {
		if (this.visibility == "explored" || this.visibility == "explorable") {
			this.hover = true;
		}
		//this.soundHover.play();
		//this.setScale(1.05 * this.getScale());
		//this.image.setTint(0xFFFFFF);
	}

	onDown() {
		if (this.visibility == "explored" || this.visibility == "explorable") {
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
		this.radialContainer.setVisible(this.selected);
		this.radialContainer.setPosition(-0.55 * this.size * this.hoverValue, -0.55 * this.size * this.hoverValue);

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
		else if (this.exploreState == "finished") {
			this.search.setAlpha(0.66 + (0.33) * Math.sin(time/150));
			this.progressArc.setAlpha(1);
		}
		else {
			this.progressArc.clear();
		}


		// Derivative arrows
		for (let i = this.upArrows.length - 1; i >= 0; i--) {
			let upValue = this.derivative > 1E-2 ? Math.log(this.derivative)/Math.log(10) + 0 : 0;
			let downValue = -this.derivative > 1E-2 ? Math.log(-this.derivative)/Math.log(10) + 0 : 0;
			// let upValue = this.derivative / 1000;
			// let downValue = -this.derivative / 1000;
			this.upArrows[i].setVisible(Phaser.Math.Clamp(upValue-i, 0, 1) > 0.5);
			this.downArrows[i].setVisible(Phaser.Math.Clamp(downValue-i, 0, 1) > 0.5);
		}
	}

	canExplore() {
		return (this.visibility != "explored" && !this.exploreState);
	}

	toggleExploration() {
		if (this.canExplore()) {
			this.exploreQueued = !this.exploreQueued;
			this.setVisibility("explorable");
			return this.exploreQueued ? 1 : -1;
		}
		return 0;
	}

	startExploration(section) {
		if (this.exploreQueued) {
			this.exploreQueued = false;
			this.exploreState = "loading";
			this.setVisibility("explorable");
			this.progressStart = section.start;
			this.progressLength = section.end - section.start;
		}
	}

	resetExploration(time) {
		if (this.visibility == "explorable") {
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
				this.exploreState = "finished";
				this.setVisibility(this.visibility);
			}
		}
	}

	availableCheck(running, research) {
		this.exploreAvailable = (!running && research > 0);
		this.setVisibility(this.visibility);
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
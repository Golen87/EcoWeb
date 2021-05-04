class Node2 extends Button {
	constructor(scene, x, y, species) {
		super(scene, x, y);
		this.scene = scene;
		this.species = species;
		scene.add.existing(this);

		this.population = 0;
		this.alive = false;

		this.neighbours = [];
		this.goalX = x;
		this.goalY = y;
		this.stick = true;
		this.stickX = x;
		this.stickY = y;

		this.inPlay = false;
		this.slotIndex = null;

		this.liftSmooth = 0;


		this.limitLeft = NODE_SIZE/2;
		this.limitTop = NODE_SIZE/2;
		this.limitRight = this.scene.W - NODE_SIZE/2;
		this.limitBottom = this.scene.H - 0.2 * this.scene.H - NODE_SIZE/2;


		// ...
		this.minPopThreshold = 0;
		this.maxPopThreshold = 1;
		if (this.species.type == 'plant') {
			// this.minPopThreshold = 0.45;
			this.maxPopThreshold = 1.00;
		}
		else if (this.species.type == 'animal') {
			if (this.species.food == 'herbivore') {
				// this.minPopThreshold = 0.25;
				this.maxPopThreshold = 0.60;
			}
			else if (this.species.food == 'carnivore') {
				// this.minPopThreshold = 0.25;
				// this.maxPopThreshold = 0.35;
				this.maxPopThreshold = 0.60;
			}
		}


		// Image
		this.circle = new CircleButton(scene, 0, 0, NODE_SIZE, () => {}, this.species.image);
		// this.circle.setDepth(1);
		this.bindInteractive(this.circle.image, true);
		this.add(this.circle);

		this.text = createText(scene, 0, -0.6*NODE_SIZE, 20, "#FFF", this.species.name);
		// this.text.setDepth(1);
		this.text.setOrigin(0.5, 1.0);
		// this.text.setVisible(false);
		this.text.setAlpha(0);
		// this.circle.add(this.text);
		this.add(this.text);


		// let xs = 73 * (NODE_SIZE/100);
		// let ys = 22 * (NODE_SIZE/100);

		// Plus button
		// this.plus = new CircleButton(scene, xs, -ys, 0.3*NODE_SIZE, () => {
		// 	this.emit('onPlusMinus', this, 1);
		// });
		// this.plus.image.setAlpha(0.7);
		// this.plus.setVisible(false);
		// this.plus.bindInteractive(this.plus.image);
		// this.add(this.plus);

		// this.plusText = createText(scene, 0, 0, 0.3*NODE_SIZE, "#000", "+");
		// this.plusText.setOrigin(0.5);
		// this.plus.add(this.plusText);


		// Minus button
		// this.minus = new CircleButton(scene, xs, ys, 0.3*NODE_SIZE, () => {
		// 	this.emit('onPlusMinus', this, -1);
		// });
		// this.minus.image.setAlpha(0.7);
		// this.minus.setVisible(false);
		// this.minus.bindInteractive(this.minus.image);
		// this.add(this.minus);

		// this.minusText = createText(scene, 0, -1, 0.3*NODE_SIZE, "#000", "–");
		// this.minusText.setOrigin(0.5);
		// this.minus.add(this.minusText);


		// Plant energy
		this.energyGraphics = scene.add.graphics();
		this.energyGraphics.setBlendMode(Phaser.BlendModes.ADD);
		this.add(this.energyGraphics);
		this.sendToBack(this.energyGraphics);

		this.dots = [];
		this.prevSpawnTime = 0;
	}


	setPopulation(value) {
		const DEATH_THRESHOLD = 0.02;

		let prevAlive = (this.population > DEATH_THRESHOLD);
		this.population = value;
		this.alive = (this.population > DEATH_THRESHOLD);

		if (this.alive != prevAlive) {
			if (this.alive) {
				this.resetPostPipeline();
			}
			else {
				this.setPostPipeline(GrayScalePostFilter);
				this.emit('onDeath', this);
			}
		}

		if (this.inPlay) {
			let min = this.minPopThreshold;
			let max = this.maxPopThreshold;
			let factor = (Math.max(this.population, DEATH_THRESHOLD) - min) / (max - min);
			// let factor = this.population;
			this.circle.setScale(0.5 + 0.9 * factor);
		}
		else {
			this.circle.setScale(1.0);
		}
	}


	update(time, delta) {
		this.circle.image.setAlpha(this.hold ? 0.7 : 1.0);

		this.x += (this.goalX - this.x) / 2.0;
		this.y += (this.goalY - this.y) / 2.0;

		if (this.stick && this.hold) {
			this.x += (this.stickX - this.x) / 1.5;
			this.y += (this.stickY - this.y) / 1.5;

			const dist = this.isInsidePlayingField() ? this.circle.image.displayWidth/4 : this.circle.image.displayWidth;
			if (Phaser.Math.Distance.Between(this.goalX, this.goalY, this.stickX, this.stickY) > dist) {
				this.stick = false;
				this.scene.tweens.add({
					targets: this,
					liftSmooth: { from: this.liftSmooth, to: 1 },
					ease: 'Cubic',
					duration: 200
				});
			}
		}

		let withinDistance = Phaser.Math.Distance.BetweenPoints(this, this.scene.input) < NODE_SIZE;
		let showButtons = withinDistance && !this.hold && this.isInsidePlayingField();
		// this.plus.setVisible(showButtons);
		// this.minus.setVisible(showButtons);

		let scale = 1 + 0.15 * this.liftSmooth;
		this.circle.image.setScale(scale * this.circle.image.origScale);

		// Show name when holding the node
		this.text.setAlpha(this.liftSmooth);

		this.energyGraphics.clear();
		if (this.inPlay && this.alive && this.species.isPlant()) {
			this.drawEnergy(time, delta);
		}
	}

	drawEnergy(time, delta) {
		let count = 10;
		let radius = 6;
		let speed = 6000;
		let offset = (time / speed) % (1/count);

		for (var i = this.dots.length - 1; i >= 0; i--) {
			let dot = this.dots[i];

			let alpha = 0.5 * (1 - 2*Math.abs(0.5 - dot.radius));
			this.energyGraphics.fillStyle(0xFFFFFF, alpha);
			this.energyGraphics.fillCircle(
				NODE_SIZE*this.circle.scaleX * dot.radius * Math.cos(dot.angle),
				NODE_SIZE*this.circle.scaleX * dot.radius * Math.sin(dot.angle),
				radius
			);

			dot.radius -= 0.5*delta;
			if (dot.radius <= 0) {
				this.dots.splice(i, 1);
			}
		}

		if (time > this.prevSpawnTime + 600 - 500*this.population) {
			this.dots.push({
				angle: (0.2 + 0.6 * Math.random())*Math.PI,
				// angle: (0.2 + time/1000 % 0.6)*Math.PI,
				radius: 1
			});
			this.prevSpawnTime = time;
		}
	}

	isInsidePlayingField() {
		if (!this.visible) {
			return false;
		}
		if (this.goalX < this.limitLeft || this.goalX > this.limitRight)
			return false;
		if (this.goalY < this.limitTop || this.goalY > this.limitBottom)
			return false;
		return true;
	}

	getWidth() {
		return this.circle.image.displayWidth * this.circle.scale;
	}


	onDragStart(pointer, dragX, dragY) {
		this.offsetX = this.x;
		this.offsetY = this.y;
		this.emit('onDragStart', this, true, true);
	}

	onDrag(pointer, dragX, dragY) {
		this.goalX = dragX*this.circle.scaleX + this.offsetX;
		this.goalY = dragY*this.circle.scaleX + this.offsetY;
	}

	onDragEnd(pointer, dragX, dragY, dropped) {
		if (this.stick) {
			this.goalX = this.stickX;
			this.goalY = this.stickY;
		}
		else {
			this.stickX = this.goalX;
			this.stickY = this.goalY;
		}
		this.stick = true;

		if (!this.isInsidePlayingField()) {
			this.resetPosition();
			// this.scene.updateSize(this, -this.size);
		}
		else {
			if (!this.inPlay) {
				this.inPlay = true;
				this.removeSlot();
				this.emit('onEnter', this, true, true);
			}
		}

		this.scene.tweens.add({
			targets: this,
			liftSmooth: { from: this.liftSmooth, to: 0 },
			ease: 'Cubic',
			duration: 200
		});
	}


	assignSlot(x, y, index, forceMove=false) {
		this.goalX = x;
		this.goalY = y;
		this.stickX = x;
		this.stickY = y;
		this.slotIndex = index;

		if (forceMove) {
			this.x = x;
			this.y = y;
		}
	}

	removeSlot() {
		if (this.slotIndex != null) {
			this.scene.removeNodeFromSlot(this, this.slotIndex);
			this.slotIndex = null;
		}
	}

	requiresSlot() {
		return (this.visible && this.slotIndex == null && !this.inPlay);
	}

	resetPosition(manually=true) {
		this.removeSlot();
		if (manually) {
			this.scene.assignNodeToSlot(this);
		}

		if (this.inPlay) {
			this.inPlay = false;
			this.emit('onExit', this, false, manually);
		}

		this.setPopulation(1.0);
	}
}
class FoodWebNode extends Phaser.GameObjects.Container {
	constructor(scene, x, y, species, config) {
		super(scene, x, y);
		this.scene = scene;
		this.species = species;
		this.config = config;

		this.neighbours = [];
		this.alphaGoal = 1;

		this.setDepth(1);
		this.setVisible(true);

		let tier = (species.isPlant() ? 1 : (species.isHerbivore() ? 2 : 3));
		this.hasImage = !species.image.startsWith('icon');
		this.size = 20 + 12 * tier;

		// Colored background circle
		this.circle = scene.add.image(0, 0, 'circle');
		this.circle.setScale((this.size+6) / this.circle.width);
		this.circle.setTint(this.config.groupColors[species.group]);
		this.circle.setAlpha(0.4);
		this.add(this.circle);

		// Image of species (or icon if missing)
		this.image = scene.add.image(0, 0, species.image);
		this.image.setAlpha(this.hasImage ? 1.0 : 0.75);
		this.image.setScale((this.hasImage ? 1.0 : 0.8) * this.size / this.image.width);
		this.add(this.image);

		// Name background
		this.nameBg = this.scene.add.rexRoundRectangle(0, -this.size/2 - 24, 24, 24, 24/2, 0xFFFFFF, 1.0);
		this.nameBg.setOrigin(0.5);
		this.add(this.nameBg);

		// Name label next to node
		this.name = createText(scene, this.nameBg.x, this.nameBg.y, 14, "#000000", "");
		this.name.setOrigin(0.5);
		this.add(this.name);
		language.bind(this.name, species.id, () => {
			this.nameBg.width = this.name.width + this.nameBg.height;
			// this.name.x = this.nameBg.x + this.nameBg.width/2;
		});

		this.velocity = new Phaser.Math.Vector2(10, 0);
		this.arbitraryLockTimer = 2 * (1 - Math.pow(Math.random(), 1.5));

		this._selected = false;
		this._dragged = false;
		this._held = false; // Used only to determine click

		this.circle.setInteractive({ useHandCursor: true, draggable: true })
			.on('pointerdown', () => {
				this._held = true;
			})
			.on('pointerout', () => {
				this._held = false;
			})
			.on('pointerup', () => {
				if (this._held) {
					this.selected = !this._selected;
					this._held = false;
				}
			})
			.on('dragstart', (pointer, dragX, dragY) => {
				this.dragOffsetX = this.x;
				this.dragOffsetY = this.y;
				this._dragX = pointer.x;
				this._dragY = pointer.y;
			})
			.on('drag', (pointer, dragX, dragY) => {
				if (this._held && (Math.abs(pointer.x - this._dragX) > 20 || Math.abs(pointer.y - this._dragY) > 20)) {
					this._held = false;
				}
				this._dragged = true;
				this.goalX = dragX + this.dragOffsetX;
				this.goalY = dragY + this.dragOffsetY;
			})
			.on('dragend', (pointer, dragX, dragY, dropped) => {
				this._dragged = false;
			});
	}


	update(time, delta) {
		// Gravity
		let gravityStrength = (1 / this.config.gravity) * this.config.mode;
		let towardCenter = this.config.center.clone();
		towardCenter.subtract(this);
		towardCenter.x *= gravityStrength;
		towardCenter.y *= 2.2*gravityStrength;
		this.velocity.add(towardCenter);

		// Group
		let groupStrength = (1 / this.config.groupStrength) * (1 - this.config.mode);
		let towardGroup = this.config.groupPositions[this.species.group].clone();
		towardGroup.y += 7*Math.sin(time/1500+towardGroup.x/400+towardGroup.y/1000);
		towardGroup.subtract(this);
		towardGroup.scale(groupStrength);
		this.velocity.add(towardGroup);

		// Movement
		if (this.locked) {
			this.arbitraryLockTimer -= delta;
			this.velocity.reset();
		}
		else if (this._dragged) {
			if (!this._held) {
				this.x += (this.goalX - this.x) / 2.0;
				this.y += (this.goalY - this.y) / 2.0;
			}
			this.velocity.reset();
		}
		else {
			let maxVel = 30;
			let vel = this.velocity.length();
			// if (this.velocity.lengthSq() > maxVel * maxVel) {
				// this.velocity.setLength(maxVel);
			// }
			if (vel > 0) {
				this.velocity.scale((maxVel-maxVel*Math.exp(-vel/maxVel))/vel);
				this.x += this.velocity.x;
				this.y += this.velocity.y;
				this.velocity.scale(this.config.friction);
			}
		}

		// Keep within border
		if (this.x < this.config.borderLeft) {
			this.x = this.config.borderLeft;
			// this.velocity.x *= -1;
		}
		if (this.y < this.config.borderTop) {
			this.y = this.config.borderTop;
			// this.velocity.y *= -1;
		}
		if (this.x > this.config.borderRight) {
			this.x = this.config.borderRight;
			// this.velocity.x *= -1;
		}
		if (this.y > this.config.borderBottom) {
			this.y = this.config.borderBottom;
			// this.velocity.y *= -1;
		}


		// Selected

		this.circle.setTint(this.selected ? 0xFFFFFF : this.config.groupColors[this.species.group]);
		this.circle.setAlpha(this.selected ? 1.0 : 0.4);
		if (!this.hasImage) {
			this.image.setTint(this.selected ? 0x000000 : 0xFFFFFF);
		}
		this.nameBg.setVisible(this.selected);
		this.name.setVisible(this.selected);

		// this.alpha += 0.1 * (this.alphaGoal - this.alpha);
		this.alpha += Phaser.Math.Clamp(this.alphaGoal - this.alpha, -4*delta, 4*delta);

		if (this.hyperLink) {
			this.hyperLink.setAlpha(this._selected ? 1.0 : 0.4);
			this.hyperLink.setTint(this.selected ? 0xFFFFFF : this.config.groupColors[this.species.group]);
		}
	}


	move(dx, dy) {
		if (!this.locked && !this._dragged) {
			this.x += dx;
			this.y += dy;
		}
	}

	setAlphaGoal(value) {
		this.alphaGoal = value;
	}

	get selected() {
		return this._selected || this._dragged || this._held;
	}

	set selected(value) {
		this.emit('onSelect', this, value);
		this._selected = value;
	}

	get locked() {
		return this.arbitraryLockTimer > 0;
	}

	// Hack to slowly fade in alpha during the start
	get visibility() {
		if (this._visibilityCache) {
			return this._visibilityCache * this.alpha;
		}
		let borderMinDistance = Math.min(
			this.x - this.config.borderLeft,
			this.y - this.config.borderTop,
			this.config.borderRight - this.x,
			this.config.borderBottom - this.y
		);
		// when 0, it's 0/200 = 0
		// when 200, it's 200/200 = 1
		let visibility = Phaser.Math.Clamp((borderMinDistance - 150) / 100, 0, 1);
		if (visibility == 1) {
			this._visibilityCache = 1;
		}
		return visibility * this.alpha;
	}
}
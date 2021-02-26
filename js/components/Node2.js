class Node2 extends Button {
	constructor(scene, x, y, species) {
		super(scene, x, y);
		this.scene = scene;
		this.species = species;
		scene.add.existing(this);

		this.neighbours = [];
		this.startX = x;
		this.startY = y;
		this.goalX = x;
		this.goalY = y;
		this.stick = true;
		this.stickX = x;
		this.stickY = y;

		this.liftSmooth = 0;


		// Proximity area
		// this.proximity = scene.add.sprite(0, 0, "circle");
		// this.proximity.setScale(2*80 / this.proximity.height);
		// this.proximity.setInteractive({ useHandCursor: false })
		// 	.on('pointerout', () => {
		// 		this.plus.setVisible(false);
		// 		this.minus.setVisible(false);
		// 	})
		// 	.on('pointerover', () => {
		// 		this.plus.setVisible(true);
		// 		this.minus.setVisible(true);
		// 	});
		// this.proximity.setAlpha(0.001);
		// this.add(this.proximity);


		// Image
		this.circle = new CircleButton(scene, 0, 0, 80, () => {}, this.species.image);
		// this.circle.setDepth(1);
		this.circle.image.setTint(0xEEEEEE);
		this.bindInteractive(this.circle.image, true);
		this.add(this.circle);

		this.text = createText(scene, 0, 45, 20, "#FFF", this.species.name);
		// this.text.setDepth(1);
		this.text.setOrigin(0.5, 0);
		this.text.setVisible(false);
		this.circle.add(this.text);


		let xs = 73 * (80/100);
		let ys = 22 * (80/100);

		// Plus button
		this.plus = new CircleButton(scene, xs, -ys, 0.3*80, () => {
			this.scene.change(this, 1);
		});
		this.plus.image.setAlpha(0.7);
		this.plus.setVisible(false);
		this.plus.bindInteractive(this.plus.image);
		this.add(this.plus);

		this.plusText = createText(scene, 0, 0, 0.3*80, "#000", "+");
		this.plusText.setOrigin(0.5);
		this.plus.add(this.plusText);


		// Minus button
		this.minus = new CircleButton(scene, xs, ys, 0.3*80, () => {
			this.scene.change(this, -1);
		});
		this.minus.image.setAlpha(0.7);
		this.minus.setVisible(false);
		this.minus.bindInteractive(this.minus.image);
		this.add(this.minus);

		this.minusText = createText(scene, 0, -1, 0.3*80, "#000", "–");
		this.minusText.setOrigin(0.5);
		this.minus.add(this.minusText);
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

		let withinDistance = Phaser.Math.Distance.BetweenPoints(this, this.scene.input) < 80;
		let showButtons = withinDistance && !this.hold && this.isInsidePlayingField();
		this.plus.setVisible(showButtons);
		this.minus.setVisible(showButtons);

		let scale = 1 + 0.15 * this.liftSmooth;
		this.circle.image.setScale(scale * this.circle.image.origScale);
	}

	isInsidePlayingField() {
		if (this.goalX > 0.65 * this.scene.W)
			return false;
		if (this.goalX < 80/2)
			return false;
		if (this.goalY > this.scene.H - 80/2)
			return false;
		if (this.goalY < 80/2)
			return false;
		return true;
	}

	getWidth() {
		return this.circle.image.displayWidth * this.circle.scale;
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
			this.scene.updateSize(this, -this.size);
		}

		this.scene.tweens.add({
			targets: this,
			liftSmooth: { from: this.liftSmooth, to: 0 },
			ease: 'Cubic',
			duration: 200
		});
	}

	resetPosition() {
		this.goalX = this.startX;
		this.goalY = this.startY;
		this.stickX = this.startX;
		this.stickY = this.startY;
	}
}
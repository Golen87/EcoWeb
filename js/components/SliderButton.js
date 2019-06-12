class SliderButton extends Phaser.GameObjects.Image {
	constructor(scene, x, y, stepSize, stepMax) {
		super(scene, x, y, 'time_button');

		this.stepSize = stepSize;
		this.stepMax = stepMax;

		this._value = 0;
		this.softValue = 0;

		this.isHeld = false;

		this.setInteractive({ useHandCursor: true, draggable: true })
			.on('pointerout', this.onOut )
			.on('pointerover', this.onOver )
			.on('pointerdown', this.onDown )
			.on('pointerup', this.onUp )
			.on('dragstart', this.onDragStart )
			.on('drag', this.onDrag )
			.on('dragend', this.onDragEnd );
		this.onOut();

		this.soundHover = scene.sound.add('hover_button');
		this.soundHover.setVolume(0.2);
		this.soundPress = scene.sound.add('press_button');
		this.soundPress.setVolume(1.0);
		this.soundRelease = scene.sound.add('release_button');
		this.soundRelease.setVolume(1.0);
	}


	get scale() {
		return 60 / this.height;
	}

	set value(x) {
		this._value = Phaser.Math.Clamp(x, 0, this.stepMax);
		this.x = (this.value - this.stepMax/2) * this.stepSize;
	}

	get value() {
		return this._value;
	}


	onOut() {
		this.setScale(this.scale);
		this.setTint(0xDDDDDD);
	}

	onOver() {
		this.setScale(1.05 * this.scale);
		this.setTint(0xFFFFFF);
	}

	onDown() {
		this.setScale(0.95 * this.scale);
		this.setTint(0xBBBBBB);
	}

	onUp() {
		this.onOver();
	}

	onDragStart(pointer, dragX, dragY) {
		this.isHeld = true;
		this.soundPress.play();
	}

	onDrag(pointer, dragX, dragY) {
		this.value = dragX / this.stepSize + this.stepMax/2;

		let nearest = Math.round(this.value);
		if (Math.abs(this.value - nearest) < 1/6) {
			this.value = nearest;

			if (this.latestNearest != nearest) {
				this.soundHover.play();
			}
			this.latestNearest = nearest;
		}
		else {
			this.latestNearest = null;
		}
	}

	onDragEnd(pointer, dragX, dragY, dropped) {
		this.isHeld = false;
		this.soundRelease.play();
	}


	update(delta) {
		let nearest = Math.round(this.value);
		if (!this.isHeld && this.value != nearest) {
			this.value = nearest;
		}

		if (this.softValue != this.value) {
			let speed = (this.isHeld ? 2.0 : 5.0);
			this.softValue += (this.value - this.softValue) / speed;
		}

		this.x = (this.softValue - this.stepMax/2) * this.stepSize;
	}

}
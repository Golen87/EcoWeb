class SliderButton extends Phaser.GameObjects.Image {
	constructor(scene, x, y) {
		super(scene, x, y, 'slider_button');

		this.stepSize = 80;
		this.stepMax = 4;

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
	}


	get scale() {
		return 1;
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
	}

	onDrag(pointer, dragX, dragY) {
		this.value = dragX / this.stepSize + this.stepMax/2;

		let nearest = Math.round(this.value);
		if (Math.abs(this.value - nearest) < 1/6) {
			this.value = nearest;
		}
	}

	onDragEnd(pointer, dragX, dragY, dropped) {
		this.isHeld = false;
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
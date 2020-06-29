class SliderButton extends Phaser.GameObjects.Image {
	constructor(scene, offsetX, offsetY, size, stepSize, stepMax) {
		super(scene, offsetX, offsetY, 'time_button');
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.size = size;

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
		this.soundHover.setVolume(0.1);
		this.soundDrag = scene.sound.add('ui_dnd_grab');
		this.soundDrag.setVolume(1.0);
		this.soundDrop = scene.sound.add('ui_dnd_drop');
		this.soundDrop.setVolume(1.0);
		this.soundSnap = scene.sound.add('ui_dnd_click');
		this.soundSnap.setVolume(0.6);
	}


	get scale() {
		return this.size / this.height;
	}

	set value(x) {
		this._value = Phaser.Math.Clamp(x, 0, this.stepMax);
		this.x = this.offsetX + (this.value - this.stepMax/2) * this.stepSize;
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
		this.soundHover.play();
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
		this.soundDrag.play();
	}

	onDrag(pointer, dragX, dragY) {
		this.value = (dragX-this.offsetX) / this.stepSize + this.stepMax/2;

		let nearest = Math.round(this.value);
		if (Math.abs(this.value - nearest) < 1/12) {
			this.value = nearest;
		}

		let snap = Math.round(this.value+0.5)-0.5;
		if (snap != this.prevSnap) {
			this.soundSnap.rate = 0.96 + 0.08 * snap;
			this.soundSnap.play();
		}
		this.prevSnap = snap;

	}

	onDragEnd(pointer, dragX, dragY, dropped) {
		this.isHeld = false;
		this.soundDrop.play();
	}


	update(delta) {
		let nearest = Math.round(this.value);
		if (!this.isHeld && this.value != nearest) {
			this.value = nearest;
		}

		if (this.softValue != this.value) {
			let speed = (this.isHeld ? 2 : 5);
			this.softValue += (this.value - this.softValue) / speed;
			if (Math.abs(this.softValue - this.value) < 0.005)
				this.softValue = this.value;
		}

		this.x = this.offsetX + (this.softValue - this.stepMax/2) * this.stepSize;
	}

}
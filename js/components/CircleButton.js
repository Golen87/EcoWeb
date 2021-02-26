class CircleButton extends Button {
	constructor(scene, x, y, size, callback, image='circle') {
		super(scene, x, y);
		// scene.add.existing(this);
		this.callback = callback;

		this.image = scene.add.sprite(0, 0, image);
		this.image.origScale = size / this.image.height;
		this.image.setScale(this.image.origScale);
		// this.image.setScrollFactor(0);
		this.add(this.image);

		// this.bindInteractive(this.image);

		this.onOut();
	}

	onOut() {
		// this.setScale(0.4);
		// this.setTint(0xBBBBBB);
	}

	onOver() {
		// this.setScale(0.42);
		// this.setTint(0xFFFFFF);
	}

	onDown() {
		// this.setScale(0.37);
		// this.setTint(0x888888);
	}

	onUp() {
		this.callback();
		this.onOver();
	}
}
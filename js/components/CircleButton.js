class CircleButton extends Phaser.GameObjects.Image {
	constructor(scene, x, y, callback) {
		super(scene, x, y, "circle");
		this.callback = callback;

		this.setInteractive({ useHandCursor: true })
			.on('pointerout', this.onOut )
			.on('pointerover', this.onOver )
			.on('pointerdown', this.onDown )
			.on('pointerup', this.onUp );

		this.onOut();
	}

	onOut() {
		this.setScale(0.4);
		this.setTint(0xffffff);
	}

	onOver() {
		this.setScale(0.42);
		this.setTint(0xffff00);
	}

	onDown() {
		this.setScale(0.37);
		this.setTint(0xff0000);
	}

	onUp() {
		this.callback();
		this.onOver();
	}
}
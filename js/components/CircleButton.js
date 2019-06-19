class CircleButton extends Phaser.GameObjects.Image {
	constructor(scene, x, y, callback) {
		super(scene, x, y, "circle");
		this.callback = callback;
		scene.add.existing(this);

		this.setInteractive({ useHandCursor: true })
			.on('pointerout', this.onOut.bind(this) )
			.on('pointerover', this.onOver.bind(this) )
			.on('pointerdown', this.onDown.bind(this) )
			.on('pointerup', this.onUp.bind(this) );

		this.onOut();
	}

	onOut() {
		this.setScale(0.4);
		this.setTint(0xBBBBBB);
	}

	onOver() {
		this.setScale(0.42);
		this.setTint(0xFFFFFF);
	}

	onDown() {
		this.setScale(0.37);
		this.setTint(0x888888);
	}

	onUp() {
		this.callback();
		this.onOver();
	}
}
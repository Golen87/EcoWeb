class Button extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		this.hover = false;
		this.hold = false;

		this.soundHover = scene.sound.add('hover_button');
		this.soundHover.setVolume(0.1);
		this.soundPress = scene.sound.add('press_button');
		this.soundPress.setVolume(0.5);
		this.soundRelease = scene.sound.add('release_button');
		this.soundRelease.setVolume(0.5);
	}


	bindInteractive(gameObject) {
		gameObject.setInteractive({ useHandCursor: true })
			.on('pointerout', this.onOut.bind(this))
			.on('pointerover', this.onOver.bind(this))
			.on('pointerdown', this.onDown.bind(this))
			.on('pointerup', this.onUp.bind(this));
		this.onOut();
	}


	onOut() {
		this.hover = false;
		this.hold = false;
	}

	onOver() {
		this.hover = true;
		this.soundHover.play();
	}

	onDown() {
		this.hold = true;
		this.soundRelease.play();
	}

	onUp() {
		if (this.hold) {
			this.soundPress.play();
			this.hold = false;
			this.onClick();
		}
	}
}
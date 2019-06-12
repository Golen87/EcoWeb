class TextButton extends Phaser.GameObjects.Text {
	constructor(scene, x, y, text, style, callback) {
		super(scene, x, y, text, style);
		this.callback = callback;
		scene.add.existing(this);

		this.setInteractive({ useHandCursor: true })
			.on('pointerout', this.onOut.bind(this) )
			.on('pointerover', this.onOver.bind(this) )
			.on('pointerdown', this.onDown.bind(this) )
			.on('pointerup', this.onUp.bind(this) );
		this.onOut();

		this.soundHover = scene.sound.add('hover_button');
		this.soundHover.setVolume(0.2);
		this.soundPress = scene.sound.add('press_button');
		this.soundPress.setVolume(1.0);
		this.soundRelease = scene.sound.add('release_button');
		this.soundRelease.setVolume(1.0);
	}

	onOut() {
		this.setTint(0xBBBBBB);
	}

	onOver() {
		this.setTint(0xFFFFFF);
		this.soundHover.play();
	}

	onDown() {
		this.setTint(0x888888);
		this.soundRelease.play();
	}

	onUp() {
		this.callback();
		this.onOver();
		this.soundPress.play();
	}
}
class CheckBox extends Phaser.GameObjects.Container {
	constructor(scene, x, y, text, state, callback) {
		super(scene, x, y);
		this.state = state;
		this.callback = callback;
		scene.add.existing(this);

		//'checkmark'

		this.background = scene.add.image(0, 0, 'checkbox');
		this.add(this.background);

		this.checkmark = scene.add.image(0, 0, 'checkmark');
		this.checkmark.scale = 0.6;
		this.checkmark.setVisible(state);
		this.add(this.checkmark);

		this.label = scene.add.text(50, 0, text, {
			font: "40px 'Crete Round'"
		});
		this.label.setOrigin(0, 0.5);
		this.add(this.label);

		this.background.setInteractive({ useHandCursor: true })
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

	change(tint, scale) {
		this.background.setTint(tint);
		this.checkmark.setTint(tint);
		this.label.setTint(tint);
		this.background.setScale(scale);
		this.checkmark.setScale(scale * this.checkmark.scale);
	}


	onOut() {
		this.change(0xDDDDDD, 1.0);
	}

	onOver() {
		this.change(0xFFFFFF, 1.0);
		this.soundHover.play();
	}

	onDown() {
		this.change(0xFFFFFF, 0.95);
		this.soundRelease.play();
	}

	onUp() {
		this.state = !this.state;
		this.checkmark.setVisible(this.state);
		this.callback(this.state);
		this.onOver();
		this.soundPress.play();
	}
}
class MenuButton extends Phaser.GameObjects.Container {
	constructor(scene, x, y, text, style, callback) {
		super(scene, x, y);
		this.callback = callback;
		scene.add.existing(this);

		this.background = scene.add.sprite(0, 0, 'menu_bar');
		this.background.setOrigin(0, 0.5);
		//this.background.setScale(60 / this.background.height);
		this.background.setScale(scene.cameras.main.displayHeight / 1500);
		this.add(this.background);

		this.text = scene.add.text(30, 0, text, style);
		this.text.setOrigin(0, 0.5);
		this.add(this.text);

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


	onOut() {
		this.background.setTexture('menu_bar');
		this.text.setTint(0xBBBBBB);
	}

	onOver() {
		this.background.setTexture('menu_bar_hover');
		this.text.setTint(0xFFFFFF);
		this.soundHover.play();
	}

	onDown() {
		this.background.setTexture('menu_bar_hover');
		this.text.setTint(0x888888);
		this.soundRelease.play();
	}

	onUp() {
		this.callback();
		this.onOver();
		this.soundPress.play();
	}
}
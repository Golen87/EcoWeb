class WorldScene extends Phaser.Scene {
	constructor() {
		super({key: 'WorldScene'});
	}

	create() {
		this.cameras.main.fadeEffect.start(false, 200, 0x00, 0x00, 0x00);

		let bg = this.add.image(this.CX, this.CY, 'bg_3');
		this.fitToScreen(bg);

		let title = createText(this, this.CX, 0.07*this.H, 50, "#FFF", "Nivåer");
		title.setOrigin(0.5);

		for (let i in window.database.scenarios) {
			let scenario = database.scenarios[i];
			let x = this.CX - (window.database.scenarios.length > 7) * (230 * (1 - 2*(i > 6)));
			let y = 120 + (i%7) * 75;

			this.button = new PauseButton(this, x, y, scenario.name, () => {
				this.cameras.main.fadeEffect.start(true, 100, 0x00, 0x00, 0x00);
				this.soundSwoosh.play();
				this.addEvent(150, function() {
					web.startScenario(i);
					this.scene.start("LevelScene2");
				});
			});
			this.add.existing(this.button);
		}

		let button = new TextButton(this, this.cameras.main.displayWidth-20, this.cameras.main.displayHeight-20, 'Tillbaka', 30, () => {
			this.cameras.main.fadeEffect.start(true, 100, 0x00, 0x00, 0x00);
			this.soundSwoosh.play();
			this.addEvent(150, function() {
				this.scene.start("TitleScene");
			});
		});
		button.setOrigin(1, 1);
		this.add.existing(button);

		this.soundSwoosh = this.sound.add('ui_menu_swoosh');
		this.soundSwoosh.setVolume(1.0);
	}


	addEvent(delay, callback) {
		return this.time.addEvent({
			delay: delay,
			callback: callback,
			callbackScope: this
		});
	}

	get W() { return this.cameras.main.displayWidth; }
	get H() { return this.cameras.main.displayHeight; }
	get CX() { return this.cameras.main.centerX; }
	get CY() { return this.cameras.main.centerY; }

	fitToScreen(image) {
		image.setScale(Math.max(this.W / image.width, this.H / image.height));
	}
}
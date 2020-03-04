class WorldScene extends Phaser.Scene {
	constructor() {
		super({key: 'WorldScene'});
	}

	create() {
		let bg = this.add.image(this.CX, this.CY, 'bg_3');
		this.fitToScreen(bg);

		let title = this.add.text(this.CX, 0.13*this.H, "Nivåer", {
			font: "30px 'Crete Round'"
		});
		title.setOrigin(0.5);

		for (let i in window.database.scenarios) {
			let scenario = database.scenarios[i];
			let y = 140 + i * 90;

			this.button = new PauseButton(this, this.CX, y, scenario.name, () => {
				web.startScenario(i);
				this.soundSwoosh.play();
				this.scene.start("LevelScene2");
			});
			this.add.existing(this.button);
		}

		let button = new TextButton(this, this.cameras.main.displayWidth-20, this.cameras.main.displayHeight-20, 'Tillbaka', {
			font: "30px 'Crete Round'"
		}, () => {
			this.soundSwoosh.play();
			this.scene.start("TitleScene");
		});
		button.setOrigin(1, 1);
		this.add.existing(button);

		this.soundSwoosh = this.sound.add('ui_menu_swoosh');
		this.soundSwoosh.setVolume(1.0);
	}

	update(time, delta) {
	}


	get W() { return this.cameras.main.displayWidth; }
	get H() { return this.cameras.main.displayHeight; }
	get CX() { return this.cameras.main.centerX; }
	get CY() { return this.cameras.main.centerY; }

	fitToScreen(image) {
		image.setScale(Math.max(this.W / image.width, this.H / image.height));
	}
}
class WorldScene extends Phaser.Scene {
	constructor() {
		super({key: 'WorldScene'});
	}

	create() {
		let bg = this.add.image(this.CX, this.CY, 'bg_2');
		this.fitToScreen(bg);
		this.title = this.add.text(20, 20, "World", { font: "40px 'Crete Round'" });

		for (let i = 0; i < 3; i++) {
			let y = 140 + i * 90;

			this.button = new PauseButton(this, this.CX, y, 'Level ' + (i+1), () => {
				this.scene.start("LevelScene");
			});
			this.add.existing(this.button);
		}

		let button = new TextButton(this, this.cameras.main.displayWidth-20, this.cameras.main.displayHeight-20, 'Tillbaka', {
			font: "30px 'Crete Round'"
		}, () => {
			this.scene.start("TitleScene");
		});
		button.setOrigin(1, 1);
		this.add.existing(button);
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
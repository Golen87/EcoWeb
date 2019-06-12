class WorldScene extends Phaser.Scene {
	constructor() {
		super({key: 'WorldScene'});
	}

	create() {
		let bg = this.add.image(this.CX, this.CY, 'bg_world');
		bg.setScale(this.H / bg.height);
		this.title = this.add.text(20, 20, "World", { font: "40px 'Crete Round'" });

		for (let i = 0; i < 3; i++) {
			let y = 100 + i * 40;
			let button = new TextButton(this, 100, y, 'Level ' + (i+1), {
				font: "30px 'Crete Round'"
			}, () => {
				this.scene.start("LevelScene");
			});
		}

		let button = new TextButton(this, this.cameras.main.displayWidth-20, this.cameras.main.displayHeight-20, 'Back', {
			font: "30px 'Crete Round'"
		}, () => {
			this.scene.start("TitleScene");
		});
		button.setOrigin(1);
	}

	update(delta) {
	}


	get W() { return this.cameras.main.displayWidth; }
	get H() { return this.cameras.main.displayHeight; }
	get CX() { return this.cameras.main.centerX; }
	get CY() { return this.cameras.main.centerY; }
}
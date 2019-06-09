class WorldScene extends Phaser.Scene {
	constructor() {
		super({key: 'WorldScene'});
	}

	preload() {
	}

	create() {
		this.title = this.add.text(0, 0, "World", { font: "40px Courier" });

		for (let i = 0; i < 3; i++) {
			let y = 100 + i * 40;
			let button = new TextButton(this, 100, y, 'Level ' + (i+1), {
				font: "30px Courier", fill: '#0f0'
			}, () => {
				this.scene.start("LevelScene");
			});
			this.add.existing(button);
		}
	}

	update(delta) {
	}
}
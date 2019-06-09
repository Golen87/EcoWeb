class PreloadScene extends Phaser.Scene {
	constructor() {
		super({key: 'PreloadScene'});
	}

	preload() {
	}

	create() {
		this.title = this.add.text(0, 0, "Preload", { font: "40px Courier" });

		this.scene.start("TitleScene");
	}

	update(delta) {
	}
}
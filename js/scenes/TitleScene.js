class TitleScene extends Phaser.Scene {
	constructor() {
		super({key: 'TitleScene'});
	}

	preload() {
	}

	create() {
		//this.cameras.main.setBackgroundColor(0xFFFFFF);

		this.title = this.add.text(0, 0, "EcoWeb", { font: "40px Courier" });

		let startButton = new TextButton(this, 100, 100, 'Start game', {
			font: "30px Courier", fill: '#0f0'
		}, () => {
			this.scene.start("WorldScene");
		});
		this.add.existing(startButton);
	}

	update(delta) {
	}
}
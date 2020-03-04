class TimeController extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);
		scene.add.existing(this);

		this.setDepth(100);
		this.setScrollFactor(0);

		this.bg = scene.add.rectangle(0, 0, 300, 150, 0x222222);
		this.bg.setScrollFactor(0);
		//this.bg.setAlpha(0.5);
		this.add(this.bg);

		this.button = this.scene.add.image(0, -30, 'circle');
		this.button.setScale(60 / this.button.width);
		this.button.setTint(0xffffff);
		this.add(this.button);
		this.playIcon = this.scene.add.triangle(2, -30, 20, 10, 0, 0, 0, 20, 0x222222);
		this.add(this.playIcon);
		this.pauseIcon = this.scene.add.rectangle(0, -30, 20, 20, 0x222222);
		this.add(this.pauseIcon);
		this.button.setInteractive({ useHandCursor: true })
			.on('pointerup', this.onUp, this)
		this.button.setScrollFactor(0);

		this.text = scene.add.text(0, 30, "<time>", {
			font: "24px 'monospace'", fill: '#FFF'
		});
		this.text.setOrigin(0.5, 0.5);
		this.add(this.text);

		this.time = 0;

		this.isPlaying = false;
		this.pauseIcon.setVisible(this.isPlaying);
		this.playIcon.setVisible(!this.isPlaying);
	}

	update(time, delta) {
		if (this.isPlaying) {
			this.time += 5*delta;
			this.onEventChange();
		}
		// if (this.prevValue != this.value) {
		// 	this.emit('onChange');
		// }
		// this.prevValue = this.value;
		let value = Math.round(this.time);
		this.text.setText("Time: " + value.toString());
	}

	onUp() {
		this.isPlaying = !this.isPlaying;
		this.pauseIcon.setVisible(this.isPlaying);
		this.playIcon.setVisible(!this.isPlaying);
	}

	onEventChange() {
		this.emit('onChange');
	}
}
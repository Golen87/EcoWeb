class Slider extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);
		scene.add.existing(this);

		this.stepSize = 120;
		this.stepMax = 4;

		this.background = scene.add.image(0, 0, "time_background");
		this.background.setScale(this.stepSize * (this.stepMax) / this.background.width);
		this.add(this.background);

		for (let i = 0; i <= this.stepMax; i++) {
			let marker = scene.add.image((i - this.stepMax/2) * this.stepSize, 0, "circle");
			marker.setScale(10 / marker.width);
			this.add(marker);
		}

		this.button = new SliderButton(scene, 0, 0, this.stepSize, this.stepMax);
		this.add(this.button);
	}

	update(delta) {
		this.button.update(delta);
	}


	get value() {
		return this.button.softValue / this.stepMax;
	}
}
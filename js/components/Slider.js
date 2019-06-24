class Slider extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		this.stepSize = 60;
		this.stepMax = 8;

		this.timeBar = scene.add.image(0, scene.H, 'time_bar');
		this.timeBar.setScale(0.75*scene.W / this.timeBar.width);
		this.timeBar.setOrigin(0, 1);

		this.slider = scene.add.image(0, 0, "time_background");
		this.slider.setScale(this.stepSize * (this.stepMax) / this.slider.width);
		this.add(this.slider);

		for (let i = 0; i <= this.stepMax; i++) {
			let marker = scene.add.image((i - this.stepMax/2) * this.stepSize, 0, "circle");
			marker.setScale(10 / marker.width);
			this.add(marker);

			if (i % 3 == 0) {
				let event = scene.add.image((i - this.stepMax/2) * this.stepSize, 0, "event_add");
				event.setScale(40 / event.width);
				event.setOrigin(0.5, 1.0);
				this.add(event);
			}
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
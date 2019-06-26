class Slider extends Phaser.GameObjects.Container {
	constructor(scene, x, y, width) {
		super(scene, x, y);
		this.width = width;

		this.background = scene.add.image(x, y, 'time_bar');
		this.background.setScale(this.width / this.background.width);
		this.background.setOrigin(0, 1);

		const SLIDER_WIDTH = 0.85 * this.width;
		const offsetX = 0.5 * (this.background.width-36) * this.background.scaleX;
		const offsetY = -0.5 * (this.background.height-36) * this.background.scaleY;

		this.stepMax = 8;
		this.stepSize = SLIDER_WIDTH / this.stepMax;

		this.slider = scene.add.image(offsetX, offsetY, "time_background");
		this.slider.setScale(1.01 * SLIDER_WIDTH / this.slider.width);
		this.add(this.slider);

		for (let i = 0; i <= this.stepMax; i++) {
			let timeStamp = web.maxTime * i / this.stepMax;

			let marker = scene.add.image(offsetX + (i - this.stepMax/2) * this.stepSize, offsetY, "circle");
			marker.setScale(0.7 * this.slider.height * this.slider.scaleY / marker.width);
			marker.setTint(0xe3e3d1);
			this.add(marker);

			if (i % 3 == 0) {
				let eventButton = new AddEventButton(
					scene,
					offsetX + (i - this.stepMax/2) * this.stepSize,
					offsetY,
					0.2 * this.width,
					timeStamp
				);
				this.add(eventButton);
			}
		}

		const size = 0.1 * this.width;
		this.button = new SliderButton(scene, offsetX, offsetY, size, this.stepSize, this.stepMax);
		this.add(this.button);
	}

	update(delta) {
		this.button.update(delta);
	}


	get value() {
		return this.button.softValue / this.stepMax;
	}
}
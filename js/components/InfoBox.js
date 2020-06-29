class InfoBox extends Phaser.GameObjects.Container {
	constructor(scene, x, y, width) {
		super(scene, x, y);

		this.width = width;
		this.values = [
			"Datum",
			"Temp.",
			"Regn",
			"pH",
		];

		this.background = scene.add.image(0, 0, "info_background");
		this.background.setOrigin(0, 0);
		this.background.setScale(this.width / this.background.width);
		this.add(this.background);

		for (let i = 0; i < this.values.length; i++) {
			const LEFT = 0;
			const OFFSET = 0.25 * this.width;
			const HEIGHT = (this.background.height-36) * this.background.scaleY;
			const TOP = (0.2 + 0.6 * i / (this.values.length - 1)) * HEIGHT;

			this.text = createText(scene, LEFT + 5, TOP, 15, "#FFF", this.values[i]);
			this.text.setOrigin(0.0, 0.5);
			//this.text.setFontSize(16);
			this.add(this.text);

			let scale = scene.add.image(LEFT + OFFSET, TOP, "info_scale");
			scale.setScale(0.65 * this.width / scale.width);
			scale.scaleY *= 0.8;
			scale.setOrigin(0.0, 0.5);
			this.add(scale);

			let marker = scene.add.image(LEFT + OFFSET + (0.75+randReal(-0.25, 0.25))/2 * this.width, TOP, "info_marker");
			marker.setScale(1.4 * scale.height * scale.scaleY / marker.height);
			marker.setOrigin(0.0, 0.5);
			this.add(marker);
		}
	}

	update(delta) {
		this.button.update(delta);
	}


	get value() {
		return this.button.softValue / this.stepMax;
	}
}
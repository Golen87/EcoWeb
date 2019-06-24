class InfoBox extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		const WIDTH = 250;
		this.values = [
			"Datum",
			"Temp.",
			"Regn",
			"pH",
		];

		this.background = scene.add.image(0, 0, "info_background");
		this.background.setOrigin(0, 0);
		this.background.setScale(WIDTH / this.background.width);
		this.add(this.background);

		for (let i = 0; i < this.values.length; i++) {
			const LEFT = 0;
			const OFFSET = 0.25 * WIDTH;
			const TOP = 20 + 30 * i;

			this.text = scene.add.text(LEFT + 5, TOP, this.values[i], { font: "15px 'Crete Round'" });
			this.text.setOrigin(0.0, 0.5);
			this.add(this.text);

			let scale = scene.add.image(LEFT + OFFSET, TOP, "info_scale");
			scale.setScale(0.65 * WIDTH / scale.width);
			scale.setOrigin(0.0, 0.5);
			this.add(scale);

			let marker = scene.add.image(LEFT + OFFSET + 0.65/2 * WIDTH, TOP, "info_marker");
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
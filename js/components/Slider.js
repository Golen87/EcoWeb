class Slider extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);
		scene.add.existing(this);

		this.value = 0;

		this.background = scene.add.image(0, 0, "slider_background");
		this.add(this.background);

		this.button = new SliderButton(scene, 0, 0);
		this.add(this.button);
	}


	update(delta) {
		this.button.update(delta);
	}
}
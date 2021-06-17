class InfoPopup extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);
	}


	update(time, delta) {
	}
}
class Node extends Phaser.GameObjects.Image {
	constructor(scene, x, y, image, callback) {
		super(scene, x, y, image);
		this.callback = callback;
		scene.add.existing(this);

		this.population = 0.5;

		this.setInteractive({ useHandCursor: true })
			.on('pointerout', this.onOut )
			.on('pointerover', this.onOver )
			.on('pointerdown', this.onDown )
			.on('pointerup', this.onUp );

		this.onOut();
	}


	get scale() {
		let x = this.population;
		let smooth = 0.5 + Math.atan(5 * (x - 0.5)) / Math.PI;
		return 0.5 + 1 * smooth;
	}

	setPopulation(pop) {
		this.population = pop;
		this.setScale(this.scale);
	}



	onOut() {
		this.setScale(this.scale);
		this.setTint(0xDDDDDD);
	}

	onOver() {
		this.setScale(1.05 * this.scale);
		this.setTint(0xFFFFFF);
	}

	onDown() {
		this.setScale(0.95 * this.scale);
		this.setTint(0xBBBBBB);
	}

	onUp() {
		this.callback();
		this.onOver();
	}
}
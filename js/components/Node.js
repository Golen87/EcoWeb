class Node extends Phaser.GameObjects.Container {
	constructor(scene, x, y, species) {
		super(scene, x, y);
		scene.add.existing(this);

		this.population = 0.5;
		this.size = 150;

		this.circle = scene.add.image(0, 0, 'circle');
		this.circle.setScale(this.size / this.circle.height);
		this.circle.setTint(0x879959);
		this.add(this.circle);

		this.image = scene.add.image(0, 0, 'icon_' + species);
		this.image.setScale(this.size / this.image.height);
		this.add(this.image);

		let shape = scene.make.graphics({ fillStyle: { color: 0x000000 }, add: false });
		let circle = new Phaser.Geom.Circle(0, 0, this.size*0.4);
		shape.fillCircleShape(circle);
		//let mask = shape.createGeometryMask();
		//this.image.setMask(mask);

		this.image.setInteractive({ useHandCursor: true })
			.on( 'pointerout', this.onOut.bind(this) )
			.on( 'pointerover', this.onOver.bind(this) )
			.on( 'pointerdown', this.onDown.bind(this) )
			.on( 'pointerup', this.onUp.bind(this) );

		this.onOut();
	}


	get scale() {
		let x = this.population;
		let smooth = 0.5 + Math.atan(3 * (x - 0.5)) / Math.PI;
		return 0.5 + 1 * smooth;
	}

	setPopulation(pop) {
		this.population = pop;
		this.setScale(this.scale);
	}


	onOut() {
		this.setScale(1.00 * this.scale);
		this.image.setTint(0xDDDDDD);
	}

	onOver() {
		this.setScale(1.05 * this.scale);
		this.image.setTint(0xFFFFFF);
	}

	onDown() {
		this.setScale(0.95 * this.scale);
		this.image.setTint(0xBBBBBB);
	}

	onUp() {
		this.onOver();
	}
}
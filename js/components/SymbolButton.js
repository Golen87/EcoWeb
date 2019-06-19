class SymbolButton extends Button {
	constructor(scene, x, y, image, callback) {
		super(scene, x, y);
		this.callback = callback;

		this.image = scene.add.sprite(0, 0, 'symbol_button');
		this.image.setScale(100 / this.image.height);
		this.add(this.image);

		this.bindInteractive(this.image);
	}


	onOut() {
		super.onOut();
	}

	onOver() {
		super.onOver();
	}

	onDown() {
		super.onDown();
	}

	onClick() {
		this.callback();
	}
}
class SymbolButton extends Button {
	constructor(scene, x, y, size, callback) {
		super(scene, x, y);
		this.callback = callback;
		this.size = size;

		this.image = scene.add.sprite(0, 0, 'symbol_menu');
		this.image.setScale(this.size / this.image.height);
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
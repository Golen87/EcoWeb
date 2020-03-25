class SymbolButton extends Button {
	constructor(scene, x, y, image, size, callback) {
		super(scene, x, y);
		this.callback = callback;
		this.size = size;

		// 'symbol_menu'
		this.image = scene.add.sprite(0, 0, image);
		this.image.setScale(this.size / this.image.height);
		this.image.setScrollFactor(0);
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
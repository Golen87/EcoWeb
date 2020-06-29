class TextButton extends Button {
	constructor(scene, x, y, text, size, callback) {
		super(scene, x, y);
		this.callback = callback;

		this.text = createText(scene, 0, 0, size, "#FFF", text);
		this.add(this.text);

		this.bindInteractive(this.text);
	}


	setOrigin(x, y) {
		this.text.setOrigin(x, y);
	}


	onOut() {
		super.onOut();
		this.text.setTint(0xBBBBBB);
	}

	onOver() {
		super.onOver();
		this.text.setTint(0xFFFFFF);
	}

	onDown() {
		super.onDown();
		this.text.setTint(0x888888);
	}

	onClick() {
		this.text.setTint(0xFFFFFF);
		this.callback();
	}
}
class PauseButton extends Button {
	constructor(scene, x, y, text, callback) {
		super(scene, x, y);
		this.callback = callback;
		this.active = true;

		const HEIGHT = 60;

		this.highlight = scene.add.sprite(0, 0, 'pause_button_hover');
		this.add(this.highlight);

		this.button = scene.add.sprite(0, 0, 'pause_button');
		this.button.setScrollFactor(0);
		this.add(this.button);

		this.button.setScale(HEIGHT / this.button.height);
		this.highlight.setScale(HEIGHT / this.button.height);

		this.text = createText(scene, 0, 0, 30, "#FFF", text);
		this.text.setOrigin(0.5, 0.5);
		this.add(this.text);

		this.bindInteractive(this.button);
	}


	setActive(value) {
		this.active = value;
		this.setAlpha(value ? 1.0 : 0.4);
	}

	onOut() {
		super.onOut();
		this.highlight.setVisible(false);
		this.text.setTint(0xDDDDDD);
	}

	onOver() {
		if (this.active && this.callback) {
			super.onOver();
			this.highlight.setVisible(true);
			this.text.setTint(0xFFFFFF);
		}
	}

	onDown() {
		if (this.active && this.callback) {
			super.onDown();
			this.text.setTint(0x888888);
		}
	}

	onClick() {
		this.text.setTint(0xFFFFFF);
		if (this.active && this.callback) {
			this.callback();
		}
	}
}
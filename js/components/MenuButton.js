class MenuButton extends Button {
	constructor(scene, x, y, text, callback) {
		super(scene, x, y);
		this.callback = callback;

		const HEIGHT = 61;

		this.highlight = scene.add.sprite(0, 0, 'menu_bar_hover');
		this.highlight.setOrigin(0, 0.5);
		this.add(this.highlight);

		this.background = scene.add.sprite(0, 0, 'menu_bar');
		this.background.setOrigin(0, 0.5);
		this.add(this.background);

		this.background.setScale(HEIGHT / this.background.height);
		this.highlight.setScale(HEIGHT / this.background.height);

		this.text = createText(scene, 30, 0, 30, "#FFF", text);
		this.text.setOrigin(0, 0.5);
		this.add(this.text);

		this.bindInteractive(this.background);
	}


	onOut() {
		super.onOut();
		this.highlight.setVisible(false);
		this.text.setTint(0xBBBBBB);
	}

	onOver() {
		super.onOver();
		this.highlight.setVisible(true);
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
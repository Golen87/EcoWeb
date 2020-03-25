class PauseButton extends Button {
	constructor(scene, x, y, text, callback) {
		super(scene, x, y);
		this.callback = callback;

		const HEIGHT = 60;

		this.highlight = scene.add.sprite(0, 0, 'pause_button_hover');
		this.add(this.highlight);

		this.button = scene.add.sprite(0, 0, 'pause_button');
		this.button.setScrollFactor(0);
		this.add(this.button);

		this.button.setScale(HEIGHT / this.button.height);
		this.highlight.setScale(HEIGHT / this.button.height);

		this.text = scene.add.text(0, 0, text, {
			font: "30px 'Crete Round'", fill: '#FFF'
		});
		this.text.setOrigin(0.5, 0.5);
		this.add(this.text);

		this.bindInteractive(this.button);
	}


	onOut() {
		super.onOut();
		this.highlight.setVisible(false);
		this.text.setTint(0xDDDDDD);
	}

	onOver() {
		super.onOver();
		this.highlight.setVisible(true);
		this.text.setTint(0xFFFFFF);
	}

	onDown() {
		super.onDown();
		this.text.setTint(0xAAAAAA);
	}

	onClick() {
		this.text.setTint(0xFFFFFF);
		this.callback();
	}
}
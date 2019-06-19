class CheckBox extends Button {
	constructor(scene, x, y, text, state, callback) {
		super(scene, x, y);
		this.state = state;
		this.callback = callback;

		this.background = scene.add.image(0, 0, 'checkbox');
		this.add(this.background);

		this.checkmark = scene.add.image(0, 0, 'checkmark');
		this.checkmark.scale = 0.6;
		this.checkmark.setVisible(state);
		this.add(this.checkmark);

		this.label = scene.add.text(50, 0, text, {
			font: "40px 'Crete Round'"
		});
		this.label.setOrigin(0, 0.5);
		this.add(this.label);

		this.bindInteractive(this.background);
	}

	change(tint, scale) {
		this.background.setTint(tint);
		this.checkmark.setTint(tint);
		this.label.setTint(tint);
		this.background.setScale(scale);
		this.checkmark.setScale(scale * this.checkmark.scale);
		this.checkmark.setVisible(this.state);
	}


	onOut() {
		super.onOut();
		this.change(0xDDDDDD, 1.0);
	}

	onOver() {
		super.onOver();
		this.change(0xFFFFFF, 1.0);
	}

	onDown() {
		super.onDown();
		this.change(0xFFFFFF, 0.95);
	}

	onClick() {
		this.state = !this.state;
		this.change(0xFFFFFF, 1.0);
		this.callback(this.state);
	}
}
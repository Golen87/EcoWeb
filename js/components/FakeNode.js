class FakeNode extends Button {
	constructor(scene, x, y, name) {
		super(scene, x, y);
		this.scene = scene;
		this.name = name;
		scene.add.existing(this);

		this.neighbours = [];
		this.replacements = [];

		this.graphics = scene.add.graphics({x: 0, y: 0});
		this.graphics.lineStyle(2.0, 0xffffff, 1.0);
		let count = 12;
		for (var i = 0; i < count; i++) {
			let angle = 360 * i/count;
			this.graphics.beginPath();
			this.graphics.arc(0, 0, NODE_SIZE/2-2/2, Phaser.Math.DegToRad(angle), Phaser.Math.DegToRad(angle+360/count/2), false, 0.01);
			// this.graphics.closePath();
			this.graphics.strokePath();
		}
		this.add(this.graphics);

		this.text = createText(scene, 0, 0, 20, "#FFF", name);
		this.text.setOrigin(0.5);
		// Can lead to size issues...
		language.bind(this.text, name);
		this.text.setScale(Math.min(0.75 * NODE_SIZE / this.text.width, 1));
		this.add(this.text);
	}

	update(time, delta) {
		let anyInside = this.replacements.some(node => node.isInsidePlayingField() || !node.stick);
		let anyActive = this.replacements.some(node => node.inPlay);

		// 0.0 if any node is active
		// 0.5 if any node is held, not yet active
		// 1.0 if idle
		this.setAlpha(
			(anyActive) ?
				0.0 :
				(!anyActive && anyInside) ?
					0.5+0.25*Math.sin(0.008*time) :
					1.0
		);
		this.setScale(
			(!anyActive && anyInside) ?
				1.0+0.03*Math.sin(0.008*time) :
				1.0
		);
	}

	addReplacement(node) {
		this.replacements.push(node);
	}

	isInsidePlayingField() {
		return this.visible && this.replacements.every(node => node.stick && !node.isInsidePlayingField());
	}

	getWidth() {
		return NODE_SIZE;
	}
}
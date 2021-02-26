class BriefingWindow extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);

		this.width = width;
		this.height = height;

		this.setDepth(100);
		this.setScrollFactor(0);

		// this.bg = scene.add.rectangle(0, 0, this.width, this.height, 0x666666);
		// this.bg2 = scene.add.rectangle(0, 0, this.width-5, this.height-5, 0x222222);
		// this.add(this.bg);
		// this.add(this.bg2);


		/* Faded background */

		this.graphics = scene.add.graphics();
		this.add(this.graphics);
		let rect = new Phaser.Geom.Rectangle(-scene.CX, -1.1*scene.CY, 2*scene.CX, 1.1*2*scene.CY);
		this.graphics.fillStyle(0x000000, 0.6);
		this.graphics.fillRectShape(rect);
		this.graphics.setInteractive({ hitArea: rect, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true })
			.on('pointerdown', this.onOutsideDown.bind(this))
			.on('dragstart', this.onOutsideDown.bind(this))
			.on('drag', this.onOutsideDown.bind(this))
			.on('pointerup', this.onOutsideDown.bind(this));
		this.graphics.setScrollFactor(0);

		this.bg3 = scene.add.image(0, 0, 'frame_briefing');
		this.bg3.setScale(this.width / this.bg3.width);
		this.add(this.bg3);


		/* Image */

		const SIZE = 100;
		const SEP = 15;
		const LAYER_1 = 1.00 - 0 * 0.05;
		const LAYER_2 = 1.00 - 0 * 0.05;
		const LAYER_3 = 1.00 - 2 * 0.05;
		const LAYER_4 = 1.00 - 1.8 * 0.05;
		const IMAGE_X = -width/2 + 0.5*SIZE + SEP;
		const IMAGE_Y = -height/2 + 0.5*SIZE + SEP;


		/* Text */

		let textX = IMAGE_X + SIZE/2 + SEP;
		let textY = IMAGE_Y - SIZE/2 + 2*SEP;

		this.titleText = createText(scene, 0, textY, 45, "#000");
		this.titleText.setOrigin(0.5, 0);
		this.add(this.titleText);

		textY += 1.5 * 45;
		this.descText = createText(scene, textX, textY, 30, "#000");
		this.descText.setOrigin(0);
		this.descText.setWordWrapWidth(-2*textX);
		this.add(this.descText);


		this.ok = scene.add.image(8, this.height*0.465, 'frame_ok');
		this.ok.setScale(0.83);
		this.add(this.ok);


		/* Event buttons */

		this.buttons = [];


		this.setActive(false);
		this.setVisible(false);
	}

	setText(title, desc) {
		this.titleText.setText(title);
		this.descText.setText(desc);
	}

	show(title, desc, options) {
		this.setText(title, desc);
		this.setActive(true);
		this.setVisible(true);

		this.setButtons(options);

		this.alpha = 0;
		this.y += 10;
		let tween = this.scene.tweens.add({
			targets: this,
			alpha: { from: 0, to: 1 },
			y: '-=10',
			ease: 'Cubic',
			duration: 300,
		});
	}

	hide() {
		if (this.active) {
			this.alpha = 1;
			let tween = this.scene.tweens.add({
				targets: this,
				alpha: { from: 1, to: 0 },
				y: '+=10',
				ease: 'Cubic',
				duration: 300,
			});

			this.scene.addEvent(400, () => {
				this.y -= 10;
				this.setActive(false);
				this.setVisible(false);
			});
		}
	}

	setButtons(options) {
		for (const button of this.buttons) {
			button.destroy();
		}
		this.buttons = [];

		for (let i = 0; i < options.length; i++) {
			const SEP = 0.45 * this.width;
			const LEFT = (0.5 + i - options.length/2) * SEP;
			const TOP = (0.39+0.055) * this.height;
			const TEXT = options[i][0];
			const FUNC = options[i][1];

			this.buttons[i] = new PauseButton(this.scene, LEFT, TOP, TEXT, FUNC);
			this.buttons[i].setScale(1.0);
			this.buttons[i].setScrollFactor(0);
			this.buttons[i].setAlpha(0.01);
			this.add(this.buttons[i]);
		}
	}

	onOutsideDown(event) {
		event.event.preventDefault();
		//this.hold = true;
	}

	onOutsideUp() {
		//if (this.hold) {
		//	this.hold = false;
		//	this.hide();
		//}
	}
}
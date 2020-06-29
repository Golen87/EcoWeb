class RewardWindow extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);
		this.scene = scene;

		this.width = width;
		this.height = height;

		this.setDepth(100);
		this.setScrollFactor(0);

		/* Faded background */

		this.graphics = scene.add.graphics();
		this.add(this.graphics);
		let rect = new Phaser.Geom.Rectangle(-scene.CX, -1.1*scene.CY, 2*scene.CX, 1.1*2*scene.CY);
		this.graphics.fillStyle(0x000000, 0.65);
		this.graphics.fillRectShape(rect);
		this.graphics.setInteractive({ hitArea: rect, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true })
			.on('pointerdown', this.onOutsideDown.bind(this))
			.on('dragstart', this.onOutsideDown.bind(this))
			.on('drag', this.onOutsideDown.bind(this))
			.on('pointerup', this.onOutsideDown.bind(this));
		this.graphics.setScrollFactor(0);


		/* Background */

		const BOX_HEIGHT = 1 * height;
		this.bg = scene.add.rectangle(0, height/2 - BOX_HEIGHT/2, this.width, BOX_HEIGHT, 0x666666);
		this.bg2 = scene.add.rectangle(0, height/2 - BOX_HEIGHT/2, this.width-5, BOX_HEIGHT-5, 0x222222);
		this.add(this.bg);
		this.add(this.bg2);


		/* Image */

		const SIZE = 0.5 * height;
		const SEP = 0.025 * height;
		const IMAGE_Y = -height/2 + 0.5*SIZE + SEP;

		const shape = "circle_hq";
		this.circle = scene.add.image(0, IMAGE_Y, shape);
		this.circle.setDisplaySize(SIZE, SIZE);
		this.add(this.circle);

		this.image = scene.add.image(0, IMAGE_Y, 'missing_hq');
		this.image.setDisplaySize(SIZE, SIZE);
		this.add(this.image);

		this.tintImage = scene.add.image(0, IMAGE_Y, 'missing_hq');
		this.tintImage.setDisplaySize(SIZE, SIZE);
		this.tintImage.setTint(0xffffff);
		this.tintImage.tintFill = true;
		this.tintImage.setAlpha(0);
		this.add(this.tintImage);


		/* Text */

		let textX = -width/2 + 0.1*width;
		let textY = 0.02 * height;

		this.titleText = createText(scene, textX, textY, 45);
		this.titleText.setOrigin(0);
		this.add(this.titleText);

		textY += 1.4 * 45;
		this.descText = createText(scene, textX, textY, 25);
		this.descText.setOrigin(0);
		this.descText.setWordWrapWidth(-2*textX);
		this.add(this.descText);


		/* Event buttons */

		this.buttons = [];


		this.setActive(false);
		this.setVisible(false);
	}

	setText(title, desc) {
		this.titleText.setText(title);
		this.descText.setText(desc);
	}

	setImage(image) {
		const size = this.image.displayWidth;
		this.image.setTexture(image);
		this.image.setDisplaySize(size, size);
		this.tintImage.setTexture(image);
		this.tintImage.setDisplaySize(size, size);
	}

	show(species, options) {
		const title = species.name;
		const desc = species.description || "Du har upptäckt en ny art!";
		this.setText(title, desc);
		this.setImage(species.image+"_hq");
		this.setActive(true);
		this.setVisible(true);

		const shape = isAbiotic(species.type) ? "diamond" : "circle_hq";
		this.circle.setTexture(shape);
		this.circle.setDisplaySize(this.circle.displayWidth, this.circle.displayWidth);

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
			const TOP = 0.43 * this.height;
			const TEXT = options[i][0];
			const FUNC = options[i][1];

			this.buttons[i] = new PauseButton(this.scene, LEFT, TOP, TEXT, FUNC);
			this.buttons[i].setScale(0.7);
			this.buttons[i].setScrollFactor(0);
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
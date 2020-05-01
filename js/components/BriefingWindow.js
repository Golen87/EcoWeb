class BriefingWindow extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);

		this.width = width;
		this.height = height;

		this.setDepth(100);
		this.setScrollFactor(0);

		this.bg = scene.add.rectangle(0, 0, this.width, this.height, 0x666666);
		this.bg2 = scene.add.rectangle(0, 0, this.width-5, this.height-5, 0x222222);
		this.add(this.bg);
		this.add(this.bg2);


		/* Faded background */

		this.graphics = scene.add.graphics();
		this.add(this.graphics);
		let rect = new Phaser.Geom.Rectangle(-scene.CX, -scene.CY, 2*scene.CX, 2*scene.CY);
		this.graphics.fillStyle(0x000000, 0.6);
		this.graphics.fillRectShape(rect);
		this.graphics.setInteractive({ hitArea: rect, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true })
			.on('pointerdown', this.onOutsideDown.bind(this))
			.on('dragstart', this.onOutsideDown.bind(this))
			.on('drag', this.onOutsideDown.bind(this))
			.on('pointerup', this.onOutsideDown.bind(this));
		this.graphics.setScrollFactor(0);


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
		let textY = IMAGE_Y - SIZE/2 + SEP;

		this.titleText = scene.add.text(textX, textY, 'Title', {
			font: "45px 'Crete Round'", fill: '#FFF'
		});
		this.titleText.setOrigin(0);
		this.add(this.titleText);

		textY += 1.5 * 45;
		this.descText = scene.add.text(textX, textY, 'Description', {
			font: "30px 'Crete Round'", fill: '#FFF'
		});
		this.descText.setOrigin(0);
		this.descText.setWordWrapWidth(-2*textX);
		this.add(this.descText);


		/* Event buttons */

		const y = 0.39 * this.height;
		this.eventButton = new PauseButton(scene, 0, y, "OK", () => {
			this.hide();
		});
		this.eventButton.setScale(0.75);
		this.eventButton.setScrollFactor(0);
		this.add(this.eventButton);
	}

	setText(title, desc) {
		this.titleText.setText(title);
		this.descText.setText(desc);
	}

	show() {
		this.setActive(true);
		this.setVisible(true);
	}

	hide() {
		this.setActive(false);
		this.setVisible(false);
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
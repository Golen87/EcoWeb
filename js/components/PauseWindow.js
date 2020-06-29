class PauseWindow extends Phaser.GameObjects.Container {
	constructor(scene, x, y, options) {
		super(scene, x, y);

		const HEIGHT = 420;
		const SEP = 90;

		this.graphics = scene.add.graphics();
		this.add(this.graphics);
		let rect = new Phaser.Geom.Rectangle(-scene.CX, -1.1*scene.CY, 2*scene.CX, 1.1*2*scene.CY);
		this.graphics.fillStyle(0x000000, 0.6);
		this.graphics.fillRectShape(rect);
		this.graphics.setInteractive({ hitArea: rect, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true })
			.on('pointerdown', this.onOutsideDown.bind(this))
			.on('pointerup', this.onOutsideUp.bind(this));
		this.graphics.setScrollFactor(0);

		this.background = scene.add.sprite(0, 0, 'pause_window');
		this.background.setScale(HEIGHT / this.background.height);
		this.background.setInteractive();
		this.add(this.background);

		this.text = createText(scene, 0, (-options.length/2) * SEP, 40, "#FFF", "Paus");
		this.text.setOrigin(0.5, 0.5);
		this.add(this.text);

		this.buttons = [];
		for (let i = 0; i < options.length; i++) {
			const TOP = (1 + i - options.length/2) * SEP;
			const TEXT = options[i][0];
			const FUNC = options[i][1];

			this.buttons[i] = new PauseButton(scene, 0, TOP, TEXT, FUNC);
			this.add(this.buttons[i]);
		}

		//x =  this.background.scaleX * 0.44 * this.background.width;
		//y = -this.background.scaleY * 0.44 * this.background.height;
		//this.close = new SymbolButton(scene, x, y, null, ()=>{console.log("click");});
		//this.close.setScale(250 / this.close.image.height);
		//this.add(this.close);

		this.setActive(false);
		this.setVisible(false);
	}

	show() {
		this.setActive(true);
		this.setVisible(true);

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

	onOutsideDown() {
		this.hold = true;
	}

	onOutsideUp() {
		if (this.hold) {
			this.hold = false;
			this.hide();
		}
	}
}
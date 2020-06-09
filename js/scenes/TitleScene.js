class TitleScene extends Phaser.Scene {
	constructor() {
		super({key: 'TitleScene'});

		this.options = [
			["Nytt Spel", function() {
				this.cameras.main.fadeEffect.start(true, 100, 0x00, 0x00, 0x00);
				this.soundSwoosh.play();
				this.addEvent(150, function() {
					this.scene.start("WorldScene");
				});
			}],
			["Fortsätt", function() {
				this.cameras.main.fadeEffect.start(true, 100, 0x00, 0x00, 0x00);
				this.soundSwoosh.play();
				this.addEvent(150, function() {
					this.scene.start("WorldScene");
				});
			}],
			["Inställningar", function() {
				console.log("Inställningar");
			}],
		];
	}

	create() {
		this.cameras.main.fadeEffect.start(false, 200, 0x00, 0x00, 0x00);

		let bg = this.add.image(this.CX, this.CY, 'bg_1');
		this.fitToScreen(bg);

		const LEFT = this.W / 8;

		let title = createText(this, LEFT+30, 0.18*this.H, 120, "#FFF", "EcoWeb");
		title.setOrigin(0, 0.5);

		for (let i = 0; i < this.options.length; i++) {
			const SEP = 90;
			const TOP = 0.4*this.H + i*SEP;
			const TEXT = this.options[i][0];
			const FUNC = this.options[i][1].bind(this);
			//const LEFT_OFFSET = 30;

			let menuButton = new MenuButton(this, LEFT, TOP, TEXT, FUNC);
			this.add.existing(menuButton);
		}

		let line = this.add.image(LEFT, 0, 'menu_line');
		line.setScale(this.H / line.height);
		line.setOrigin(1, 0);

		//let box = new CheckBox(this, LEFT+450, 300+70*0, "test 1", false, (state) => {console.log(state);});
		//this.add.existing(box);
		//box = new CheckBox(this, LEFT+450, 300+70*1, "test 2", false, (state) => {console.log(state);});
		//this.add.existing(box);
		//box = new CheckBox(this, LEFT+450, 300+70*2, "test 3", false, (state) => {console.log(state);});
		//this.add.existing(box);

		this.soundSwoosh = this.sound.add('ui_menu_swoosh');
		this.soundSwoosh.setVolume(1.0);
		this.soundAmbience = this.sound.add('ambience_main_menu');
		this.soundAmbience.setVolume(0.1);
		//this.soundAmbience.play();
	}


	addEvent(delay, callback) {
		return this.time.addEvent({
			delay: delay,
			callback: callback,
			callbackScope: this
		});
	}

	get W() { return this.cameras.main.displayWidth; }
	get H() { return this.cameras.main.displayHeight; }
	get CX() { return this.cameras.main.centerX; }
	get CY() { return this.cameras.main.centerY; }

	fitToScreen(image) {
		image.setScale(Math.max(this.W / image.width, this.H / image.height));
	}
}
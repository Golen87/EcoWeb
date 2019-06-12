class TitleScene extends Phaser.Scene {
	constructor() {
		super({key: 'TitleScene'});

		this.options = [
			["Nytt Spel", function() {
				this.scene.start("WorldScene");
			}],
			["Fortsätt", function() {
				this.scene.start("WorldScene");
			}],
			["Inställningar", function() {
				console.log("Inställningar");
			}],
		];
	}

	create() {
		let bg = this.add.image(this.CX, this.CY, 'bg_title');
		bg.setScale(this.H / bg.height);

		const LEFT = 100;

		let title = this.add.text(LEFT+30, 0.13*this.H, "EcoWeb", {
			font: "60px 'Crete Round'"
		});
		title.setOrigin(0, 0.5);

		for (let i = 0; i < this.options.length; i++) {
			const SEP = 90;
			const TOP = 0.3*this.H + i*SEP;
			const TEXT = this.options[i][0];
			const FUNC = this.options[i][1].bind(this);
			//const LEFT_OFFSET = 30;

			let menuButton = new MenuButton(this, LEFT, TOP, TEXT, {
				font: "30px 'Crete Round'", fill: '#FFF'
			}, FUNC);
		}

		let line = this.add.image(LEFT, 0, 'menu_line');
		line.setScale(this.H / line.height);
		line.setOrigin(1, 0);

		new CheckBox(this, 550, 300+70*0, "test 1", false, (state) => {console.log(state);});
		new CheckBox(this, 550, 300+70*1, "test 2", false, (state) => {console.log(state);});
		new CheckBox(this, 550, 300+70*2, "test 3", false, (state) => {console.log(state);});
	}

	update(delta) {
	}


	get W() { return this.cameras.main.displayWidth; }
	get H() { return this.cameras.main.displayHeight; }
	get CX() { return this.cameras.main.centerX; }
	get CY() { return this.cameras.main.centerY; }
}
class EventWindow extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		let options = [
			["Plantera träd", function() {
				console.log("haha");
			}],
			["Skjut rävar", function() {
				console.log("haha");
			}],
			["Inför lodjur", function() {
				console.log("haha");
			}],
		];

		const HEIGHT = 420;
		const SEP = 90;

		this.graphics = scene.add.graphics();
		this.add(this.graphics);
		let rect = new Phaser.Geom.Rectangle(-scene.CX, -scene.CY, 2*scene.CX, 2*scene.CY);
		this.graphics.fillStyle(0x000000, 0.6);
		this.graphics.fillRectShape(rect);
		this.graphics.setInteractive({ hitArea: rect, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true })
			.on('pointerdown', this.onOutsideDown.bind(this))
			.on('pointerup', this.onOutsideUp.bind(this));

		this.background = scene.add.sprite(0, 0, 'pause_window');
		this.background.setScale(HEIGHT / this.background.height);
		this.background.setInteractive();
		this.add(this.background);

		this.text = scene.add.text(0, (-options.length/2) * SEP, "Välj Handling", {
			font: "40px 'Crete Round'", fill: '#FFF'
		});
		this.text.setOrigin(0.5, 0.5);
		this.add(this.text);

		this.buttons = [];
		let events = web.events;
		for (let i = 0; i < events.length; i++) {
			const TOP = (1 + i - events.length/2) * SEP;
			const TEXT = events[i].name;
			const FUNC = () => {
				this.selectedMarker.setEvent(events[i]);
				this.hide();
			};

			this.buttons[i] = new PauseButton(scene, 0, TOP, TEXT, FUNC);
			this.add(this.buttons[i]);
		}

		//x =  this.background.scaleX * 0.44 * this.background.width;
		//y = -this.background.scaleY * 0.44 * this.background.height;
		//this.close = new SymbolButton(scene, x, y, null, ()=>{console.log("click");});
		//this.close.setScale(250 / this.close.image.height);
		//this.add(this.close);
	}

	show(caller) {
		this.selectedMarker = caller;
		this.setActive(true);
		this.setVisible(true);
	}

	hide() {
		this.setActive(false);
		this.setVisible(false);
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
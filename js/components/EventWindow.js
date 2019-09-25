class EventWindow extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		this.selectedMarker = null;
		this.selectedEvent = null;

		const HEIGHT = 550;


		this.graphics = scene.add.graphics();
		this.add(this.graphics);
		let rect = new Phaser.Geom.Rectangle(-scene.CX, -scene.CY, 2*scene.CX, 2*scene.CY);
		this.graphics.fillStyle(0x000000, 0.6);
		this.graphics.fillRectShape(rect);
		this.graphics.setInteractive({ hitArea: rect, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true })
			.on('pointerdown', this.onOutsideDown.bind(this))
			.on('pointerup', this.onOutsideUp.bind(this));

		this.background = scene.add.sprite(0, 0, 'event_background');
		this.background.setScale(HEIGHT / this.background.height);
		this.background.setInteractive();
		this.add(this.background);

		let categories = ['event_type_plant', 'event_type_animal', 'event_type_build', 'event_type_chemistry'];
		this.tabs = [];
		for (let i = 0; i < categories.length; i++) {
			//-1830/4000
			const SEP = 150;
			const LEFT = -2000/4000 * this.background.width * this.background.scaleX + (i+1) * SEP;
			const TOP = -1330/3000 * this.background.height * this.background.scaleY;

			this.tabs[i] = new SymbolButton(scene, LEFT-SEP/2, TOP, categories[i], 90, ()=>{console.log("click");});
			this.tabs[i].setScale(0.5);
			this.tabs[i].setAlpha(0.2);
			this.add(this.tabs[i]);

			let divider = scene.add.sprite(LEFT, TOP, 'event_divider_top');
			divider.setScale(325*this.background.scaleY / divider.height);
			this.add(divider);
			//'event_divider'
		}

		const FUNC = (button) => {
			for (let i = 0; i < this.buttons.length; i++) {
				this.buttons[i].setSelected(false);

				if (this.buttons[i] == button) {
					this.buttons[i].setSelected(true);
					this.selectEvent(i);
				}
			}
		};

		this.buttons = [];
		this.events = web.events;
		for (let i = 0; i < this.events.length; i++) {
			const SEP = 50;
			const LEFT = -1330/4000 * this.background.width * this.background.scaleX;
			//const TOP = (1 + i - this.events.length/2) * SEP;
			//const TOP = -1330/3000 * this.background.height * this.background.scaleY;
			const TOP = -980/3000 * this.background.height * this.background.scaleY + i * SEP;
			const TEXT = this.events[i].name;

			this.buttons[i] = new EventWindowButton(scene, LEFT, TOP, TEXT, FUNC);
			this.buttons[i].setScale(0.5);
			this.add(this.buttons[i]);
		}

		this.title = scene.add.text(this.toX(1341+100), this.toY(347+100), "<name>", {
			font: "40px 'Crete Round'", fill: '#FFF'
		});
		this.title.setOrigin(0, 0);
		this.add(this.title);

		this.desc = scene.add.text(this.toX(1341+100), this.toY(347+100)+60, "<description>", {
			font: "20px 'Crete Round'", fill: '#FFF', wordWrap: { width: 2400 * this.background.scaleX }
		});
		this.desc.setOrigin(0, 0);
		this.desc.setAlpha(0.6);
		this.add(this.desc);

		this.apply = new PauseButton(scene, this.toX(2668), this.toY(2745), "Aktivera", ()=>{
			if (this.selectedMarker && this.selectedEvent) {
				this.selectedMarker.setEvent(this.selectedEvent);
			}
			else {
				console.warn("Selected marker or event missing.");
			}
			this.hide();
		});
		this.apply.setScale(0.5);
		this.add(this.apply);

		this.selectEvent(0);
	}

	toX(x) {
		return (x - 0.5 * this.background.width) * this.background.scaleX;
	}

	toY(y) {
		return (y - 0.5 * this.background.height) * this.background.scaleY;
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

	selectEvent(index) {
		this.selectedEvent = this.events[index];
		this.buttons[index].setSelected(true);
		this.title.setText(this.selectedEvent.name);
		this.desc.setText(this.selectedEvent.desc);
	}
}
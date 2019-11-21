class AddEventButton extends Button {
	constructor(scene, x, y, height, timeStamp) {
		super(scene, x, y);
		this.timeStamp = timeStamp;

		this.image = scene.add.image(0, 0, "event_add");
		this.image.setScale(height / this.image.height);
		this.image.setOrigin(0.5, 1.0);
		this.add(this.image);

		const OFFSET = 0.43 * this.image.height * this.image.scaleY;
		this.symbol = scene.add.image(0, -OFFSET, "symbol_plus");
		this.symbol.setScale(0.68 * this.image.width * this.image.scaleX / this.symbol.width);
		this.add(this.symbol);

		this.event = null;
		this.setEvent(null);

		this.bindInteractive(this.image);
		this.onClick = function() {
			if (this.event == null) {
				scene.eventWindow.show(this);
			}
			else {
				this.setEvent(null);
			}
		};
	}


	onOut() {
		super.onOut();
		this.image.setTint(0xBBBBBB);
	}

	onOver() {
		super.onOver();
		this.image.setTint(0xFFFFFF);
	}

	onDown() {
		super.onDown();
		this.image.setTint(0x888888);
	}

	onClick() {
		this.image.setTint(0xFFFFFF);
		this.onClick();
	}


	setEvent(event) {
		this.event = event;

		if (this.event == null) {
			this.symbol.setTexture("symbol_plus");
			this.symbol.setTint(0xFFFFFF);
			this.setScale(0.75);
		}
		else {
			this.symbol.setTexture(event.icon);
			//this.symbol.setTint(0);
			this.setScale(1.0);
		}

		web.setEvent(this.timeStamp, this.event);
		this.emit('onEventChange');
	}
}
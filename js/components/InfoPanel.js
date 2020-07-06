class InfoPanel extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.width = width;
		this.height = height;

		this.species = null;
		this.lockTime = 0;

		this.setDepth(100);
		this.setScrollFactor(0);

		this.bg = scene.add.rectangle(0, 0, this.width, this.height, 0x666666);
		this.bg2 = scene.add.rectangle(0, 0, this.width-5, this.height-5, 0x222222);
		this.add(this.bg);
		this.add(this.bg2);


		/* Image */

		const SIZE = 100;
		const SEP = 15;
		const LAYER_1 = 1.00 - 0 * 0.05;
		const LAYER_2 = 1.00 - 0 * 0.05;
		const LAYER_3 = 1.00 - 2 * 0.05;
		const LAYER_4 = 1.00 - 1.8 * 0.05;
		const IMAGE_X = -width/2 + 0.5*SIZE + SEP;
		const IMAGE_Y = -height/2 + 0.5*SIZE + SEP;

		this.circle = scene.add.image(IMAGE_X, IMAGE_Y, 'circle');
		this.circle.setScale((LAYER_1 * SIZE) / this.circle.height);
		this.circle.setTint(0x777777);
		this.add(this.circle);

		this.innerCircle = scene.add.image(IMAGE_X, IMAGE_Y, 'circle');
		this.innerCircle.setScale((LAYER_3 * SIZE) / this.innerCircle.height);
		this.innerCircle.setTint(0xFFFFFF);
		this.add(this.innerCircle);

		this.image = scene.add.image(IMAGE_X, IMAGE_Y, 'missing');
		this.image.setScale(LAYER_4 * SIZE / Math.max(this.image.width, this.image.height));
		this.add(this.image);


		/* Text */

		let textX = IMAGE_X + SIZE/2 + SEP;
		let textY = IMAGE_Y - SIZE/2;

		this.nameText = createText(scene, textX, textY, 30);
		this.nameText.setOrigin(0);
		this.add(this.nameText);

		textY += 1.25 * 30;
		this.typeText = createText(scene, textX, textY, 20);
		this.typeText.setOrigin(0);
		this.add(this.typeText);

		textY += 1.25 * 20;
		this.foodText = createText(scene, textX, textY, 20);
		this.foodText.setOrigin(0);
		this.add(this.foodText);


		/* Event buttons */

		this.eventButtons = [];

		let texts = ["Plantera", "Utrota", "Titta på", "Klappa"];
		for (let i = 0; i < 4; i++) {
			const y = (-0.03 + i/3 * 0.42) * this.height;
			this.eventButtons[i] = new PauseButton(scene, 0, y, texts[i], null);
			this.eventButtons[i].setScale(0.55);
			this.eventButtons[i].setScrollFactor(0);
			this.add(this.eventButtons[i]);
		}


		this.reset();
	}

	reset() {
		this.circle.setTint(0x777777);
		this.image.setTexture('missing');
		const SIZE = 100;
		const LAYER_4 = 1.00 - 1.8 * 0.05;
		this.image.setScale(LAYER_4 * SIZE / Math.max(this.image.width, this.image.height));

		this.nameText.setText('');
		this.typeText.setText('');
		this.foodText.setText('');

		this.clearEventButtons();
	}

	selectNode(node) {
		this.reset();
		this.species = null;
		this.lockTime = 0;

		if (node) {
			const species = node.species;
			this.species = species;
			this.image.setTexture(species.image);
			const SIZE = 100;
			const LAYER_4 = 1.00 - 1.8 * 0.05;
			this.image.setScale(LAYER_4 * SIZE / Math.max(this.image.width, this.image.height));
			const color = Phaser.Display.Color.HexStringToColor(species.color).color;
			this.circle.setTint(color);

			if (node.visibility != "unexplored") {
				this.nameText.setText(species.name);
				this.typeText.setText(getFromDataset(NODE_TYPES, "value", "swedish", species.type));
			}

			if (species.animal) {
				//species.animal.size
				const text = getFromDataset(ANIMAL_FOODS, "value", "swedish", species.animal.food);
				if (node.visibility != "unexplored") {
					this.foodText.setText(text);
				}
				//species.animal.consumption
				//species.animal.weight
				//species.animal.age
				//species.animal.offspring
			}

			if (node.visibility != "unexplored") {
				this.image.setTint(0xffffff);
				for (let i = species.events.length - 1; i >= 0; i--) {
					this.addEventButton(i, species.events[i]);
				}
				this.addGraphToggleButton(3);
			}
			else {
				this.image.setTint(0);
			}

			this.updateLockTime();
		}
	}

	clearEventButtons() {
		for (const button of this.eventButtons) {
			button.setActive(false);
			button.text.setText("");
			button.callback = null;
		}
	}

	addEventButton(index, event) {
		const button = this.eventButtons[index];
		if (event.type == "player") {
			button.setActive(true);
			button.text.setText(event.name + " (" + event.cost + ")");
			button.callback = this.scene.purchaseAction.bind(this.scene, event);
			button.cost = event.cost;
		}
	}

	addGraphToggleButton(index) {
		const button = this.eventButtons[index];
		button.setActive(true);
		button.text.setText(!this.species.showGraph ? "Följ i grafen" : "Följ inte i grafen");
		button.callback = this.scene.toggleTracking.bind(this.scene, this.species);
		button.cost = 0;
	}

	updateButtons(running, time, budget) {
		if (this.species) {
			for (let i = 0; i < this.eventButtons.length-1; i++) {
				const button = this.eventButtons[i];
				button.setActive(false);
				if (!running && button.callback && budget >= button.cost && time >= this.lockTime) {
					button.setActive(true);
				}
			}
		}
	}

	updateLockTime() {
		for (const activeEvent of web.activeEvents) {
			if (activeEvent.event.owner_id == this.species.id) {
				this.lockTime = Math.max(this.lockTime, activeEvent.endTime);
			}
		}
	}

	onToggleUpdate() {
		if (this.species) {
			this.eventButtons[3].text.setText(!this.species.showGraph ? "Följ i grafen" : "Följ inte i grafen");
		}
	}
}
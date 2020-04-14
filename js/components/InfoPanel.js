class InfoPanel extends Phaser.GameObjects.Container {
	constructor(scene, width, height) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.width = width;
		this.height = height;

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

		this.nameText = scene.add.text(textX, textY, '???', {
			font: "30px 'Crete Round'", fill: '#FFF'
		});
		this.nameText.setOrigin(0);
		this.add(this.nameText);

		textY += 1.25 * 30;
		this.typeText = scene.add.text(textX, textY, '???', {
			font: "20px 'Crete Round'", fill: '#FFF'
		});
		this.typeText.setOrigin(0);
		this.add(this.typeText);

		textY += 1.25 * 20;
		this.foodText = scene.add.text(textX, textY, '???', {
			font: "20px 'Crete Round'", fill: '#FFF'
		});
		this.foodText.setOrigin(0);
		this.add(this.foodText);


		/* Event buttons */

		this.eventButtons = [];

		let texts = ["Plantera", "Utrota", "Titta på", "Klappa"];
		for (let i = 0; i < 4; i++) {
			const y = (-0.03 + i/3 * 0.42) * this.height;
			this.eventButtons[i] = new PauseButton(scene, 0, y, texts[i], () => {
				console.log("CLICK");
			});
			this.eventButtons[i].setScale(0.55);
			this.eventButtons[i].setScrollFactor(0);
			this.add(this.eventButtons[i]);
		}


		this.reset();
	}

	reset() {
		this.circle.setTint(0x777777);
		this.image.setTexture('missing');

		this.nameText.setText('???');
		this.typeText.setText('???');
		this.foodText.setText('???');

		this.clearEventButtons();
	}

	selectNode(species) {
		this.reset();

		if (species) {
			this.image.setTexture(species.image);
			const color = Phaser.Display.Color.HexStringToColor(species.color).color;
			this.circle.setTint(color);

			this.nameText.setText(species.name);
			this.typeText.setText(getFromDataset(NODE_TYPES, "value", "swedish", species.type));

			if (species.animal) {
				//species.animal.size
				const text = getFromDataset(ANIMAL_FOODS, "value", "swedish", species.animal.food);
				this.foodText.setText(text);
				//species.animal.consumption
				//species.animal.weight
				//species.animal.age
				//species.animal.offspring

			}

			for (let i = species.events.length - 1; i >= 0; i--) {
				this.addEventButton(i, species.events[i]);
			}
		}
	}

	clearEventButtons() {
		for (const button of this.eventButtons) {
			button.setAlpha(0.4);
			button.text.setText("");
			button.callback = null;
		}
	}

	addEventButton(index, event) {
		const button = this.eventButtons[index];
		if (event.type == "player") {
			button.setAlpha(1.0);
			button.text.setText(event.name + " (" + event.cost + ")");
			button.callback = this.scene.purchaseAction.bind(this.scene, event);
			button.cost = event.cost;
		}
	}

	onBudgetUpdate(budget) {
		for (const button of this.eventButtons) {
			if (button.cost > budget) {
				button.setAlpha(0.4);
				button.callback = null;
			}
		}
	}
}
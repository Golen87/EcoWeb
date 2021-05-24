class Slider extends Phaser.GameObjects.Container {
	constructor(scene, x, y, width, height, thinHeight, steps) {
		super(scene, x, y);
		this.scene = scene;
		this.width = width;
		this.height = height;
		this.thinHeight = thinHeight;
		this.steps = steps;


		// Slider background
		this.background = scene.add.rexRoundRectangle(0, 0, width + thinHeight, thinHeight, thinHeight/2, 0XFFFFFF);
		this.background.setAlpha(0.5);
		this.add(this.background);


		// Step notches
		if (steps > 0) {
			for (let i = 0; i < steps; i++) {
				let x = -width/2 + i / (steps - 1) * width;
				let y = 0;
				let size = 0.75 * thinHeight;

				let notch = scene.add.ellipse(x, y, size, size, 0x000000, 1.0);
				notch.setAlpha(0.5);
				this.add(notch);
			}
		}


		// Slider button
		this.button = scene.add.ellipse(0, 0, height, height, 0xFFFFFF, 1.0);
		this.button.targetX = this.button.x;
		this.add(this.button);

		this.button.setInteractive({ hitArea: this.button, useHandCursor: true, draggable: true })
			.on('drag', this.onDrag.bind(this));
		this.button.input.hitArea.setTo(-height, -height, 3*height, 3*height);

		this.minX = -this.width/2;
		this.maxX = this.width/2;
		this.minV = 0;
		this.maxV = 1;
		this._value = 0.5;
	}


	setRange(min, max) {
		this.minV = min;
		this.maxV = max;
		this.value = this._value; // Will clamp
	}

	set value(value) {
		value = Phaser.Math.Clamp(value, this.minV, this.maxV);
		this._value = value;
		this.emit('onChange', this._value);

		let fac = (value - this.minV) / (this.maxV - this.minV);
		let x = this.minX + fac * (this.maxX - this.minX);
		this.button.x = this.button.targetX = x;
	}

	get value() {
		return this._value;
	}


	onDrag(pointer, x, y) {
		// Clamp x-coord
		x = Phaser.Math.Clamp(x, this.minX, this.maxX);

		// If slider is segmented, find value, round it to step, and convert back to position
		if (this.steps > 0) {
			let value = (x - this.minX) / (this.maxX - this.minX);
			value = Math.round(value * (this.steps-1)) / (this.steps-1);
			x = this.minX + value * (this.maxX - this.minX);
		}

		this.button.targetX = x;

		// Update value based on button's x-coord
		let baseValue = (x - this.minX) / (this.maxX - this.minX);
		let scaledValue = this.minV + baseValue * (this.maxV - this.minV);
		this._value = scaledValue;

		this.emit('onChange', this._value);
	}

	lock() {
		this.button.removeInteractive();
		this.button.fillColor = 0x555555;
		this.background.fillColor = 0x555555;
	}

	update(time, delta) {
		// Approach target position gradually
		this.button.x += 0.5 * (this.button.targetX - this.button.x);
	}
}
class TimeControllerButton extends Phaser.GameObjects.Container {
	constructor(scene, x, y, frame, callback) {
		super(scene, x, y);
		this.callback = callback;

		this.circle = this.scene.add.image(0, 0, 'circle');
		this.circle.setScale(55 / this.circle.width);
		this.circle.setScrollFactor(0);
		this.add(this.circle);

		this.icon = this.scene.add.image(0, 0, 'player_icons', frame);
		this.icon.setScale(0.35);
		this.icon.setTint(0x222222);
		this.add(this.icon);

		this.circle.setInteractive({ useHandCursor: true })
			.on('pointerout', this.onOut.bind(this) )
			.on('pointerover', this.onOver.bind(this) )
			.on('pointerdown', this.onDown.bind(this) )
			.on('pointerup', this.onUp.bind(this) );

		this.active = null;
		this.setActive(false);
		this.onOut();
	}

	setFrame(value) {
		this.icon.setFrame(value);
	}

	setActive(state) {
		this.active = state;
		this.setScale(state ? 0.93 : 1.0);
		this.circle.setTint(state ? 0xBBBBBB : 0xFFFFFF);
	}

	onOut() {
		this.setScale(1.0);
		this.circle.setTint(0xFFFFFF);
		this.setActive(this.active);
	}

	onOver() {
	}

	onDown() {
		this.setScale(0.88);
		this.circle.setTint(0xAAAAAA);
	}

	onUp() {
		this.onOut();
		this.callback();
	}
}


class TimeController extends Phaser.GameObjects.Container {
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

		const SEP = 65;

		this.resetButton = new TimeControllerButton(scene, -SEP*3/2, -30, 5, this.onReset.bind(this));
		this.add(this.resetButton);

		this.rewindButton = new TimeControllerButton(scene, -SEP*1/2, -30, 3, this.onRewind.bind(this));
		this.add(this.rewindButton);

		this.playButton = new TimeControllerButton(scene, SEP*1/2, -30, 0, this.onPlay.bind(this));
		this.add(this.playButton);

		this.forwardButton = new TimeControllerButton(scene, SEP*3/2, -30, 4, this.onForward.bind(this));
		this.add(this.forwardButton);

		this.timeText = createText(scene, -70, 20, 24, "#FFF", "<time>");
		this.timeText.setOrigin(0.5, 0.5);
		this.add(this.timeText);

		this.budgetText = createText(scene, 0, 50, 24, "#FFF", "<budget>");
		this.budgetText.setOrigin(0.5, 0.5);
		this.add(this.budgetText);

		this.ratingText = createText(scene, 70, 20, 24, "#FFF", "<star>");
		this.ratingText.setOrigin(0.5, 0.5);
		this.add(this.ratingText);

		this.time = null;
		this.setTime(0);

		this.speed = web.currentScenario.playSpeed;
		this.playSpeed = null;
		this.setSpeed(0);
	}


	update(time, delta) {
		if (this.playSpeed != 0) {
			this.setTime(this.time + this.playSpeed * delta);
		}
	}


	setTime(time) {
		time = Phaser.Math.Clamp(time, 0, web.currentScenario.maxTime);
		if (this.time != time) {
			this.time = time;
			this.onTimeChange();

			let value = Math.round(this.time);
			this.timeText.setText("Time: " + value.toString());
		}
		if (time == 0) {
			this.setSpeed(0);
		}
		if (time == web.currentScenario.maxTime) {
			this.setSpeed(0);
			this.onTimeEnd();
		}
	}

	setSpeed(value) {
		if (value == 0) {
			this.playSpeed = 0;
			this.resetStates();
			this.playButton.setActive(false);
			this.playButton.setFrame(0);
		}
		else {
			this.playSpeed = value;
			this.playButton.setActive(true);
			this.playButton.setFrame(1);
		}
	}

	onBudgetUpdate(value) {
		this.budgetText.setText("Budget: " + value.toString());
	}

	onRatingUpdate(value) {
		this.ratingText.setText("Stars: " + value.toString());
	}


	resetStates() {
		this.playButton.setActive(false);
		this.rewindButton.setActive(false);
		this.forwardButton.setActive(false);
		this.playButton.setFrame(0);
	}

	onReset() {
		this.setTime(0);
		this.setSpeed(0);
	}

	onPlay() {
		if (this.playSpeed == 0) {
			this.setSpeed(1 * this.speed);
		}
		else {
			this.resetStates();
			this.setSpeed(0);
		}
	}

	onRewind() {
		if (!this.rewindButton.active) {
			this.rewindButton.setActive(true);
			this.forwardButton.setActive(false);
			this.setSpeed(-10 * this.speed);
		}
		else {
			this.rewindButton.setActive(false);
			this.setSpeed(1 * this.speed);
		}
	}

	onForward() {
		if (!this.forwardButton.active) {
			this.forwardButton.setActive(true);
			this.rewindButton.setActive(false);
			this.setSpeed(10 * this.speed);
		}
		else {
			this.forwardButton.setActive(false);
			this.setSpeed(1 * this.speed);
		}
	}

	onTimeChange() {
		this.emit('onTimeChange');
	}

	onTimeEnd() {
		this.emit('onTimeEnd');
	}
}
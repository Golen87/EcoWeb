class SocketButton extends Phaser.GameObjects.Image {
	constructor(scene, x, y) {
		super(scene, x, y, 'socket_button');
		scene.add.existing(this);

		this.goalX  = x;
		this.goalY  = y;
		this.isHeld = false;

		this.setInteractive({ useHandCursor: true, draggable: true })
			.on('pointerout', this.onOut )
			.on('pointerover', this.onOver )
			.on('pointerdown', this.onDown )
			.on('pointerup', this.onUp )
			.on('dragstart', this.onDragStart )
			.on('drag', this.onDrag )
			.on('dragend', this.onDragEnd );

		this.onOut();
	}


	get scale() {
		return 1;
	}

	set value(x) {
		this._value = Phaser.Math.Clamp(x, 0, this.stepMax);
		this.x = (this.value - this.stepMax/2) * this.stepSize;
	}

	get value() {
		return this._value;
	}


	onOut() {
		this.setScale(this.scale);
		this.setTint(0xDDDDDD);
	}

	onOver() {
		this.setScale(1.05 * this.scale);
		this.setTint(0xFFFFFF);
	}

	onDown() {
		this.setScale(0.95 * this.scale);
		this.setTint(0xBBBBBB);
	}

	onUp() {
		this.onOver();
	}

	onDragStart(pointer, dragX, dragY) {
		this.isHeld = true;
	}

	onDrag(pointer, dragX, dragY) {
		this.goalX = dragX;
		this.goalY = dragY;
	}

	onDragEnd(pointer, dragX, dragY, dropped) {
		this.isHeld = false;
	}


	update(delta) {
		let speed = 2.0;
		this.x += (this.goalX - this.x) / speed;
		this.y += (this.goalY - this.y) / speed;
	}

}
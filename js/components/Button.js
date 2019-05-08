class TextButton extends Phaser.GameObjects.Text {
	constructor(scene, x, y, text, style, callback) {
		super(scene, x, y, text, style);

		this.setInteractive({ useHandCursor: true })
			.on('pointerover', () => this.enterButtonHoverState() )
			.on('pointerout', () => this.enterButtonRestState() )
			.on('pointerdown', () => this.enterButtonActiveState() )
			.on('pointerup', () => {
				console.log('up');
				this.enterButtonHoverState();
				callback();
			});
	}

	enterButtonHoverState() {
		console.log('hover');
		this.setStyle({ fill: '#ff0'});
	}

	enterButtonRestState() {
		console.log('rest');
		this.setStyle({ fill: '#0f0'});
	}

	enterButtonActiveState() {
		console.log('active');
		this.setStyle({ fill: '#0ff' });
	}
}
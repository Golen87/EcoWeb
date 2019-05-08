class ClickScene extends Phaser.Scene {
	constructor() {
		super({key: 'ClickScene'});
	}

	create() {
		this.add.image(200, 400, 'cat');
		this.t = this.add.triangle(200, 400, 100, 0, 0, 0, 0, 100, 0xff6699);

		this.clickCount = 0;
		this.clickCountText = this.add.text(100, 200, '');

		this.clickButton = new TextButton(this, 100, 100, 'Click me!', { fill: '#0f0'}, () => this.updateClickCountText());
		this.add.existing(this.clickButton);

		this.button = new CircleButton(this, 300, 100, () => {
			web.solve(10);
			updateChart();
		});
		this.add.existing(this.button);

		this.updateClickCountText();
		this.scale.refresh();
	}

	update() {
		//console.log(game.input.mousePointer.x, game.input.mousePointer.y);
		this.t.setTo(
			50 + 50*Math.sin(this.time.now/1000+Math.PI*2/3*1),
			50 + 50*Math.cos(this.time.now/1000+Math.PI*2/3*1),
			50 + 50*Math.sin(this.time.now/1000+Math.PI*2/3*2),
			50 + 50*Math.cos(this.time.now/1000+Math.PI*2/3*2),
			50 + 50*Math.sin(this.time.now/1000+Math.PI*2/3*3),
			50 + 50*Math.cos(this.time.now/1000+Math.PI*2/3*3),
		);
		//web.reset();
		//web.K[1] = 10 ** Math.sin(this.time.now/1000);
		//web.solve(100);
		//updateChart();
	}

	updateClickCountText() {
		this.clickCountText.setText(`Button has been clicked ${this.clickCount} times.`);
		this.clickCount++;
	}
}
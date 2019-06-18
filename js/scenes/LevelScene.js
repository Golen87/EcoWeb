class LevelScene extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene'});

		this.species = ['rav', 'skogshare', 'radjur', 'dovhjort'];
	}

	create() {
		let bg = this.add.image(this.CX, this.CY, 'bg_title');
		bg.setScale(this.H / bg.height);
		this.title = this.add.text(20, 20, "Level", { font: "40px 'Crete Round'" });

		let button = new TextButton(this, this.W-20, this.H-20, 'Back', {
			font: "30px 'Crete Round'"
		}, () => {
			this.scene.start("WorldScene");
		});
		button.setOrigin(1);

		this.nodes = [];
		for (let i = 0; i < this.species.length; i++) {
			let x = this.CX + (i-(this.species.length-1)/2) * 150;
			let y = this.CY;
			let s = this.species[i];
			this.nodes[i] = new Node(this, x, y, s);
			//web.solve(10);
			//updateChart();
		}

		let timeBar = this.add.image(0, this.H, 'time_bar');
		timeBar.setScale(0.75*this.W / timeBar.width);
		timeBar.setOrigin(0, 1);
		this.slider = new Slider(this, 0.35*this.W, this.H - 40);

		this.socket = new SocketButton(this, this.CX * 0.1, this.CY);
	}

	update(time, deltaMs) {
		let delta = deltaMs / 1000;

		this.slider.update(delta);
		this.socket.update(delta);

		for (let i = 0; i < this.species.length; i++) {
			let s = 0.03 * Math.sin(this.time.now / 500 + 2*Math.PI * i/this.species.length);
			this.nodes[i].setPopulation(web.getValueAt(i, this.slider.value * web.time) + s);
		}
	}


	get W() { return this.cameras.main.displayWidth; }
	get H() { return this.cameras.main.displayHeight; }
	get CX() { return this.cameras.main.centerX; }
	get CY() { return this.cameras.main.centerY; }
}
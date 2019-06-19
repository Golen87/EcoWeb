class LevelScene extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene'});

		this.positions = {
			'blabar': [0.7276, 1.0],
			'trad': [0.4808, 1.0],
			'rodrav': [0.6571, 0.0],
			'hare': [0.2724, 0.5],
			'gras': [0.25, 1.0],
			'koltrast': [0.7981, 0.5],
			'orter': [0.0192, 1.0],
			'svamp': [1.0, 1.0],
			'dovhjort': [0.0, 0.5],
			'radjur': [0.5192, 0.5],
		};
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
		button.setOrigin(1, 1);

		this.nodes = [];
		for (let i = 0; i < web.species.length; i++) {
		//for (let i = 0; i < 3; i++) {
			let p = this.positions[lowercase(web.species[i].name)];
			//let p = [Phaser.Math.RND.realInRange(0, 1), Phaser.Math.RND.realInRange(0, 1)];

			//let x = this.CX + (i-(web.species.length-1)/2) * 50;
			//let y = this.CY;
			let x = this.CX + (-0.5 + 1.0*p[0]) * this.H;
			let y = (0.2 + 0.5*p[1]) * this.H;

			let s = web.species[i];
			this.nodes[i] = new Node(this, x, y, s);
			this.nodes[i].setDepth(1);
			//web.solve(10);
			//updateChart();
		}

		let timeBar = this.add.image(0, this.H, 'time_bar');
		timeBar.setScale(0.75*this.W / timeBar.width);
		timeBar.setOrigin(0, 1);
		this.slider = new Slider(this, 0.35*this.W, this.H - 40);


		this.paths = [];
		for (let i = 0; i < this.nodes.length; i++) {
			for (let j = 0; j < this.nodes.length; j++) {
				if (i != j) {
					let diet = web.species[i].diet[web.species[j].name];
					if (diet) {
						let path = new Path(this, this.nodes[i], this.nodes[j]);
						this.paths.push(path);
					}
				}
			}
			//break;
		}


		//scene.events.on('postupdate', function(time, delta){
		//    //
		//}, scope);
	}

	update(time, deltaMs) {
		let delta = deltaMs / 1000;

		this.slider.update(delta);

		const SCALE = 0.1;
		for (let i = 0; i < this.nodes.length; i++) {
			let a = this.nodes[i];
			let aPos = new Phaser.Math.Vector2(a.x, a.y);
			a.force = new Phaser.Math.Vector2(0, 0);

			//if (i > 0) {
			//	continue;
			//}

			for (let j = 0; j < this.nodes.length; j++) {
				if (i != j) {
					let b = this.nodes[j];
					let bPos = new Phaser.Math.Vector2(b.x, b.y);

					//let diet = 20 * Math.max(-web.A[i][j], -web.A[j][i]);
					let diet = Math.max(
						web.species[i].diet[web.species[j].name] || 0,
						web.species[j].diet[web.species[i].name] || 0
					);
					let target = 300 - diet * (200);

					let diff = aPos.clone()
					diff.subtract(bPos);
					let scaling = diet + Math.max(0, 0.1 - 0.001 * diff.length());
					diff.scale((target - diff.length()) / diff.length());
					diff.scale(SCALE * scaling);
					a.force.add(diff);
				}
			}
		}

		for (let i = 0; i < this.nodes.length; i++) {
			let s = 0.02 * Math.sin(this.time.now / 1000 + 2*Math.PI * i/web.species.length + this.slider.value*20);
			this.nodes[i].setPopulation(web.getValueAt(i, this.slider.value * web.time), s);
			//this.nodes[i].x += this.nodes[i].force.x;
			//this.nodes[i].y += this.nodes[i].force.y;
			this.nodes[i].update(delta);
		}

		for (let i = 0; i < this.paths.length; i++) {
			this.paths[i].update(delta);
		}
	}


	get W() { return this.cameras.main.displayWidth; }
	get H() { return this.cameras.main.displayHeight; }
	get CX() { return this.cameras.main.centerX; }
	get CY() { return this.cameras.main.centerY; }
}
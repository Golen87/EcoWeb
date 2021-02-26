class LevelScene3 extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene3'});
	}

	create() {
		let bg = this.add.image(this.CX, this.CY, 'bg_uni_3');
		bg.setAlpha(0.2);
		this.fitToScreen(bg);

		// Sidebar background
		let sbWSep = 30;
		let sbHSep = 30;
		let sbW = 0.25*this.W;
		let sbH = this.H - 2*sbHSep;
		let sbX = this.W - sbWSep - sbW/2;
		let sbY = this.CY;
		this.sidebarBg = this.add.rexRoundRectangle(sbX, sbY, sbW, sbH, 10, 0X777777);
		this.sidebarBg.setAlpha(0.2);

		this.text = createText(this, sbX, sbY-sbH/2+30, 20, "#FFF", window.simulator.scenario.name);
		this.text.setOrigin(0.5);

		// Reset button
		this.resetButton = new TextButton(this, sbX, sbY+sbH/2-30, 'Reset', 20, this.reset.bind(this));
		this.resetButton.setOrigin(0.5);
		this.add.existing(this.resetButton);

		// this.scale.refresh();


		// Nodes

		this.nodes = [];
		const w = 2;
		const h = 3;
		for (let i in window.simulator.scenario.species) {
			const organism = window.simulator.scenario.species[i];

			// let x = this.CX + this.W * (-0.5 + (organism.x / 100));
			// let y = this.CY + this.H * (-0.5 + (organism.y / 100));
			let x = sbX + (80+30)*((1-w)/2 + i%w);
			let y = sbY + (80+30)*((1-h)/2 + Math.floor(i/w));

			let bg = this.add.sprite(x, y, "circle");
			bg.setTint(0x000000).setAlpha(0.25).setScale(80 / bg.height);

			let node = new Node2(this, x, y, organism);

			this.nodes.push(node);

			node.size = 0;
			this.updateSize(node, 0);

			if (this.nodes.length == 3) {
				// break;
			}
			node.setDepth(1);
		}


		// Paths

		this.paths = [];
		for (const node of this.nodes) {
			for (const other of this.nodes) {
				if (node != other) {
					let eats = false;
					let amount = 0;
					for (const item of node.species.diet) {
						if (other.species.id == item.node.id) {
							eats = true;
							// item.stage
							amount = item.pref;
							// my stage.efficiency
							break;
						}
					}
					amount = 1.0;
					if (eats) {
						// console.log(node.species.name, '->', other.species.name, '=', amount);
						let path = new Path(this, node, other, amount);
						this.paths.push(path);
						node.neighbours.push({node:other, value:-amount});
						other.neighbours.push({node:node, value:amount});
					}
				}
			}
		}


		// Empty circle

		let emptyCarnivore = new FakeNode(this, this.W*0.25, this.W*0.1, 'Carnivore');
		let emptyHerbivore = new FakeNode(this, this.W*0.45, this.W*0.25, 'Herbivore');
		let emptyPlant = new FakeNode(this, this.W*0.35, this.W*0.45, 'Plant');

		this.paths.push(new Path(this, emptyCarnivore, emptyHerbivore, 1));
		this.paths.push(new Path(this, emptyHerbivore, emptyPlant, 1));
	}

	update(time, deltaMs) {
		let delta = deltaMs / 1000;

		//console.log(game.input.mousePointer.x, game.input.mousePointer.y);

		for (const node of this.nodes) {
			node.update(time, delta);
		}

		for (const path of this.paths) {
			path.update(time, delta);
		}
	}


	reset() {
		for (const node of this.nodes) {
			this.updateSize(node, -node.size);
			node.resetPosition();
		}
	}

	change(startNode, startValue) {
		this.explored = [];
		this.queue = [[startNode, startValue, 0]];
		let maxDelay = 0;

		while (this.queue.length > 0) {
			let item = this.queue.shift();
			let node = item[0];
			let value = item[1];
			let delay = item[2];
			maxDelay = Math.max(maxDelay, delay);

			if (!this.explored.includes(node) && node.isInsidePlayingField()) {
				this.explored.push(node);

				if (node.size > -4) {
					this.updateSize(node, value, delay);
					for (let item of node.neighbours) {
						this.queue.push([item.node, value * item.value, delay+1]);
					}
				}
			}
		}

		this.time.addEvent({
			delay: 500 + 150*maxDelay,
			callbackScope: this,
			callback: function() {
				for (const node of this.nodes) {
					if (node.size <= -3) {
						this.updateSize(node, -node.size);
						node.resetPosition();
					}
				}
			}
		});
	}

	updateSize(node, value, delay=0) {
		node.size = Phaser.Math.Clamp(node.size + value, -3, 3);
		let scale = 1.0 + node.size / 3;

		// node.image.setTint(interpolateColor(0xFFFFFF, 0xFF0000, Math.abs(node.size / 4)));

		// node.setScale(scale);
		if (node.tween) {
			node.tween.stop();
		}
		node.tween = this.tweens.add({
			targets: node.circle,
			scale: { from: node.circle.scale, to: scale },
			ease: 'Cubic',
			duration: 500,
			delay: 150*delay
		});
	}


	get W() { return this.cameras.main.displayWidth; }
	get H() { return this.cameras.main.displayHeight; }
	get CX() { return this.cameras.main.centerX; }
	get CY() { return this.cameras.main.centerY; }

	fitToScreen(image) {
		image.setScale(Math.max(this.W / image.width, this.H / image.height));
	}

	containToScreen(image) {
		image.setScale(Math.min(this.W / image.width, this.H / image.height));
	}
}
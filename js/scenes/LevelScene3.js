class LevelScene3 extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene3'});
	}

	create() {
		this.timeStamp = 0;
		this.input.addPointer(2);

		let bg = this.add.image(this.CX, this.CY, 'bg_uni_1');
		bg.setAlpha(0.2);
		this.fitToScreen(bg);

		// Sidebar background
		// let sbWSep = 30;
		// let sbHSep = 30;
		// let sbW = 0.25*this.W;
		// let sbH = this.H - 2*sbHSep;
		// let sbX = this.W - sbWSep - sbW/2;
		// let sbY = this.CY;
		let sbW = this.W;
		let sbH = 0.2 * this.H;
		let sbX = this.CX;
		let sbY = this.H - sbH/2;
		this.sidebarBg = this.add.rexRoundRectangle(sbX, sbY, sbW, sbH, 10, 0X000000);
		this.sidebarBg.setAlpha(0.2);

		this.text = createText(this, 10, 10, 20, "#FFF", window.simulator2.scenario.name);
		this.text.setOrigin(0);

		this.timeText = createText(this, this.W-10, 10, 20, "#FFF", this.timeStamp);
		this.timeText.setOrigin(1, 0);

		// Relation matrix debug
		this.matrix = [];
		for (let i = 0; i < window.simulator2.species.length; i++) {
			createText(this, 25+25*(i+1), this.H-120+15*0, 10, "#FFF", window.simulator2.species[i].name.slice(0,3)).setOrigin(0.5);
			createText(this, 25+25*0, this.H-120+15*(i+1), 10, "#FFF", window.simulator2.species[i].name.slice(0,3)).setOrigin(0.5);
			this.matrix[i] = [];
			for (let j = 0; j < window.simulator2.species.length; j++) {
				this.matrix[i][j] = createText(this, 25+25*(j+1), this.H-120+15*(i+1), 10, "#FFF", window.simulator2.interactionMatrix[i][j]);
				this.matrix[i][j].setOrigin(0.5);
			}
		}

		// Reset button
		this.resetButton = new TextButton(this, this.W-40, sbY, 'Reset', 20, this.reset.bind(this));
		this.resetButton.setOrigin(1, 0.5);
		this.add.existing(this.resetButton);

		// this.scale.refresh();


		// Nodes

		this.nodes = [];
		const w = window.simulator2.species.length/2;
		const h = 2;
		for (let i = 0; i < window.simulator2.species.length; i++) {
			const organism = window.simulator2.scenario.species[i];

			// let x = this.CX + this.W * (-0.5 + (organism.x / 100));
			// let y = this.CY + this.H * (-0.5 + (organism.y / 100));
			let x = sbX + (80+25)*((1-w)/2 + i%w);
			let y = sbY + (80+25)*((1-h)/2 + Math.floor(i/w));

			let bg = this.add.sprite(x, y, "circle");
			bg.setTint(0x222222).setAlpha(0.5).setScale(80 / bg.height);

			let node = new Node2(this, x, y, organism);

			this.nodes.push(node);

			node.size = 0;
			this.updateSize(node, 0);

			if (this.nodes.length == 3) {
				// break;
			}
			node.setDepth(1);
			node.text.setText(0);

			node.on('onEnter', this.onNodeAddOrRemove, this);
			node.on('onExit', this.onNodeAddOrRemove, this);
			node.on('onPlusMinus', this.onNodePlusMinus, this);
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
					// amount = 1.0;
					if (eats) {
						// console.log(node.species.name, '->', other.species.name, '=', amount);
						let path = new Path(this, node, other, amount);
						this.paths.push(path);
						node.neighbours.push({node:other, value:amount});
						other.neighbours.push({node:node, value:-amount});
					}
				}
			}
		}


		// Empty circle

		// let emptyCarnivore = new FakeNode(this, this.W*0.45, this.W*0.10, 'Carnivore');
		// let emptyHerbivore = new FakeNode(this, this.W*0.60, this.W*0.23, 'Herbivore');
		// let emptyPlant = new FakeNode(this, this.W*0.50, this.W*0.37, 'Plant');

		// this.paths.push(new Path(this, emptyCarnivore, emptyHerbivore, 1));
		// this.paths.push(new Path(this, emptyHerbivore, emptyPlant, 1));
		// for (const node of this.nodes) {
		// 	if (node.species.type == "animal") {
		// 		if (node.species.food == "carnivore") {
		// 			this.paths.push(new Path(this, node, emptyHerbivore, 1));
		// 		}
		// 		else if (node.species.food == "herbivore") {
		// 			this.paths.push(new Path(this, node, emptyPlant, 1));
		// 			this.paths.push(new Path(this, emptyCarnivore, node, 1));
		// 		}
		// 	}
		// 	else if (node.species.type == "plant") {
		// 		this.paths.push(new Path(this, emptyHerbivore, node, 1));
		// 	}
		// }
	}

	update(time, deltaMs) {
		let delta = deltaMs / 1000;

		if (this.timeStamp < window.simulator2.time) {
			this.timeStamp += 0.1;
			this.updatePopulations();
		}

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
			node.resetPosition(false);
		}
		window.simulator2.run();
		this.updatePaths();
	}

	onNodePlusMinus(node, value) {
		this.timeStamp = window.simulator2.time;
		window.simulator2.changeGrowthRate(node.species, value);
		window.simulator2.run();
		this.updatePaths();

		/*
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
		*/
	}

	updateSize(node, value, delay=0) {
		if (true)
			return;

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

	onNodeAddOrRemove(node, active, manually) {
		this.timeStamp = window.simulator2.time;
		window.simulator2.addOrRemoveSpecies(node.species, active);
		if (manually) {
			window.simulator2.run();
			this.updatePaths();
		}
	}


	updatePopulations() {
		this.timeText.setText(this.timeStamp.toFixed(1));

		let populations = window.simulator2.getPopulationAt(this.timeStamp);

		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].active) {
				// let min = this.nodes[i].minPopThreshold;
				// let max = this.nodes[i].maxPopThreshold;
				// let value = (populations[i] - min) / (max - min);
				let value = populations[i];
				this.nodes[i].circle.setScale(0.4 + 0.9 * value);
			}
			else {
				this.nodes[i].circle.setScale(1);
			}

			this.nodes[i].text.setText((populations[i]*100).toFixed());
			// let p = Math.round(Phaser.Math.Clamp(populations[i], 0, 1) * 10);
			// let t = "";
			// for (let i=0; i<p; i++) {t+="|";}
			// for (let i=p; i<10; i++) {t+=".";}
			// this.nodes[i].text.setText(t);
		}
	}

	updatePaths() {
		for (let i in window.simulator2.species) {
			for (let j in window.simulator2.species) {

				// Update path thickness
				for (const path of this.paths) {
					if (path.node1 == this.nodes[i] && path.node2 == this.nodes[j]) {
						let value = window.simulator2.interactionMatrix[i][j];
						path.lineThickness = 3*value;
					}
				}

				// Update debug matrix
				this.matrix[i][j].setText(window.simulator2.interactionMatrix[i][j]);
			}
		}
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
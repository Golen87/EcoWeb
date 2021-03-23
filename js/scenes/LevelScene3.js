const NODE_SIZE = 80;

class LevelScene3 extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene3'});

		// "Role" is a node's role in the scenario, deciding when it appears in the story
		this.roleMap = {
			"96b49f05-e31c-46c6-a11b-46a8417073d5":	"carnivore_1",	// Lejon
			"5ca8345a-20b4-46d8-af6f-b3add4bbd89f":	"herbivore_1",	// Zebra
			"29fe89a4-abd1-4f18-ad38-baac84902748":	"plant_1",		// Acalypha fruticosa
			"23871c47-e590-473c-b551-1d9e04b0c612":	"carnivore_2",	// Vildhund
			"28fdbae5-dc73-47bf-a069-cc72cd277607":	"herbivore_2",	// Kirks dik-dik
			"e0ec6d69-8d39-45f4-ad7b-9a476ab01362":	"plant_2",		// Allophylus Rubifolius
			"8243441b-4edb-413d-bf0f-fffdc337fd08":	"plant_3",		// Heteropogon contortus
		};
		this.story1 = ["carnivore_1", "herbivore_1", "plant_1"];
		this.story2 = ["carnivore_1", "herbivore_1", "plant_1", "herbivore_2", "plant_2", "plant_3"];
		this.currentStory = 0;
		this.storyRunning = false;
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
		let sbH = 0.22 * this.H;
		let sbX = this.CX;
		let sbY = this.H - sbH/2;
		this.sidebarBg = this.add.rexRoundRectangle(sbX, sbY, sbW, sbH, 10, 0X000000);
		this.sidebarBg.setAlpha(0.2);
		// this.sidebarBg = this.add.rexRoundRectangle(sbX, sbY, sbW, sbH, 10, 0XFF0000);
		// this.sidebarBg.setAlpha(1.0);


		// Scenario name text
		this.text = createText(this, 10, 10, 20, "#FFF", window.simulator2.scenario.name + " Food Web");
		this.text.setOrigin(0);

		// Instructions text
		this.instructionText = createText(this, sbX, sbY - 0.85*NODE_SIZE , 20, "#FFF", "Instruction text");
		this.instructionText.setOrigin(0.5);

		this.storyText1 = createText(this, sbX, sbY-0.30*sbH , 30, "#fcb061", "Big instruction text");
		this.storyText1.setOrigin(0.5);
		this.storyText2 = createText(this, sbX, sbY-0.10*sbH, 20, "#FFF", "Small instruction text");
		this.storyText2.setOrigin(0.5);

		// this.nextButton = new PauseButton(this, sbX, sbY-100, "Next", () => {
			// this.instructionText.setText("awesome sauce");
		// });
		// this.add.existing(this.nextButton);
		this.nextButton = this.add.rexRoundRectangle(sbX, sbY+0.20*sbH, 200, 20, 20, 0xa77440);
		this.nextButton.setInteractive({ useHandCursor: true })
			.on('pointerup', () => { this.startStory(this.currentStory + 1); }
		);
		this.nextText = createText(this, sbX, sbY+0.20*sbH, 30, "#FFF", "Next");
		this.nextText.setOrigin(0.5);

		// Time debug text
		this.timeText = createText(this, this.W-10, 10, 20, "#FFF", this.timeStamp);
		this.timeText.setOrigin(1, 0);
		this.timeText.setVisible(false);

		// Relation matrix debug
		this.matrix = [];
		for (let i = 0; i < window.simulator2.species.length; i++) {
			// createText(this, 25+25*(i+1), this.H-120+15*0, 10, "#FFF", window.simulator2.species[i].name.slice(0,3)).setOrigin(0.5);
			// createText(this, 25+25*0, this.H-120+15*(i+1), 10, "#FFF", window.simulator2.species[i].name.slice(0,3)).setOrigin(0.5);
			this.matrix[i] = [];
			for (let j = 0; j < window.simulator2.species.length; j++) {
				this.matrix[i][j] = createText(this, 25+25*(j+1), this.H-120+15*(i+1), 10, "#FFF", window.simulator2.interactionMatrix[i][j]);
				this.matrix[i][j].setOrigin(0.5);
				this.matrix[i][j].setVisible(false);
			}
		}

		// Reset button
		this.resetButton = new TextButton(this, this.W-40, sbY, 'Reset', 20, this.reset.bind(this));
		this.resetButton.setOrigin(1, 0.5);
		this.add.existing(this.resetButton);

		// this.scale.refresh();


		// Nodes

		this.nodes = [];
		const h = Math.ceil(window.simulator2.species.length / 8);
		const w = window.simulator2.species.length / h;
		for (let i = 0; i < window.simulator2.species.length; i++) {
			const organism = window.simulator2.scenario.species[i];

			// let x = this.CX + this.W * (-0.5 + (organism.x / 100));
			// let y = this.CY + this.H * (-0.5 + (organism.y / 100));
			let temp = [2, 0, 1, 3, 4, 5, 6][i];
			let x = sbX + (NODE_SIZE*1.3)*((1-w)/2 + temp%w);
			let y = sbY + (NODE_SIZE*0.9)*((1-h)/2 + Math.floor(temp/w));

			// let bg = this.add.sprite(x, y, "circle");
			// bg.setTint(0x222222).setAlpha(0.5).setScale(NODE_SIZE / bg.height);

			let node = new Node2(this, x, y, organism);

			this.nodes.push(node);

			// node.size = 0;
			// this.updateSize(node, 0);

			node.setDepth(1);
			node.setVisible(false);
			// node.text.setText(0);

			node.on('onEnter', this.onNodeAddOrRemove, this);
			node.on('onExit', this.onNodeAddOrRemove, this);
			node.on('onPlusMinus', this.onNodePlusMinus, this);

			if (this.roleMap[node.species.id]) {
				node.role = this.roleMap[node.species.id];
			}
			else {
				console.error("Unknown role for species:", node.species.name, node.species.id);
			}
		}


		// Empty nodes

		this.fakeNodes = {
			carnivore_1:	new FakeNode(this, 0.49 * this.W, 0.15 * this.H, 'Carnivore'),
			herbivore_1:	new FakeNode(this, 0.62 * this.W, 0.40 * this.H, 'Herbivore'),
			plant_1:		new FakeNode(this, 0.53 * this.W, 0.65 * this.H, 'Plant'),

			carnivore_2:	new FakeNode(this, 0.32 * this.W, 0.15 * this.H, 'Carnivore'),
			herbivore_2:	new FakeNode(this, 0.38 * this.W, 0.40 * this.H, 'Herbivore'),
			plant_2:		new FakeNode(this, 0.27 * this.W, 0.65 * this.H, 'Plant'),
			plant_3:		new FakeNode(this, 0.75 * this.W, 0.65 * this.H, 'Plant'),
		};

		// this.emptyCarnivore = new FakeNode(this, this.W*0.45, this.W*0.10, 'Carnivore');
		// this.emptyHerbivore = new FakeNode(this, this.W*0.60, this.W*0.23, 'Herbivore');
		// this.emptyPlant = new FakeNode(this, this.W*0.50, this.W*0.37, 'Plant');
		// this.fakeNodes = [this.emptyCarnivore, this.emptyHerbivore, this.emptyPlant];

		/*
		this.paths.push(new Path(this, this.emptyCarnivore, this.emptyHerbivore, 1));
		this.paths.push(new Path(this, this.emptyHerbivore, this.emptyPlant, 1));
		for (const node of this.nodes) {
			if (node.species.type == "animal") {
				if (node.species.food == "carnivore") {
					this.paths.push(new Path(this, node, this.emptyHerbivore, 1));
					// this.emptyCarnivore.addReplacement(node);
				}
				else if (node.species.food == "herbivore") {
					this.paths.push(new Path(this, node, this.emptyPlant, 1));
					this.paths.push(new Path(this, this.emptyCarnivore, node, 1));
					// this.emptyHerbivore.addReplacement(node);
				}
			}
			else if (node.species.type == "plant") {
				this.paths.push(new Path(this, this.emptyHerbivore, node, 1));
				// this.emptyPlant.addReplacement(node);
			}

			if (node.species.id == this.nodeMap.carnivore_1) {
				this.emptyCarnivore.addReplacement(node);
			}
			if (node.species.id == this.nodeMap.herbivore_1) {
				this.emptyHerbivore.addReplacement(node);
			}
			if (node.species.id == this.nodeMap.plant_1) {
				this.emptyPlant.addReplacement(node);
			}
		}
		*/


		// Node-fake relations

		for (const node of this.nodes) {
			this.fakeNodes[node.role].addReplacement(node);

			// this.nodeMap[key].fake = this.fakeNodes[key];
			// this.fakeNodes[key].node = this.nodeMap[key].fake;
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
						const nodeFake = this.fakeNodes[node.role];
						const otherFake = this.fakeNodes[other.role];

						this.addPath(node, other, amount);
						this.addPath(nodeFake, other, amount);
						this.addPath(nodeFake, otherFake, amount);
						this.addPath(node, otherFake, amount);
					}
				}
			}
		}


		// this.add.image(100, 100, 'icon-backToBeginning');
		// this.add.image(200, 100, 'icon-backward');
		// this.add.image(300, 100, 'icon-forward');
		// this.add.image(400, 100, 'icon-play');

		// this.add.image(100, 200, 'icon-foodWeb');
		// this.add.image(200, 200, 'icon-ecoWeb');
		// this.add.image(300, 200, 'icon-ecoChallenge');
		// this.add.image(400, 200, 'icon-ecoMission');

		// this.add.image(100, 300, 'icon-soil');
		// this.add.image(200, 300, 'icon-rain');
		// this.add.image(300, 300, 'icon-sun');

		this.startStory(1);
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

		for (const key in this.fakeNodes) {
			this.fakeNodes[key].update(time, delta);
		}

		for (const path of this.paths) {
			path.update(time, delta);
		}
	}


	startStory(number) {
		this.storyRunning = true;
		this.currentStory = number;

		this.instructionText.setVisible(true);
		this.nextButton.setVisible(false);
		this.nextText.setVisible(false);
		this.storyText1.setVisible(false);
		this.storyText2.setVisible(false);

		if (number == 1) {
			this.instructionText.setText("Build a food chain by placing the plants and animals");//("Place the plants and animals at the right slots in the food chain");
			for (const node of this.nodes) {
				node.setVisible(this.story1.includes(node.role));
			}
			for (const key in this.fakeNodes) {
				this.fakeNodes[key].setVisible(this.story1.includes(key));
			}
		}
		else if (number == 2) {
			this.instructionText.setText("Now, expand the food chain with more species to build a food web"); // "Place the plants and animals at the right slots in the food web"
			for (const node of this.nodes) {
				node.setVisible(this.story2.includes(node.role));
			}
			for (const key in this.fakeNodes) {
				this.fakeNodes[key].setVisible(this.story2.includes(key));
			}
		}
		else {
			this.instructionText.setText("Try to remove the plants and animals to see how they influence each other");
			for (const node of this.nodes) {
				node.setVisible(this.story2.includes(node.role));
			}
			for (const key in this.fakeNodes) {
				this.fakeNodes[key].setVisible(false);
			}
		}
	}

	completeStory() {
		this.storyRunning = false;

		this.instructionText.setVisible(false);
		this.nextButton.setVisible(true);
		this.nextText.setVisible(true);
		this.storyText1.setVisible(true);
		this.storyText2.setVisible(true);

		if (this.currentStory == 1) {
			this.storyText1.setText("You have created a food chain!");
			this.storyText2.setText("The energy flows from the plant to the herbivore to the carnivore"); // The herbivore eats the plant, and the carnivore eats the herbivore.
		}
		else if (this.currentStory == 2) {
			this.storyText1.setText("You have created a food web!");
			this.storyText2.setText("Animals prefer some food over other, which makes more energy flow that way");
		}
	}


	reset() {
		for (const node of this.nodes) {
			// this.updateSize(node, -node.size);
			node.resetPosition(false);
		}
		window.simulator2.run();
		this.updatePaths();
		this.startStory(1);
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

	// updateSize(node, value, delay=0) {
	// 	if (true)
	// 		return;

	// 	node.size = Phaser.Math.Clamp(node.size + value, -3, 3);
	// 	let scale = 1.0 + node.size / 3;

	// 	// node.image.setTint(interpolateColor(0xFFFFFF, 0xFF0000, Math.abs(node.size / 4)));

	// 	// node.setScale(scale);
	// 	if (node.tween) {
	// 		node.tween.stop();
	// 	}
	// 	node.tween = this.tweens.add({
	// 		targets: node.circle,
	// 		scale: { from: node.circle.scale, to: scale },
	// 		ease: 'Cubic',
	// 		duration: 500,
	// 		delay: 150*delay
	// 	});
	// }

	onNodeAddOrRemove(node, active, manually) {
		this.timeStamp = window.simulator2.time;
		window.simulator2.addOrRemoveSpecies(node.species, active);
		if (manually) {
			window.simulator2.run();
			this.updatePaths();
		}
		this.updatePopulations();

		if (this.storyRunning) {
			let success = true;
			for (const node of this.nodes) {
				if ( (this.currentStory == 1 && this.story1.includes(node.role)) || (this.currentStory == 2 && this.story2.includes(node.role)) ) {
					if (!node.active) {
						success = false;
						break;
					}
				}
			}
			if (this.currentStory > 2) {
				success = false;
			}
			if (success) {
				this.completeStory();
			}
		}
	}


	updatePopulations() {
		this.timeText.setText(this.timeStamp.toFixed(1));

		let populations = window.simulator2.getPopulationAt(this.timeStamp);

		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].active) {
				let min = this.nodes[i].minPopThreshold;
				let max = this.nodes[i].maxPopThreshold;
				let value = (populations[i] - min) / (max - min);
				// let value = populations[i];
				this.nodes[i].circle.setScale(0.3 + 1.2 * value);

				if (populations[i] < 0.03) {
					this.nodes[i].resetPosition(false);
					// window.simulator2.run();
					// this.updatePaths();
				}
			}
			else {
				this.nodes[i].circle.setScale(1);
			}

			// this.nodes[i].text.setText((populations[i]*100).toFixed());

			// let p = Math.round(Phaser.Math.Clamp(populations[i], 0, 1) * 10);
			// let t = "";
			// for (let i=0; i<p; i++) {t+="|";}
			// for (let i=p; i<10; i++) {t+=".";}
			// this.nodes[i].text.setText(t);
		}
	}

	addPath(node1, node2, amount) {
		let path = new Path(this, node1, node2, amount);
		this.paths.push(path);
		node1.neighbours.push({node:node2, value:amount});
		node2.neighbours.push({node:node1, value:-amount});
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
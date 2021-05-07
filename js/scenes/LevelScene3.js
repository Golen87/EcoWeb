const NODE_SIZE = 80;

class LevelScene3 extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene3'});

		// "Role" is a node's role in the scenario, deciding when it appears in the story
		this.roleMap = {
			"138fc562-6fb9-45ff-bcdf-656208d2be14": "carnivore_1", // Lion
			"3c3f0fdf-e6c1-4a94-b52e-e3785a2849ca": "herbivore_1", // Plains zebra
			"042f48d0-4a28-4e77-874f-b9a5b1f821af": "plant_1", // Heteropogon contortus
			"f4f32888-4079-4c70-a204-a094647ea210": "herbivore_2", // Kirk's dik-dik
			// "a11f07e7-554c-4b0a-ab11-ac34d84b6d85": "plant_2", // Acalypha fruticosa
			"37b60be7-d897-41cb-91e5-56045687788e": "plant_2", // Allophylus rubifolius
			"93878dd9-1df5-4521-b5ba-57f63450e912": "plant_3", // Panicum coloratum

			// "0fd86e7d-942f-431f-86d4-e5004f1caed1":	"carnivore_1",	// Lejon
			// "32594c3d-0c63-4cd6-9350-2e40f759a40e":	"herbivore_1",	// Zebra
			// "4605a453-92f8-4bf5-90bc-9a38fc993f03":	"plant_1",		// Heteropogon contortus
			// "0c104616-32bf-4b4a-aa1f-5003fcb10a0a":	"carnivore_2",	// Vildhund
			// "827bbe9a-63fe-4340-8cb6-b97a8f416b5f":	"herbivore_2",	// Kirks dik-dik
			// "d73dbde0-daf1-499d-a3f0-173ad916cef0":	"plant_2",		// Acalypha fruticosa
			// "fa53ea56-87fd-4e57-ad86-f4a713d2fa3f":	"plant_3",		// Panicum coloratum
		};
		this.story1 = ["carnivore_1", "herbivore_1", "plant_1"];
		this.story2 = ["carnivore_1", "herbivore_1", "plant_1", "herbivore_2", "plant_2", "plant_3"];
		this.timeStamp = 0;
		this.currentStory = 0;
		this.storyRunning = false;
	}

	create() {
		this.input.addPointer(2);

		let bg = this.add.image(this.CX, this.CY, 'bg_uni_1');
		bg.setAlpha(0.2);
		bg.setPostPipeline(BlurPostFilter);
		this.fitToScreen(bg);

		// this.cameras.main.setPostPipeline(BlurPostFilter);


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
		let sbY = this.H - 0.5*sbH;
		this.sidebarBg = this.add.rexRoundRectangle(sbX, sbY, sbW, sbH, 10, 0X000000);
		this.sidebarBg.setAlpha(0.2);
		// this.sidebarBg = this.add.rexRoundRectangle(sbX, sbY, sbW, sbH, 10, 0XFF0000);
		// this.sidebarBg.setAlpha(1.0);


		// Scenario name text
		this.titleText = createText(this, 10, 10, 20, "#fcb061", "Serengeti Food Web");
		this.titleText.setAlpha(0.75);
		this.titleText.setOrigin(0);
		language.bind(this.titleText, "title");

		// Instructions text
		this.instructionText = createText(this, sbX, sbY - 0.85*NODE_SIZE , 20, "#FFF", "Instruction text");
		this.instructionText.setOrigin(0.5);

		this.storyText1 = createText(this, sbX, sbY-0.30*sbH , 30, "#fcb061", "Large instruction text");
		this.storyText1.setOrigin(0.5);
		this.storyText2 = createText(this, sbX, sbY-0.10*sbH, 20, "#FFF", "Small instruction text");
		this.storyText2.setOrigin(0.5);

		this.nextButton = this.add.rexRoundRectangle(sbX, sbY+0.20*sbH, 200, 20, 20, 0xa77440);
		this.nextButton.setInteractive({ useHandCursor: true })
			.on('pointerup', () => { this.startStory(this.currentStory + 1); }
		);
		this.nextText = createText(this, sbX, sbY+0.20*sbH, 30, "#FFF", "Next");
		this.nextText.setOrigin(0.5);
		language.bind(this.nextText, "next_button");


		// Chapter tabs

		let ctW = 0.03 * this.W;
		let ctH = 0.17 * this.H;
		let ctX = this.W;
		let ctY = this.CY;
		const chapters = [
			{
				name: "chapter_1",
				image: 'icon-foodWeb',
				function: () => {
					this.startStory(1);
				}
			},
			{
				name: "chapter_2",
				image: 'icon-ecoChallenge',
				function: () => {}
			},
			// {
				// name: "chapter_3",
				// image: 'icon-ecoMission',
				// function: () => {}
			// },
			{
				name: "chapter_4",
				image: 'icon-ecoWeb',
				function: () => {
					this.startStory(0);
				}
			},
		];

		this.chapterTabs = [];
		for (let i = 0; i < chapters.length; i++) {
			let chapter = chapters[i];
			let x = ctX - ctW/2;
			let y = ctY + (i-2)*ctH + (i-1)*ctH*0.01;

			let tab = this.add.container(x, y);
			tab.setDepth(100);
			tab.setAlpha(0.5);
			let bg = this.add.rexRoundRectangle(0.5*ctW, 0, 2*ctW, ctH, 10, 0XFFFFFF);
			bg.setAlpha(0.2);
			let image = this.add.image(0, -0.3*ctH, chapter.image);
			image.setScale(0.45 * ctW / image.width);
			image.setOrigin(0.5);
			let text = createText(this, 0, -0.15*ctH, 15, "#FFF", "Name");
			text.setOrigin(0, 0.5);
			text.setAngle(90);
			language.bind(text, chapter.name);

			tab.add(bg);
			tab.add(text);
			tab.add(image);
			this.chapterTabs.push(tab);

			bg.setInteractive({ useHandCursor: true })
				.on('pointerup', chapter.function.bind(this));
		}


		// Toolbox

		let tbX = this.W - ctW/2;
		let tbY = this.H - sbH/2;
		const toolButtons = [
			{
				image: 'icon-bookmark-saved',
				function: () => {}
			},
			{
				image: 'icon-info',
				function: () => {}
			},
			{
				image: 'icon-reset',
				function: this.reset
			},
			{
				image: 'icon-menu-flag-se',
				function: () => {
					language.setLanguage("Swedish");
				}
			},
			{
				image: 'icon-menu-flag-en',
				function: () => {
					language.setLanguage("English");
				}
			}
		];

		for (let i = 0; i < toolButtons.length; i++) {
			let button = toolButtons[i];
			let size = 0.02 * this.H;
			let x = tbX;
			let y = tbY + (i - (toolButtons.length-1)/2) * 1.75*size;

			let image = this.add.image(x, y, button.image);
			image.setScale(size / image.height);
			image.setAlpha(0.65);
			image.setInteractive({ useHandCursor: true })
				// .on('pointerover', () => {image.setAlpha(1.0);})
				// .on('pointerout', () => {image.setAlpha(0.5);})
				.on('pointerup', button.function.bind(this));
		}

		// this.add.image(100, 100, 'icon-backToBeginning');
		// this.add.image(200, 100, 'icon-backward');
		// this.add.image(300, 100, 'icon-forward');
		// this.add.image(400, 100, 'icon-play');
		// this.add.image(100, 300, 'icon-soil');
		// this.add.image(300, 300, 'icon-sun');
		// this.add.image(200, 300, 'icon-rain');
		// 'icon-annualFlower'
		// 'icon-grass'
		// 'icon-herb'
		// 'icon-shrub'
		// 'icon-tree'
		// let land = this.add.image(this.CX, this.H - sbH - NODE_SIZE/2, 'bg_land');
		// this.containToScreen(land);


		// Node slots

		this.nodeSlots = [];
		let order = [3,4,2,5,1,0,6,7,8,9];

		for (let i = 0; i < 10; i++) {
			let x = sbX + 1.3 * NODE_SIZE * (order[i]-3);
			let y = sbY;
			let slot = {x, y, taken: false};
			this.nodeSlots.push(slot);
		}


		// Nodes

		this.nodes = [];
		for (let i = 0; i < window.simulator2.species.length; i++) {
			const organism = window.simulator2.scenario.species[i];

			if (this.roleMap[organism.id]) {

				let node = new Node2(this, 0, 0, organism);
				this.nodes.push(node);

				// Experimental boids
				node.velocity = new Phaser.Math.Vector2(0, 0);

				node.setDepth(1);
				node.setVisible(false);

				node.on('onEnter', this.onNodeAddOrRemove, this);
				node.on('onExit', this.onNodeAddOrRemove, this);
				node.on('onPlusMinus', this.onNodePlusMinus, this);
				node.on('onDeath', this.onNodeDeath, this);
				node.on('onDragStart', this.dismissWarning, this);

				node.role = this.roleMap[organism.id];
				node.index = i;
			}
		}


		// Large food web

		this.selectedWebNode = null;
		let WX = 100;
		let WY = 100;
		let WW = this.W - 200;
		let WH = this.H - 200;
		this.groupPositions = {
			1:  new Phaser.Math.Vector2(WX+0.90*WW, WY+0.30*WH),
			2:  new Phaser.Math.Vector2(WX+0.80*WW, WY+0.65*WH),

			3:  new Phaser.Math.Vector2(WX+0.50*WW, WY+0.10*WH),
			4:  new Phaser.Math.Vector2(WX+0.55*WW, WY+0.45*WH),
			5:  new Phaser.Math.Vector2(WX+0.45*WW, WY+0.70*WH),
			6:  new Phaser.Math.Vector2(WX+0.55*WW, WY+0.90*WH),

			7:  new Phaser.Math.Vector2(WX+0.10*WW, WY+0.00*WH),
			8:  new Phaser.Math.Vector2(WX+0.20*WW, WY+0.05*WH),
			9:  new Phaser.Math.Vector2(WX+0.10*WW, WY+0.25*WH),
			10: new Phaser.Math.Vector2(WX+0.30*WW, WY+0.40*WH),
			11: new Phaser.Math.Vector2(WX+0.20*WW, WY+0.50*WH),
			12: new Phaser.Math.Vector2(WX+0.30*WW, WY+0.70*WH),
			13: new Phaser.Math.Vector2(WX+0.10*WW, WY+0.80*WH),
			14: new Phaser.Math.Vector2(WX+0.25*WW, WY+1.00*WH),
		};

		// Node setup
		this.webNodes = [];
		for (let i = 0; i < window.simulator2.species.length; i++) {
			const organism = window.simulator2.scenario.species[i];

			let tier = (organism.type == 'plant' ? 1 : (organism.food == 'herbivore' ? 2 : 3));
			let hasImage = !organism.image.startsWith('icon');

			let x = this.groupPositions[organism.group].x + (-1+2*Math.random()) * 100;
			let y = this.groupPositions[organism.group].y + (-1+2*Math.random()) * 100;
			let size = 20 + 20 * tier;

			let node = this.add.container(x, y);
			node.setDepth(1);
			node.setVisible(false);
			node.species = organism;

			let circle = this.add.sprite(0, 0, 'circle');
			circle.setScale(size / circle.width);
			circle.setTint(0x777777);
			circle.setAlpha(0.5);
			// circle.setVisible(tier == 1);
			node.add(circle);

			let image = this.add.sprite(0, 0, organism.image);
			// image.setTint(tier > 1 ? 0xFFFFFF : 0x777777);
			image.setAlpha(hasImage ? 1.0 : 0.5);
			image.setScale((hasImage ? 1.0 : 0.8) * size / image.width);
			node.image = image;
			node.add(image);

			// node.origSize = size;
			// node.setAlpha(tier > 1 ? 1.0 : 0.5);
			// node.setVisible(false);

			node.velocity = new Phaser.Math.Vector2(0, 0);

			image.setInteractive({ useHandCursor: true })
				.on('pointerup', () => {
					this.selectedWebNode = (this.selectedWebNode != node) ? node : null;
				});

			this.webNodes.push(node);
		}

		this.webGraphics = this.add.graphics();


		// Empty nodes

		this.fakeNodes = {
			carnivore_1:	new FakeNode(this, 0.49 * this.W, 0.15 * this.H, "node_carnivore"),
			herbivore_1:	new FakeNode(this, 0.62 * this.W, 0.40 * this.H, "node_herbivore"),
			plant_1:		new FakeNode(this, 0.53 * this.W, 0.65 * this.H, "node_plant"),

			carnivore_2:	new FakeNode(this, 0.32 * this.W, 0.15 * this.H, "node_carnivore"),
			herbivore_2:	new FakeNode(this, 0.38 * this.W, 0.40 * this.H, "node_herbivore"),
			plant_2:		new FakeNode(this, 0.27 * this.W, 0.65 * this.H, "node_plant"),
			plant_3:		new FakeNode(this, 0.75 * this.W, 0.65 * this.H, "node_plant"),
		};


		// Node-fake relations

		for (const node of this.nodes) {
			if (node.role) {
				this.fakeNodes[node.role].addReplacement(node);
			}

			// this.nodeMap[key].fake = this.fakeNodes[key];
			// this.fakeNodes[key].node = this.nodeMap[key].fake;
		}


		// Paths

		this.paths = [];
		for (const node of this.nodes) {
			for (const other of this.nodes) {
				if (node != other && node.role && other.role) {
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
						// console.log(node.species.name, '->', other.species.name, '=', amount.toFixed(1));
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


		// Graph

		this.graph = new Graph(this, 360, 160);
		this.graph.setPosition((0.5+0.25) * this.graph.width, sbY + 0.03*this.graph.height);


		// Warning popup

		this.warnCont = this.add.container(200, 200);
		this.warnCont.setAlpha(0);
		this.warnCont.setDepth(1);
		this.warnCont.isActive = false;

		this.warnText = createText(this, 0, 0, 24, "#ffffff", "Warning text");
		this.warnText.setOrigin(0.5);
		this.warnText.setLineSpacing(10);
		language.bind(this.warnText, "warning_1");
		this.warnCont.add(this.warnText);

		let wbSep = 1.5*24;
		let wbW = this.warnText.displayWidth + wbSep;
		let wbH = this.warnText.displayHeight + wbSep;
		this.warnBox = this.add.rexRoundRectangle(0, 0, wbW, wbH, 5, 0X555555);
		this.warnBox.setAlpha(0.5);
		this.warnBox.setOrigin(0.5);
		this.warnCont.add(this.warnBox);
		this.warnCont.sendToBack(this.warnBox);


		this.startStory(1);
	}

	drawWeb() {
		this.webGraphics.clear();
		if (this.currentStory > 0) {
			return;
		}

		for (const node of this.webNodes) {
			let diet = node.species.diet.map(x => x.node.id);

			for (const other of this.webNodes) {
				if (node != other && diet.includes(other.species.id)) {
					// console.log(node.species.name, '->', other.species.name);

					let active = (node == this.selectedWebNode || other == this.selectedWebNode);
					let thickness = active ? 4.0 : 1.0;
					let alpha = active ? 0.75 : 0.1;
					this.webGraphics.lineStyle(thickness, 0XFFFFFF, alpha);
					// this.webGraphics.setBlendMode(Phaser.BlendModes.ADD);

					// node.setScale((active ? 2 : 1) * node.origSize / node.width);
					// other.setScale((active ? 1.5 : 1) * node.origSize / node.width);

					let curve = new Phaser.Curves.Line(node, other);
					curve.draw(this.webGraphics);
				}
			}
		}
	}

	update(time, deltaMs) {
		let delta = deltaMs / 1000;

		if (this.timeStamp < window.simulator2.time) {
			let x = (this.timeStamp - (window.simulator2.time - window.simulator2.simTime)) / window.simulator2.simTime;
			let fac = 1 - Math.pow(x, 2);
			this.timeStamp += Math.max(0.05 * fac, 0.01);
			this.timeStamp = Math.min(this.timeStamp, window.simulator2.time);
			this.updatePopulations();
			this.graph.draw(this.timeStamp);
		}

		this.graph.update(time, delta);

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



		// Boids
		if (this.currentStory > 0) {
			for (const node of this.nodes) {
				if (node.inPlay && node.stick) {
					let cohSum = new Phaser.Math.Vector2();
					let cohCount = 0;
					let sepSum = new Phaser.Math.Vector2();

					for (const other of this.nodes) {
						let dist = Phaser.Math.Distance.BetweenPoints(node, other);

						let cohRad = 10000;
						// if (dist < cohRad && node.species.group == other.species.group) {
							cohSum.add(other);
							cohCount++;
						// }

						let sepRad = node.circle.image.displayWidth/2 + other.circle.image.displayWidth/2;
						sepRad *= 1.2;
						if (dist < sepRad) {
							let temp = new Phaser.Math.Vector2(node.x, node.y);
							temp.subtract(other);
							temp.scale(Math.pow((sepRad - dist) / sepRad, 1.1));
							sepSum.add(temp);
						}
					}

					let goalPos = new Phaser.Math.Vector2(this.fakeNodes[node.role].x, this.fakeNodes[node.role].y);
					goalPos.y += 7*Math.sin(time/1500+goalPos.x/400+goalPos.y/1000);
					goalPos.subtract(node);
					goalPos.scale(this.storyRunning ? 0 : 0.001);
					node.velocity.add(goalPos);

					// cohSum.scale(1/cohCount);
					// cohSum.subtract(node);
					// cohSum.scale(0.01);
					// node.velocity.add(cohSum);

					sepSum.scale(0.02);
					node.velocity.add(sepSum);

					node.velocity.scale(0.95);
					node.goalX += node.velocity.x;
					node.goalY += node.velocity.y;

					if (node.goalX < node.limitLeft) {
						node.goalX = node.limitLeft;
						node.velocity.x *= -1;
					}
					if (node.goalY < node.limitTop) {
						node.goalY = node.limitTop;
						node.velocity.y *= -1;
					}
					if (node.goalX > node.limitRight) {
						node.goalX = node.limitRight;
						node.velocity.x *= -1;
					}
					if (node.goalY > node.limitBottom) {
						node.goalY = node.limitBottom;
						node.velocity.y *= -1;
					}

					node.stickX = node.goalX;
					node.stickY = node.goalY;
				}
			}
		}



		// Boids
		if (this.currentStory == 0) {
			for (const node of this.webNodes) {
				let cohSum = new Phaser.Math.Vector2();
				let cohCount = 0;
				let sepSum = new Phaser.Math.Vector2();

				for (const other of this.webNodes) {
					let dist = Phaser.Math.Distance.BetweenPoints(node, other);

					let cohRad = 10000;
					// if (dist < cohRad && node.species.group == other.species.group) {
						cohSum.add(other);
						cohCount++;
					// }

					let sepRad = node.image.displayWidth/2 + other.image.displayWidth/2;
					sepRad *= 1.1;
					if (dist < sepRad) {
						let temp = new Phaser.Math.Vector2(node.x, node.y);
						temp.subtract(other);
						temp.scale(Math.pow((sepRad - dist) / sepRad, 2));
						sepSum.add(temp);
					}
				}

				let goalPos = this.groupPositions[node.species.group].clone();
				goalPos.y += 7*Math.sin(time/1500+goalPos.x/400+goalPos.y/1000);
				goalPos.subtract(node);
				goalPos.scale(0.001);
				node.velocity.add(goalPos);

				// cohSum.scale(1/cohCount);
				// cohSum.subtract(node);
				// cohSum.scale(0.01);
				// node.velocity.add(cohSum);

				sepSum.scale(0.2);
				node.velocity.add(sepSum);

				node.velocity.scale(0.95);
				node.x += node.velocity.x;
				node.y += node.velocity.y;

				if (node.x < 100) {
					node.x = 100;
					node.velocity.x *= -1;
				}
				if (node.y < 100) {
					node.y = 100;
					node.velocity.y *= -1;
				}
				if (node.x > this.W - 100) {
					node.x = this.W - 100;
					node.velocity.x *= -1;
				}
				if (node.y > this.H - 100) {
					node.y = this.H - 100;
					node.velocity.y *= -1;
				}
			}
		}

		this.drawWeb();
	}


	startStory(number) {
		this.dismissWarning();

		let selectedChapter = number > 0 ? 0 : 2;

		for (var i = this.chapterTabs.length - 1; i >= 0; i--) {
			this.chapterTabs[i].setAlpha(i == selectedChapter ? 1.0 : 0.5);
		}

		if (number == 0) {
			this.sidebarBg.setVisible(false);
			this.graph.setVisible(false);
			for (const node of this.webNodes) {
				node.setVisible(true);
			}
		}
		else {
			this.sidebarBg.setVisible(true);
			this.graph.setVisible(true);
			for (const node of this.webNodes) {
				node.setVisible(false);
			}
		}

		this.storyRunning = true;
		this.currentStory = number;

		this.instructionText.setVisible(true);
		this.nextButton.setVisible(false);
		this.nextText.setVisible(false);
		this.storyText1.setVisible(false);
		this.storyText2.setVisible(false);

		if (number == 0) {
			this.instructionText.setText("");
			for (const node of this.nodes) {
				node.setVisible(false);
			}
			for (const key in this.fakeNodes) {
				this.fakeNodes[key].setVisible(false);
			}
		}
		else if (number == 1) {
			// this.instructionText.setText("Build a food chain by placing the plants and animals");//("Place the plants and animals at the right slots in the food chain");
			language.bind(this.instructionText, "instruction_1");
			for (const node of this.nodes) {
				node.setVisible(this.story1.includes(node.role));
			}
			for (const key in this.fakeNodes) {
				this.fakeNodes[key].setVisible(this.story1.includes(key));
			}
		}
		else if (number == 2) {
			language.bind(this.instructionText, "instruction_2");
			// this.instructionText.setText("Now, expand the food chain with more species to build a food web"); // "Place the plants and animals at the right slots in the food web"
			for (const node of this.nodes) {
				node.setVisible(this.story2.includes(node.role));
			}
			for (const key in this.fakeNodes) {
				this.fakeNodes[key].setVisible(this.story2.includes(key));
			}
		}
		else {
			language.bind(this.instructionText, "instruction_4");
			this.instructionText.setText();
			for (const node of this.nodes) {
				node.setVisible(this.story2.includes(node.role));
			}
			for (const key in this.fakeNodes) {
				this.fakeNodes[key].setVisible(false);
			}
		}

		// Move nodes to slots
		for (const node of this.nodes) {
			if (node.requiresSlot()) {
				this.assignNodeToSlot(node, true);
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
			// this.storyText1.setText("You have created a food chain!");
			language.bind(this.storyText1, "explanation_1a");
			// this.storyText2.setText("The energy flows from the plant to the herbivore to the carnivore"); // The herbivore eats the plant, and the carnivore eats the herbivore.
			language.bind(this.storyText2, "explanation_1b");
		}
		else if (this.currentStory == 2) {
			// this.storyText1.setText("You have created a food web!");
			language.bind(this.storyText1, "explanation_2a");
			// this.storyText2.setText("Animals prefer some food over other, which makes more energy flow that way");
			language.bind(this.storyText2, "explanation_2b");
		}
	}


	reset() {
		for (const node of this.nodes) {
			// this.updateSize(node, -node.size);
			node.resetPosition(false);
		}
		this.timeStamp = 0;
		this.graph.draw(this.timeStamp);

		window.simulator2.reset();
		window.simulator2.run(0);
		this.updatePaths();
		this.dismissWarning();
		this.startStory(1);
	}

	onNodePlusMinus(node, value) {
		this.timeStamp = window.simulator2.time;
		window.simulator2.changeGrowthRate(node.species, value);
		window.simulator2.run(this.timeStamp);
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

	onNodeDeath(node) {
		if (this.storyRunning) {
			this.showWarning(node.x, node.y, "warning_1");
		}
	}

	showWarning(x, y, key) {
		if (!this.warnCont.isActive) {
			let w = this.warnBox.displayWidth;
			let h = this.warnBox.displayHeight;
			let offset = 20;
			let isOutside = (x - 1.7*w < 0);

			this.warnCont.isActive = true;
			this.warnCont.dir = (isOutside ? 1 : -1);
			this.warnCont.setAlpha(0);
			this.warnCont.setPosition(
				x + this.warnCont.dir * ( 0.7 * w + offset ),
				y
			);

			this.warnCont.tween = this.tweens.add({
				targets: this.warnCont,
				alpha: { from: 0, to: 1 },
				x: (this.warnCont.dir == 1 ? '-' : '+') + '=' + offset,
				ease: 'Cubic',
				duration: 800
			});

			// May lead to sizing issues
			language.bind(this.warnText, key);
		}
	}

	dismissWarning() {
		if (this.warnCont.isActive) {
			let w = this.warnBox.displayWidth;
			let offset = 10;

			if (this.warnCont.tween) {
				this.warnCont.tween.stop();
			}

			this.tweens.add({
				targets: this.warnCont,
				alpha: { from: this.warnCont.alpha, to: 0 },
				x: (this.warnCont.dir == 1 ? '+' : '-') + '=' + offset,
				ease: 'Cubic.In',
				duration: 300
			});

			this.warnCont.isActive = false;
		}
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

	assignNodeToSlot(node, forceMove=false) {
		for (let i = 0; i < this.nodeSlots.length; i++) {
			let slot = this.nodeSlots[i];

			if (!slot.taken) {
				slot.taken = true;
				node.assignSlot(slot.x, slot.y, i, forceMove);
				break;
			}
		}
	}

	removeNodeFromSlot(node, index) {
		this.nodeSlots[index].taken = false;
	}

	onNodeAddOrRemove(node, active, manually) {
		// Causes an ugly jump
		// this.timeStamp = window.simulator2.time;

		window.simulator2.population = window.simulator2.sol.at(this.timeStamp);
		window.simulator2.addOrRemoveSpecies(node.species, active);

		if (manually) {
			window.simulator2.run(this.timeStamp);
			this.updatePaths();
		}
		this.updatePopulations();

		if (this.storyRunning) {
			let success = true;
			for (const node of this.nodes) {
				if ( (this.currentStory == 1 && this.story1.includes(node.role)) || (this.currentStory == 2 && this.story2.includes(node.role)) ) {
					if (!node.inPlay) {
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
		let populations = window.simulator2.getPopulationAt(this.timeStamp);

		for (let i = 0; i < this.nodes.length; i++) {
			let node = this.nodes[i];
			let index = node.index;

			if (node.inPlay) {
				node.setPopulation(populations[index]);

				// Automatically kill node
				// if (!node.alive) {
					// node.resetPosition(false);
				// }
			}
			else {
				this.nodes[i].circle.setScale(1);
			}
		}
	}

	addPath(node1, node2, amount) {
		let path = new Path(this, node1, node2, amount);
		this.paths.push(path);
		node1.neighbours.push({node:node2, value:amount});
		node2.neighbours.push({node:node1, value:-amount});
	}

	updatePaths() {
		for (let i in this.nodes) {
			for (let j in this.nodes) {

				// Update path thickness
				for (const path of this.paths) {
					if (path.node1 == this.nodes[i] && path.node2 == this.nodes[j]) {
						let value = window.simulator2.interactionMatrix[path.node1.index][path.node2.index];
						path.lineThickness = (path.node2.species.type == 'plant' ? 3 : 2) * value;
						path.dotDensity = path.node2.species.type == 'plant' ? 1.1 : 0.6;
					}
				}
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
class LevelScene2 extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene2'});

		this.pauseOptions = [
			["Spela Vidare", () => {
				this.pauseWindow.hide();
			}],
			["Visa Uppgift", () => {
				this.pauseWindow.hide();
				this.showBriefing();
			}],
			["Gå Till Meny", () => {
				this.cameras.main.fadeEffect.start(true, 100, 0x00, 0x00, 0x00);
				this.scene.start("WorldScene");
				this.addEvent(150, function() {
					this.soundSwoosh.play();
				});
			}],
		];
	}

	create() {
		this.cameras.main.setBackgroundColor(0xFF0000);
		this.cameras.main.fadeEffect.start(false, 200, 0x00, 0x00, 0x00);

		let size = 2 * 0.8 * Math.min(this.W, this.H);


		//this.scale.lockOrientation('portrait');


		this.bg = [];
		//const images = ['bg_parallax_2', 'bg_parallax_3', 'bg_parallax_4', 'bg_parallax_5', 'bg_parallax_6', 'bg_parallax_7', 'bg_parallax_1'];
		const images = ['bg_parallax_7', 'bg_parallax_6', 'bg_parallax_5', 'bg_parallax_4', 'bg_parallax_3', 'bg_parallax_2', 'bg_parallax_1'];

		for (let i = 0; i < images.length; i++) {
			let scrollFac = 0.0 + 0.5 * Math.pow(i / images.length, 1.5); // Slow incline from 0 to 0.5
			let bg = this.add.image(0, 0, images[i]);
			bg.originalScale = 1.5 * Math.max(this.W / bg.width, this.H / bg.height);
			bg.setScale(bg.originalScale);
			let scrollX = scrollFac;//(bg.displayWidth > this.W) ? Math.min(((bg.displayWidth - this.W) / 2) / (size / 2), scrollFac) : 0;
			let scrollY = scrollFac;//(bg.displayHeight > this.H) ? Math.min(((bg.displayHeight - this.H) / 2) / (size / 2), scrollFac) : 0;
			scrollX = Math.max(scrollX, scrollY);
			scrollY = scrollX;
			bg.setPosition(
				this.CX*(1-scrollX),
				this.CY*(1-scrollY)
			);
			bg.setScrollFactor(scrollX, scrollY);
			this.bg[i] = bg;
			//this.bg.setAlpha(0.2);
			//this.bg.setScale(0.2 + 0.8*i/10);
			//this.fitToScreen(this.bg);
		}

		const top = this.bg[this.bg.length-1];
		const thickness = 1000;
		this.borders = [];
		this.borders[0] = this.add.rectangle(top.x, top.y-top.displayHeight/2, top.displayWidth+thickness, thickness, 0x23213d);
		this.borders[0].setOrigin(0.5, 1.0);
		this.borders[1] = this.add.rectangle(top.x, top.y+top.displayHeight/2, top.displayWidth+thickness, thickness, 0x23213d);
		this.borders[1].setOrigin(0.5, 0.0);
		this.borders[2] = this.add.rectangle(top.x-top.displayWidth/2, top.y, thickness, top.displayHeight+thickness, 0x23213d);
		this.borders[2].setOrigin(1.0, 0.5);
		this.borders[3] = this.add.rectangle(top.x+top.displayWidth/2, top.y, thickness, top.displayHeight+thickness, 0x23213d);
		this.borders[3].setOrigin(0.0, 0.5);
		for (let i in this.borders) {
			this.borders[i].setScrollFactor(top.scrollFactorX, top.scrollFactorY);
		}


		let box = this.add.rectangle(0, 0, size, size, 0xFFFFFF);
		box.setAlpha(0.0);


		this.cameraCenter = new Phaser.Math.Vector2(3/4*this.CX, this.CY);
		this.cameraCenterDebug = this.add.circle(this.cameraCenter.x, this.cameraCenter.y, this.W*0.003, 0xAAAAAA);
		this.cameraCenterDebug.setDepth(1000);
		this.cameraCenterDebug.setScrollFactor(0);
		this.cameraCenterDebug.setBlendMode(Phaser.BlendModes.SCREEN);
		window.a = this.cameraCenterDebug;
		this.cameras.main.setScroll(-this.cameraCenter.x, -this.cameraCenter.y);
		this.limitSize = size;

		let camX = size * (-0.5 + (window.simulator.scenario.cameraPos.x / 100));
		let camY = size * (-0.5 + (window.simulator.scenario.cameraPos.y / 100));
		this.cameras.main.scrollX = camX - this.cameraCenter.x;
		this.cameras.main.scrollY = camY - this.cameraCenter.y;

		this.dragEnabled = true;
		this.drag = new Phaser.Math.Vector2(0, 0);
		this.centerGoal = this.cameraCenter.clone();


		this.nodes = [];
		this.selectedNode = null;
		for (let i in window.simulator.scenario.species) {
			const organism = window.simulator.scenario.species[i];

			let x = size * (-0.5 + (organism.x / 100));
			let y = size * (-0.5 + (organism.y / 100));

			let s = organism;
			this.nodes[i] = new Node(this, x, y, s);
			this.nodes[i].setScale(0.1*size/this.nodes[i].circle.width);
			this.nodes[i].setDepth(1);
			this.nodes[i].on('onClick', this.clickNode, this);
		}

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
					if (eats) {
						let path = new Path(this, node, other, amount);
						this.paths.push(path);
						node.neighbours.push(other);
						other.neighbours.push(node);

						if (node.visibility == "explored" && other.visibility == "unexplored") {
							other.setVisibility("explorable");
						}
					}
				}
			}
		}


		/* UI windows */

		this.frame = this.add.image(this.CX, this.CY, 'frame_ui');
		this.frame.setScrollFactor(0);
		this.frame.setDepth(1000);
		this.fitToScreen(this.frame);

		const UI_SEP = 0.01 * this.H;
		const UI_WIDTH = 0.26 * this.W;
		const UI_HEIGHT = (this.H - 5 * UI_SEP) / 4;

		this.timeController = new TimeController(this, UI_WIDTH, UI_HEIGHT);
		this.timeController.setPosition(
			this.W - UI_WIDTH/2 - UI_SEP + 60,
			this.H - UI_HEIGHT/2 - UI_SEP + 50
		);
		this.timeController.setDepth(2000);
		this.timeController.setAlpha(0.01);
		this.timeController.on('onTimeChange', function() {
			this.graph.draw(this.timeController.time);
			this.timeAxis.draw(this.timeController.time);
			this.updateNodePopulation();
			this.infoPanel.updateButtons(this.timeController.running, this.timeController.time, this.budget);

			for (const node of this.nodes) {
				node.updateProgress(this.timeController.time);
			}
		}, this);
		this.timeController.on('onSectionStart', function() {
			for (let i = this.nodes.length - 1; i >= 0; i--) {
				this.nodes[i].startExploration(this.timeController.section);
				this.nodes[i].availableCheck(true, this.research);
			}
		}, this);
		this.timeController.on('onSectionComplete', function(hasReward) {
			if (hasReward) {
				this.setBudget(this.budget + window.simulator.scenario.budgetReward);
				this.setResearch(this.research + window.simulator.scenario.researchReward);
			}
			for (let i = this.nodes.length - 1; i >= 0; i--) {
				this.nodes[i].availableCheck(false, this.research);
			}
		}, this);

		this.graph = new Graph(this, UI_WIDTH, UI_HEIGHT);
		this.graph.setPosition(
			// this.W - UI_WIDTH/2 - UI_SEP,
			// this.H - UI_HEIGHT*3/2 - 2*UI_SEP
			UI_WIDTH/2 + UI_SEP,
			UI_HEIGHT/2 + UI_SEP
		);

		this.infoPanel = new InfoPanel(this, UI_WIDTH, 2*UI_HEIGHT + UI_SEP);
		this.infoPanel.setPosition(
			this.W - UI_WIDTH/2 - UI_SEP,
			this.H - UI_HEIGHT*6/2 - 3.5*UI_SEP
		);

		const UI_BUTTON_SIZE = 0.075 * this.W;
		const UI_AXIS_WIDTH = 0.5 * this.W;
		const UI_AXIS_HEIGHT = 0.5 * 0.8 * UI_BUTTON_SIZE;

		this.timeAxis = new TimeAxis(this, UI_AXIS_WIDTH, UI_AXIS_HEIGHT);
		this.timeAxis.setPosition(
			//UI_BUTTON_SIZE + (this.W - UI_WIDTH - 2*UI_SEP - UI_BUTTON_SIZE) / 2,
			this.W / 2,
			UI_AXIS_HEIGHT/2 + UI_SEP
		);
		this.timeAxis.setScale(0.8);


		/* Briefing window */

		this.briefingWindow = new BriefingWindow(this, 0.8 * this.W, 0.8 * this.H);
		this.briefingWindow.setPosition(
			this.W / 2,
			this.H / 2
		);
		this.briefingWindow.setDepth(1000);
		this.briefingWindow.hide();
		this.briefingWindow.setScrollFactor(0);
		this.add.existing(this.briefingWindow);

		this.addEvent(1000, () => {
			// this.showBriefing();
		});

		this.timeController.on('onTimeEnd', function() {
			// this.showDebriefing();
		}, this);


		/* Reward window */

		this.rewardWindow = new RewardWindow(this, 0.55 * this.W, 0.95 * this.H);
		this.rewardWindow.setPosition(
			this.W / 2,
			this.H / 2
		);
		this.rewardWindow.setDepth(1000);
		this.rewardWindow.hide();
		this.rewardWindow.setScrollFactor(0);
		this.add.existing(this.rewardWindow);

		//this.showReward(window.simulator.scenario.species[6]);


		/* Pause menu */

		this.back = new SymbolButton(this, this.W - UI_BUTTON_SIZE/2.5, UI_BUTTON_SIZE/2.5, 'symbol_menu', 0.8 * UI_BUTTON_SIZE, () => {
			this.pauseWindow.show();
		});
		this.back.setScrollFactor(0);
		this.back.setAlpha(0.01);
		this.add.existing(this.back);

		this.pauseWindow = new PauseWindow(this, this.CX, this.CY, this.pauseOptions);
		this.pauseWindow.setDepth(1000);
		this.pauseWindow.hide();
		this.pauseWindow.setScrollFactor(0);
		this.add.existing(this.pauseWindow);


		this.budget = 0;
		this.setBudget(window.simulator.scenario.budget);
		this.research = 0;
		this.setResearch(window.simulator.scenario.research);
		this.updateNodePopulation();


		/* Sounds */

		this.soundSwoosh = this.sound.add('ui_menu_swoosh');
		this.soundSwoosh.setVolume(1.0);


		/* Testing */

		// console.log(this.scale.orientation);
		// this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
			// console.log('scroll', pointer.event);
			//pointer.event.stopPropagation();
		// });
		this.input.keyboard.on('keydown-ONE', function (event) {
			this.setCameraCenter(this.CX/2, this.CY);
		}, this);
		this.input.keyboard.on('keydown-TWO', function (event) {
			this.setCameraCenter(this.CX, this.CY);
		}, this);
		this.input.keyboard.on('keydown-THREE', function (event) {
			this.setCameraZoom(0);
		}, this);
		this.input.keyboard.on('keydown-FOUR', function (event) {
			this.setCameraZoom(1);
		}, this);
		this.input.keyboard.on('keydown-FIVE', function (event) {
			this.timeController.setVisible(true);
			// this.graph.setVisible(true);
			// this.infoPanel.setVisible(true);
			this.timeAxis.setVisible(true);
			this.frame.setVisible(true);
		}, this);
		this.input.keyboard.on('keydown-SIX', function (event) {
			this.timeController.setVisible(false);
			// this.graph.setVisible(false);
			// this.infoPanel.setVisible(false);
			this.timeAxis.setVisible(false);
			this.frame.setVisible(false);
		}, this);
		this.infoPanel.setVisible(false);
		this.graph.setVisible(false);
		this.setCameraCenter(this.CX, this.CY);
	}

	update(time, deltaMs) {
		let delta = deltaMs / 1000;
		this.handleCamera();

		if (!this.hasGUIOpen()) {
			this.timeController.update(time, delta);
		}
		this.graph.update(time, delta);
		this.timeAxis.update(time, delta);

		for (let i = this.nodes.length - 1; i >= 0; i--) {
			//let s = 0.01 * Math.sin(this.time.now / 1000 + 2*Math.PI * i/window.simulator.species.length + this.slider.value*20);
			//this.nodes[i].setWiggle(s);
			this.nodes[i].update(time, delta);
		}

		if (this.selectedNode && this.isDragging) {
			var d = Phaser.Math.Distance.Between(this.selectedNode.x, this.selectedNode.y, this.cameras.main.scrollX+this.cameraCenter.x, this.cameras.main.scrollY+this.cameraCenter.y);
			if (d > 2 * this.selectedNode.circle.width/2) {
				this.selectedNode.setSelected(false);
				this.selectedNode = null;
				this.infoPanel.selectNode(null);
			}
		}

		for (let i = this.paths.length - 1; i >= 0; i--) {
			this.paths[i].update(time, delta);
		}
	}

	handleCamera() {
		if (this.dragEnabled && this.input.activePointer.isDown) {
			if (this.origDragPoint) {
				let drag = this.origDragPoint.clone();
				drag.subtract(this.input.activePointer.position);
				if (this.isDragging || drag.length() > 10) {
					this.isDragging = true;
					this.drag.x = drag.x;
					this.drag.y = drag.y;
				}
			}
			if (!this.origDragPoint || this.isDragging) {
				this.origDragPoint = this.input.activePointer.position.clone();
			}
		}
		else {
			this.origDragPoint = null;
			this.isDragging = false;
			let limitX = Phaser.Math.Clamp(this.cameras.main.scrollX, -this.cameraCenter.x-this.limitSize/2, -this.cameraCenter.x+this.limitSize/2);
			let limitY = Phaser.Math.Clamp(this.cameras.main.scrollY, -this.cameraCenter.y-this.limitSize/2, -this.cameraCenter.y+this.limitSize/2);
			this.drag.x += 0.1 * (limitX - this.cameras.main.scrollX);
			this.drag.y += 0.1 * (limitY - this.cameras.main.scrollY);
		}

		let limitX = Phaser.Math.Clamp(this.cameras.main.scrollX, -this.cameraCenter.x-this.limitSize/2, -this.cameraCenter.x+this.limitSize/2);
		let limitY = Phaser.Math.Clamp(this.cameras.main.scrollY, -this.cameraCenter.y-this.limitSize/2, -this.cameraCenter.y+this.limitSize/2);
		let facX = Math.pow(1.05, -Math.abs(this.cameras.main.scrollX - limitX));
		let facY = Math.pow(1.05, -Math.abs(this.cameras.main.scrollY - limitY));

		this.cameras.main.scrollX += (((this.drag.x ^ (limitX - this.cameras.main.scrollX)) < 0) ? facX : 1) * this.drag.x;
		this.cameras.main.scrollY += (((this.drag.y ^ (limitY - this.cameras.main.scrollY)) < 0) ? facY : 1) * this.drag.y;

		this.drag.x *= 0.675;
		this.drag.y *= 0.675;


		let centerVel = this.centerGoal.clone();
		centerVel.subtract(this.cameraCenter);
		centerVel.scale(1 - 0.675);
		this.cameras.main.scrollX -= centerVel.x;
		this.cameras.main.scrollY -= centerVel.y;
		this.cameraCenter.add(centerVel);
		this.cameraCenterDebug.setPosition(this.cameraCenter.x, this.cameraCenter.y);



		//this.cameras.main.scrollX += 0.1 * (0 - this.cameras.main.scrollX);
		//this.cameras.main.scrollY += 0.1 * (0 - this.cameras.main.scrollY);

		// scroll the texture of the tilesprites proportionally to the camera scroll
		for (const bg of this.bg) {
			bg.setScale(bg.originalScale / (bg.scrollFactorX + this.cameras.main.zoom - bg.scrollFactorX*this.cameras.main.zoom));
			//this['bg'+i].tilePositionX = this.cameras.main.scrollX * (i/200);
			//this['bg'+i].tilePositionY = this.cameras.main.scrollY * (i/200);
		}
		const top = this.bg[this.bg.length-1];
		for (const border of this.borders) {
			border.setScale(top.scaleX);
		}
		this.timeController.setScale(1 / this.cameras.main.zoom);
		this.graph.setScale(1 / this.cameras.main.zoom);
	}

	setCameraCenter(x, y) {
		this.centerGoal.set(x, y);
		//this.cameras.main.scrollX += this.cameraCenter.x - x;
		//this.cameras.main.scrollY += this.cameraCenter.y - y;
		//this.cameraCenter.set(x, y);
		//this.cameraCenterDebug.setPosition(x, y);
	}

	setCameraFocus(x, y) {
		this.drag.x = ((x - this.cameraCenter.x) - this.cameras.main.scrollX) * (1 - 0.675);
		this.drag.y = ((y - this.cameraCenter.y) - this.cameras.main.scrollY) * (1 - 0.675);
	}

	setCameraZoom(factor) {
		this.cameras.main.zoomTo(1-0.5*factor, 100);
	}

	clickNode(node) {
		if (this.dragEnabled && !this.isDragging) {
			if (node.canExplore()) {
				this.exploreNode(node);
			}
			else {
				if (this.selectedNode) {
					this.selectedNode.setSelected(false);
				}
				this.selectedNode = node;
				this.selectedNode.setSelected(true);
				this.setCameraFocus(this.selectedNode.x, this.selectedNode.y);

				this.infoPanel.selectNode(this.selectedNode);
				this.infoPanel.updateButtons(this.timeController.running, this.timeController.time, this.budget);
				this.graph.draw(this.timeController.time);

				this.exploreNode(node);
			}
		}
	}

	setBudget(value) {
		this.budget = value;
		this.timeController.onBudgetUpdate(value);
		this.infoPanel.updateButtons(this.timeController.running, this.timeController.time, this.budget);
	}

	setResearch(value) {
		this.research = value;
		this.timeController.onResearchUpdate(value);
		for (const node of this.nodes) {
			node.availableCheck(this.timeController.running, value);
		}
	}

	purchaseAction(event) {
		if (this.budget >= event.cost) {
			window.simulator.setEvent(event, this.timeController.time);
			window.simulator.refresh();
			this.infoPanel.updateLockTime();
			this.setBudget(this.budget - event.cost);
		}
	}

	exploreNode(node) {
		if (this.timeController.running) {
			return;
		}

		// Upon clicking researched node
		if (node.exploreState == "finished") {

			this.dragEnabled = false;
			this.addEvent(600, function() {
				node.finishExploration();
				this.toggleTracking(node.species);
				this.infoPanel.selectNode(node);

				// for (const other of this.nodes) {
				// 	other.resetExploration(this.timeController.time);
				// }
				for (const neighbour of node.neighbours) {
					if (neighbour.visibility == "unexplored") {
						neighbour.setVisibility("explorable");
					}
				}

				this.addEvent(500, function() {
					this.dragEnabled = true;
					this.showReward(node.species);
				});
			});

		}
		// Upon clicking unexplored node
		else {
			if (this.research > 0 || node.exploreQueued) {
				let cost = node.toggleExploration();
				this.setResearch(this.research - cost);
			}
		}
	}

	toggleTracking(species) {
		species.showGraph = !species.showGraph;
		this.graph.draw(this.timeController.time);
		this.infoPanel.onToggleUpdate();
	}

	updateNodePopulation(immediate=false) {
		for (const node of this.nodes) {
			let pop = window.simulator.getValueAt(node.species.id, this.timeController.time);
			let der = window.simulator.getDerivativeAt(node.species.id, this.timeController.time);
			node.setPopulation(pop, der, immediate);
		}

		this.timeController.onRatingUpdate(this.checkConditions());
	}

	checkConditions() {
		const cond = window.simulator.scenario.conditions;
		for (let tier = 3; tier > 0; tier--) {
			let success = true;

			for (const id in cond[tier]) {
				const range = cond[tier][id];
				const min = range[0];
				const max = range[1];

				for (var s = 0; s < window.simulator.scenario.species.length; s += 1) {
					const node = window.simulator.scenario.species[s];
					if (node.id == id) {
						const value = window.simulator.getValueAt(node.id, this.timeController.time);
						if (value < min || value > max) {
							success = false;
							break;
						}
					}
				}

				if (id == "budget") {
					const value = this.budget;
					if (value < min || value > max) {
						success = false;
						break;
					}
				}
			}

			if (success) {
				return tier;
			}
		}
		return 0;
	}

	showBriefing() {
		const name = window.simulator.scenario.name;
		const desc = window.simulator.scenario.description;
		const buttons = [
			["OK", () => {
				this.briefingWindow.hide();
			}]
		];

		this.briefingWindow.show(name, desc, buttons);
	}

	showDebriefing() {
		const name = "Utvärdering";
		const tier = this.checkConditions();
		const desc = window.simulator.scenario.conditions[tier].description;
		const buttons = [
			["Starta Om", () => {
				this.cameras.main.fadeEffect.start(true, 100, 0x00, 0x00, 0x00);
				this.soundSwoosh.play();
				this.addEvent(150, function() {
					window.simulator.refresh();
					this.scene.restart();
				});
			}],
			["Gå Till Meny", () => {
				this.cameras.main.fadeEffect.start(true, 100, 0x00, 0x00, 0x00);
				this.soundSwoosh.play();
				this.addEvent(150, function() {
					this.scene.start("WorldScene");
				});
			}]
		];

		window.profile.completeLevel(window.simulator.scenario, tier);

		this.briefingWindow.show(name, desc, buttons);
	}

	showReward(species) {
		const buttons = [
			["OK", () => {
				this.rewardWindow.hide();
			}]
		];

		this.rewardWindow.show(species, buttons);
		window.profile.exploreNode(species);
	}

	addEvent(delay, callback) {
		return this.time.addEvent({
			delay: delay,
			callback: callback,
			callbackScope: this
		});
	}

	hasGUIOpen() {
		return this.briefingWindow.visible || this.rewardWindow.visible || this.pauseWindow.visible;
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
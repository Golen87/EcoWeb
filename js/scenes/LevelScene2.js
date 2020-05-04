class LevelScene2 extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene2'});

		this.pauseOptions = [
			["Spela Vidare", function() {
				this.pauseWindow.hide();
			}],
			["Visa Uppgift", function() {
				this.pauseWindow.hide();
				this.briefingWindow.show(web.currentScenario.name, web.currentScenario.description);
			}],
			["Gå Till Meny", function() {
				this.scene.start("WorldScene");
			}],
		];
	}

	create() {
		this.cameras.main.setBackgroundColor(0xFF0000);

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
		this.cameraCenterDebug = this.add.circle(this.cameraCenter.x, this.cameraCenter.y, this.W*0.005, 0xFF0000);
		this.cameraCenterDebug.setDepth(1000);
		this.cameraCenterDebug.setScrollFactor(0);
		this.cameras.main.setScroll(-this.cameraCenter.x, -this.cameraCenter.y);
		this.limitSize = size;

		let camX = size * (-0.5 + (web.currentScenario.cameraPos.x / 100));
		let camY = size * (-0.5 + (web.currentScenario.cameraPos.y / 100));
		this.cameras.main.scrollX = camX - this.cameraCenter.x;
		this.cameras.main.scrollY = camY - this.cameraCenter.y;

		this.dragEnabled = true;
		this.drag = new Phaser.Math.Vector2(0, 0);
		this.centerGoal = this.cameraCenter.clone();


		this.nodes = [];
		this.selectedNode = null;
		for (let i in web.currentScenario.species) {
			const organism = web.currentScenario.species[i];

			let x = size * (-0.5 + (organism.x / 100));
			let y = size * (-0.5 + (organism.y / 100));

			let s = organism;
			this.nodes[i] = new Node(this, x, y, s);
			this.nodes[i].setScale(0.1*size/this.nodes[i].circle.width);
			this.nodes[i].setDepth(1);
			this.nodes[i].on('onClick', this.clickNode, this);
		}

		this.paths = [];
		for (let i = 0; i < this.nodes.length; i++) {
			for (let j = 0; j < this.nodes.length; j++) {
				if (i != j) {
					let diet = web.species[i].diet[web.species[j].name];
					if (diet) {
						let path = new Path(this, this.nodes[i], this.nodes[j], diet);
						this.paths.push(path);
					}
				}
			}
		}


		/* Population graph */

		const UI_SEP = 0.01 * this.H;
		const UI_WIDTH = 0.26 * this.W;
		const UI_HEIGHT = (this.H - 5 * UI_SEP) / 4;

		this.timeController = new TimeController(this, UI_WIDTH, UI_HEIGHT);
		this.timeController.setPosition(
			this.W - UI_WIDTH/2 - UI_SEP,
			this.H - UI_HEIGHT/2 - UI_SEP
		);
		this.timeController.on('onChange', function() {
			this.graph.draw(this.timeController.time);
			this.updateNodePopulation();
		}, this);
		this.updateNodePopulation();

		this.graph = new Graph(this, UI_WIDTH, UI_HEIGHT);
		this.graph.setPosition(
			this.W - UI_WIDTH/2 - UI_SEP,
			this.H - UI_HEIGHT*3/2 - 2*UI_SEP
		);

		this.infoPanel = new InfoPanel(this, UI_WIDTH, 2*UI_HEIGHT + UI_SEP);
		this.infoPanel.setPosition(
			this.W - UI_WIDTH/2 - UI_SEP,
			this.H - UI_HEIGHT*6/2 - 3.5*UI_SEP
		);

		this.budget = 0;
		this.setBudget(web.currentScenario.budget);


		/* Briefing window */

		this.briefingWindow = new BriefingWindow(this, 0.8 * this.W, 0.8 * this.H);
		this.briefingWindow.setPosition(
			this.W / 2,
			this.H / 2
		);
		this.briefingWindow.setDepth(1000);
		//this.briefingWindow.hide();
		this.briefingWindow.setScrollFactor(0);
		this.add.existing(this.briefingWindow);

		this.briefingWindow.show(web.currentScenario.name, web.currentScenario.description);

		this.timeController.on('onEnd', function() {
			const tier = this.checkConditions();
			const desc = web.currentScenario.conditions[tier].description;
			this.briefingWindow.show("Utvärdering", desc);
		}, this);


		/* Pause menu */

		const button_size = 0.075 * this.W;
		this.back = new SymbolButton(this, button_size/2, button_size/2, 'symbol_menu', 0.8 * button_size, () => {
			this.pauseWindow.show();
		});
		this.back.setScrollFactor(0);
		this.add.existing(this.back);

		this.pauseWindow = new PauseWindow(this, this.CX, this.CY, this.pauseOptions);
		this.pauseWindow.setDepth(1000);
		this.pauseWindow.hide();
		this.pauseWindow.setScrollFactor(0);
		this.add.existing(this.pauseWindow);


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
			this.graph.setVisible(true);
			this.infoPanel.setVisible(true);
		}, this);
		this.input.keyboard.on('keydown-SIX', function (event) {
			this.timeController.setVisible(false);
			this.graph.setVisible(false);
			this.infoPanel.setVisible(false);
		}, this);
	}

	update(time, deltaMs) {
		let delta = deltaMs / 1000;
		this.handleCamera();

		this.timeController.update(time, delta);
		this.graph.update(time, delta);

		for (let i = this.nodes.length - 1; i >= 0; i--) {
			//let s = 0.01 * Math.sin(this.time.now / 1000 + 2*Math.PI * i/web.species.length + this.slider.value*20);
			//this.nodes[i].setWiggle(s);
			this.nodes[i].update(delta);
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

	clickNode(gameObject) {
		if (this.dragEnabled && !this.isDragging) {
			if (this.selectedNode) {
				this.selectedNode.setSelected(false);
			}
			this.selectedNode = gameObject;
			this.selectedNode.setSelected(true);
			this.setCameraFocus(this.selectedNode.x, this.selectedNode.y);

			if (this.selectedNode.visibility == "unexplored") {
				this.dragEnabled = false;
				this.addEvent(600, function() {
					this.dragEnabled = true;
					this.selectedNode.holdEasing = 1;
					this.selectedNode.popEasing = 1;
					this.selectedNode.setVisibility("explored");
				});
			}

			this.infoPanel.selectNode(this.selectedNode.species);
			this.infoPanel.onBudgetUpdate(this.budget);
		}
	}

	setBudget(value) {
		this.budget = value;
		this.timeController.onBudgetUpdate(value);
		this.infoPanel.onBudgetUpdate(value);
	}

	purchaseAction(event) {
		if (this.budget >= event.cost) {
			this.setBudget(this.budget - event.cost);
			web.setEvent(event, this.timeController.time);
			web.refresh();
		}
	}

	updateNodePopulation(immediate=false) {
		for (let i = this.nodes.length - 1; i >= 0; i--) {
			let pop = web.getValueAt(i, this.timeController.time);
			this.nodes[i].setPopulation(pop, immediate);
		}

		this.timeController.onRatingUpdate(this.checkConditions());
	}

	checkConditions() {
		const cond = web.currentScenario.conditions;
		for (let tier = 3; tier > 0; tier--) {
			let success = true;

			for (const id in cond[tier]) {
				const range = cond[tier][id];
				const min = range[0];
				const max = range[1];

				for (var s = 0; s < web.currentScenario.species.length; s += 1) {
					const node = web.currentScenario.species[s];
					if (node.id == id) {
						const value = web.getValueAt(s, this.timeController.time);
						if (value < min || value > max) {
							success = false;
							break;
						}
					}
				}
			}

			if (success) {
				return tier;
			}
		}
		return 0;
	}

	addEvent(delay, callback) {
		return this.time.addEvent({
			delay: delay,
			callback: callback,
			callbackScope: this
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
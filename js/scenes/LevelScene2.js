class LevelScene2 extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene2'});
	}

	create() {
		this.cameras.main.setBackgroundColor(0x294f8c);

		let size = 2 * 0.8 * Math.min(this.W, this.H);


		//this.scale.lockOrientation('portrait');


		this.bg = [];
		//const images = ['bg_parallax_2', 'bg_parallax_3', 'bg_parallax_4', 'bg_parallax_5', 'bg_parallax_6', 'bg_parallax_7', 'bg_parallax_1'];
		const images = ['bg_parallax_6', 'bg_parallax_5', 'bg_parallax_4', 'bg_parallax_3', 'bg_parallax_2', 'bg_parallax_1'];

		for (let i = 0; i < images.length; i++) {
			let scrollFac = 0.05 + 0.5 * Math.pow(i / images.length, 1.2); // Slow incline from 0 to 0.5
			let bg = this.add.image(0, 0, images[i]);
			bg.originalScale = 1.5 * Math.max(this.W / bg.width, this.H / bg.height);
			bg.setScale(bg.originalScale);
			let scrollX = (bg.displayWidth > this.W) ? Math.min(((bg.displayWidth - this.W) / 2) / (size / 2), scrollFac) : 0;
			let scrollY = (bg.displayHeight > this.H) ? Math.min(((bg.displayHeight - this.H) / 2) / (size / 2), scrollFac) : 0;
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

		this.graph = new Graph(this);
		this.graph.setPosition(this.W-315, this.H-330);

		this.timeController = new TimeController(this, this.W-165, this.H-90);
		this.timeController.on('onChange', function() {
			this.graph.draw(this.timeController.time);
			this.updateNodePopulation();
		}, this);
		this.updateNodePopulation();


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
			this.graph.setVisible(true);
			this.timeController.setVisible(true);
		}, this);
		this.input.keyboard.on('keydown-SIX', function (event) {
			this.graph.setVisible(false);
			this.timeController.setVisible(false);
		}, this);
	}

	update(time, deltaMs) {
		let delta = deltaMs / 1000;
		this.handleCamera();

		this.timeController.update(time, delta);
		this.graph.update(time, delta);

		for (var i = this.nodes.length - 1; i >= 0; i--) {
			//let s = 0.01 * Math.sin(this.time.now / 1000 + 2*Math.PI * i/web.species.length + this.slider.value*20);
			//this.nodes[i].setWiggle(s);
			this.nodes[i].update(delta);
		}

		if (this.selectedNode && this.isDragging) {
			var d = Phaser.Math.Distance.Between(this.selectedNode.x, this.selectedNode.y, this.cameras.main.scrollX+this.cameraCenter.x, this.cameras.main.scrollY+this.cameraCenter.y);
			if (d > 4 * this.selectedNode.circle.width/2) {
				this.selectedNode.setSelected(false);
				this.selectedNode = null;
			}
		}

		for (var i = this.paths.length - 1; i >= 0; i--) {
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
		}
	}

	updateNodePopulation(immediate=false) {
		for (var i = this.nodes.length - 1; i >= 0; i--) {
			let pop = web.getValueAt(i, this.timeController.time);
			this.nodes[i].setPopulation(pop, immediate);
		}
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
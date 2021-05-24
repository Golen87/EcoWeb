class FoodWeb extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		// this.selectedWebNode = null;

		let BORDER = 200;
		let WX = BORDER;
		let WY = BORDER;
		let WW = scene.W - 2*BORDER;
		let WH = scene.H - 3*BORDER;
		let groupPositions = {
			// Carnivores
			1:  new Phaser.Math.Vector2(WX+0.95*WW, WY+0.30*WH),
			2:  new Phaser.Math.Vector2(WX+0.85*WW, WY+0.70*WH),

			// Herbivores
			3:  new Phaser.Math.Vector2(WX+0.50*WW, WY+0.10*WH),
			4:  new Phaser.Math.Vector2(WX+0.55*WW, WY+0.45*WH),
			5:  new Phaser.Math.Vector2(WX+0.50*WW, WY+0.70*WH),
			6:  new Phaser.Math.Vector2(WX+0.60*WW, WY+0.95*WH),

			// Plants
			7:  new Phaser.Math.Vector2(WX+0.10*WW, WY+0.05*WH),
			8:  new Phaser.Math.Vector2(WX+0.20*WW, WY+0.10*WH),
			9:  new Phaser.Math.Vector2(WX+0.10*WW, WY+0.30*WH),
			10: new Phaser.Math.Vector2(WX+0.20*WW, WY+0.30*WH), // 1
			11: new Phaser.Math.Vector2(WX+0.20*WW, WY+0.55*WH),
			12: new Phaser.Math.Vector2(WX+0.10*WW, WY+0.55*WH), // 1
			13: new Phaser.Math.Vector2(WX+0.10*WW, WY+0.80*WH),
			14: new Phaser.Math.Vector2(WX+0.25*WW, WY+0.95*WH), // 2
		};
		let groupColors = {
			1: 0xF44336, 2: 0xE91E63, 3: 0x9C27B0, 4: 0x673AB7, 5: 0x3F51B5, 6: 0x2196F3, 7: 0x03A9F4, 8: 0x00BCD4, 9: 0x009688, 10: 0x4CAF50, 11: 0x8BC34A, 12: 0xCDDC39, 13: 0xFFEB3B, 14: 0xFFC107
		};
		let iucnColors = {
			"null": 0x9E9E9E, CR: 0xe40521, EN: 0xeb6209, VU: 0xe29b00, NT: 0x007060, LC: 0x006d8a
		};
		let iucnTextColors = {
			"null": "#FFFFFF", CR: "#000000", EN: "#000000", VU: "#000000", NT: "#FFFFFF", LC: "#FFFFFF"
		};

		// Settings for the large web, used by nodes and changed by scene sliders
		this.config = {
			mode: 0, // Slider value to interpolate between group and link mode

			centering: 0.04, // Pull on average position towards center
			gravity: 50, // Pull towards center
			linkDistance: 150, // Distance to be maintained between nodes
			linkStrength: 0.04, // How firmly the link distance is maintained
			charge: -50, // How much nodes repel each other
			friction: 0.5, // Velocity multiplier each step
			groupStrength: 10, // Pull towards group positions

			groupPositions, // Group positions
			groupColors, // Group outline colors
			iucnColors, // IUCN endangerment colors
			iucnTextColors, // IUCN endangerment text colors
			center: new Phaser.Math.Vector2(WX+WW/2, WY+WH/2), // Center point which gravity pulls towards

			// Borders which nodes stay within
			borderLeft: -200,
			borderTop: -200,
			borderRight: scene.W + 200,
			borderBottom: scene.H + 200,
		};

		this.initNodes();
		this.initRelations();
		this.initButtons();
		this.initInfoBox();

		this.bringToTop(this.nodeContainer);
	}


	update(time, delta) {
		// this.config.mode = this.scene.V8.value;

		// this.config.gravity = this.scene.V1.value;
		// this.config.linkDistance = this.scene.V2.value;
		// this.config.linkStrength = this.scene.V3.value;
		// this.config.charge = this.scene.V4.value;
		// this.config.friction = this.scene.V5.value;
		// this.config.groupStrength = this.scene.V6.value;

		this.config.gravity = 50 - 20 * this.config.mode;
		// this.config.linkDistance = 150;
		// this.config.linkStrength = 0.04;
		this.config.charge = -50 - 50 * this.config.mode;
		// this.config.friction = 0.5;
		// this.config.groupStrength = 10;

		// Update settings tied to mode
		// this.config.gravity = 0.2 * this.config.mode;
		// this.config.linkStrength = 0.1 * this.config.mode;
		// this.config.groupStrength = 1 - this.config.mode;
		// if(link.source.selected) linkStrength += 0.45;
		// if(link.target.selected) linkStrength += 0.45;

		// this.scene.V1.value = this.config.gravity;
		// this.scene.V2.value = this.config.linkDistance;
		// this.scene.V3.value = this.config.linkStrength;
		// this.scene.V4.value = this.config.charge;
		// this.scene.V5.value = this.config.friction;
		// this.scene.V6.value = this.config.groupStrength;


		this.anyNodesSelected = false;
		this.updateNodes(time, delta);
		this.drawRelations(time, delta);

		for (const node of this.nodes) {
			node.update(time, delta);
		}

		this.nodeContainer.sort("y");
	}


	initNodes() {
		this.nodes = [];
		this.nodeContainer = this.scene.add.container(0, 0);
		this.add(this.nodeContainer);

		for (let i = 0, n = window.simulator2.scenario.species.length; i < n; i++) {

			let species = window.simulator2.scenario.species[i];
			// let x = Phaser.Math.Between(0, this.scene.W);
			// let y = Phaser.Math.Between(0, this.scene.H);
			let x = Phaser.Math.Between(this.config.borderLeft, this.config.borderRight);
			let y = (Math.random() < 1.0) ? this.config.borderTop : this.config.borderBottom;
			// let x = this.groupPositions[species.group].x + (-1+2*Math.random()) * 100;
			// let y = this.groupPositions[species.group].y + (-1+2*Math.random()) * 100;

			let node = new FoodWebNode(this.scene, x, y, species, this.config);
			this.nodeContainer.add(node);
			this.nodes.push(node);

			node.on('onSelect', (target, active) => {
				for (const node of this.nodes) {
					node._selected = false;
				}
				if (active) {
					this.setInfoBox(target);
				}
				else {
					this.clearInfoBox();
				}
			});
		}
	}

	initRelations() {
		this.relations = [];
		this.relationGraphics = this.scene.add.graphics();
		this.add(this.relationGraphics);
		this.sendToBack(this.relationGraphics);

		for (const pred of this.nodes) {
			for (const prey of this.nodes) {
				if (prey != pred) {
					for (const item of pred.species.diet) {
						if (prey.species.id == item.node.id) {
							this.addRelation(pred, prey);
							break;
						}
					}
				}
			}
		}
	}

	addRelation(pred, prey) {
		pred.neighbours.push(prey);
		prey.neighbours.push(pred);

		this.relations.push({
			pred,
			prey,
			line: new Phaser.Curves.Line(pred, prey) // Might be a hack?
		});
	}

	initButtons() {
		this.buttons = [];

		let chosen = [
			"138fc562-6fb9-45ff-bcdf-656208d2be14", // Lion
			"00107254-185b-47ab-bc45-bc68e13ace3f", // Vildhund
			"3c3f0fdf-e6c1-4a94-b52e-e3785a2849ca", // Plains zebra
			"f4f32888-4079-4c70-a204-a094647ea210", // Kirk's dik-dik
			"2dd450bc-8faa-4971-ad5d-53b04a958105", // Gnu
			// "c2d58e40-9606-4d58-9a62-dc08ccb02e2b", // Impala
			"6f868898-a03f-467b-a797-a1252e75e36c", // Vattenbock
			// "042f48d0-4a28-4e77-874f-b9a5b1f821af", // Heteropogon contortus
			"37b60be7-d897-41cb-91e5-56045687788e", // Allophylus rubifolius
			"93878dd9-1df5-4521-b5ba-57f63450e912", // Panicum coloratum
			// "93d59a4b-5517-4eb5-8e81-1caa61b9db6a", // Kängrugräs
			// "70640c68-402d-4a0b-ae47-4089329d0b01", // Fingerhirs
			"f62f5010-632f-4870-91a8-9bf4d90e961c", // Acacia
		];

		let count = 0;
		for (const id of chosen) {
			for (const node of this.nodes) {
				if (id == node.species.id) {
					let size = 50;
					let x = this.scene.CX + 1.4 * size * (count - (chosen.length-1)/2);
					let y = 0.88 * this.scene.H;

					// Colored background circle
					let circle = this.scene.add.image(x, y, 'circle');
					circle.setScale((size+6) / circle.width);
					this.add(circle);

					// Image of species (or icon if missing)
					let image = this.scene.add.image(x, y, node.species.image);
					image.setScale(size / image.width);
					this.add(image);

					node.hyperLink = circle;
					circle.setInteractive({ useHandCursor: true, draggable: true })
						.on('pointerdown', () => {
							circle._held = true;
						})
						.on('pointerout', () => {
							circle._held = false;
						})
						.on('pointerup', () => {
							if (circle._held) {
								node.selected = !node._selected;
								circle._held = false;
							}
						});

					count++;
				}
			}
		}

	}

	initInfoBox() {
		let m = 15;
		let p = 15;
		let w = 0.25 * this.scene.W;
		let h = 0.22 * this.scene.H - 2*m;
		let x = w/2 + m;
		let y = this.scene.H - h/2 - m;

		this.infoBox = this.scene.add.container(x, y);
		this.infoBox.setAlpha(0);
		this.add(this.infoBox);

		this.infoBg = this.scene.add.rexRoundRectangle(0, 0, w, h, 5, 0X222222);
		this.infoBg.setAlpha(0.5);
		this.infoBox.add(this.infoBg);

		let titleSize = 24;
		let imgFac = 1.4;

		this.infoTitle = createText(this.scene, -w/2+p, -h/2+p + 1*titleSize/2, titleSize, "#ffffff", "Title");
		this.infoTitle.setOrigin(0, 0.5);
		this.infoBox.add(this.infoTitle);

		this.infoDescription = createText(this.scene, -w/2+p, -h/2+p + (1+0.5)*titleSize, 16, "#ffffff", "Description");
		this.infoDescription.setOrigin(0);
		this.infoDescription.setWordWrapWidth(w-2*p, true);
		// this.infoDescription.setLineSpacing(10);
		this.infoBox.add(this.infoDescription);

		this.infoImage = this.scene.add.image(w/2-p, -h/2+p, "PANLEO");
		this.infoImage.setScale(imgFac*titleSize / this.infoImage.width);
		this.infoImage.setOrigin(1.0, 0.0);
		this.infoBox.add(this.infoImage);

		let size = titleSize;
		let ix = w/2-p;
		let iy = h/2-p-size/2;

		this.infoIucnBg = this.scene.add.rexRoundRectangle(ix, iy, size, size, size/2, 0xFFFFFF, 1.0);
		this.infoIucnBg.setOrigin(1.0, 0.5);
		this.infoBox.add(this.infoIucnBg);

		this.infoIucnText = createText(this.scene, ix, iy, 14, "#000000", "XX");
		this.infoIucnText.setOrigin(0.5);
		this.infoBox.add(this.infoIucnText);

		this.infoIucnStatus = createText(this.scene, ix, iy, 14, "#ffffff", "Status");
		this.infoIucnStatus.setOrigin(1.0, 0.5);
		language.bind(this.infoIucnStatus, "iucn_status");
		this.infoBox.add(this.infoIucnStatus);

		this.clearInfoBox();
	}

	setInfoBox(node) {
		// this.infoBox.setVisible(true);
		language.bind(this.infoTitle, node.species.id);
		// language.bind(this.infoDescription, "...");
		this.infoDescription.setText("Dolore in consectetur dolor sunt cupidatat mollit veniam consectetur mollit dolore velit fugiat laborum labore do do veniam.");
		// this.infoIucnText.setText(node.species.iucn);

		this.infoImage.setTexture(node.species.image);

		let key = node.species.iucn ? "iucn_" + node.species.iucn : null;
		language.bind(this.infoIucnText, key, this.resizeInfoIucn.bind(this));

		this.infoIucnText.setColor(this.config.iucnTextColors[node.species.iucn]);
		this.infoIucnBg.fillColor = this.config.iucnColors[node.species.iucn];

		this.scene.tweens.add({
			targets: this.infoBox,
			alpha: { from: this.infoBox.alpha, to: 1 },
			duration: 150
		});
	}

	clearInfoBox() {
		// this.infoBox.setVisible(false);
		this.scene.tweens.add({
			targets: this.infoBox,
			alpha: { from: this.infoBox.alpha, to: 0 },
			duration: 150
		});
	}

	resizeInfoIucn() {
		if (this.infoIucnText.displayWidth > 0) {
			this.infoIucnBg.setVisible(true);
			this.infoIucnStatus.setVisible(true);
			this.infoIucnBg.width = this.infoIucnText.width + this.infoIucnBg.height;
			this.infoIucnText.x = this.infoIucnBg.x - this.infoIucnBg.width/2;
			this.infoIucnStatus.x = this.infoIucnBg.x - this.infoIucnBg.width - this.infoIucnBg.height/4;
		}
		else {
			this.infoIucnBg.setVisible(false);
			this.infoIucnStatus.setVisible(false);
		}
	}


	updateNodes(time, delta) {
		let node1, node2;
		let n = this.nodes.length;
		let sx = 0, sy = 0;

		for (let i = 0; i < n; i++) {
			node1 = this.nodes[i];
			sx += node1.x;
			sy += node1.y;
			this.anyNodesSelected = this.anyNodesSelected || node1.selected;
		}
		sx = (sx / n - this.config.center.x) * this.config.centering * this.config.mode;
		sy = (sy / n - this.config.center.y) * this.config.centering * this.config.mode;

		for (let i = 0; i < n; i++) {
			node1 = this.nodes[i];
			node1.move(-sx, -sy);
			node1.setAlphaGoal(this.anyNodesSelected ? 0.3 : 1.0);
		}

		let pred, prey, x, y, l, count1, count2, bias;
		for (let i = 0, n = this.relations.length; i < n; i++) {
			pred = this.relations[i].pred;
			prey = this.relations[i].prey;

			// let boost = ((pred.selected && !pred._held) || prey.selected && !prey._held) ? 3 : 1;

			// x = pred.x + pred.velocity.x - prey.x - prey.velocity.x || jiggle();
			// y = pred.y + pred.velocity.y - prey.y - prey.velocity.y || jiggle();
			x = pred.x - prey.x || jiggle();
			y = pred.y - prey.y || jiggle();
			l = Math.sqrt(x * x + y * y);
			l = (l - this.config.linkDistance) / l * this.config.linkStrength * (this.config.mode*this.config.mode);
			x *= l;
			y *= l;
			count1 = pred.neighbours.length;
			count2 = prey.neighbours.length;
			// bias = count1 / (count1 + count2);
			// bias = pred.size / (pred.size + prey.size);
			bias = 0.5;

			pred.velocity.x -= x * (1 - bias);
			pred.velocity.y -= y * (1 - bias);
			prey.velocity.x += x * bias;
			prey.velocity.y += y * bias;
		}

		for (let i = 0; i < n; i++) {
			node1 = this.nodes[i];
			for (let j = i+1; j < n; j++) {
				node2 = this.nodes[j];
				let dx = node2.x - node1.x;
				let dy = node2.y - node1.y;
				let l2 = dx * dx + dy * dy; // Squared distance

				if (dx === 0) {
					dx = jiggle();
					l2 += dx * dx;
				}
				if (dy === 0) {
					dy = jiggle();
					l2 += dy * dy;
				}

				// if (l2 < 1) l2 = 1;

				node1.velocity.x += dx / l2 * this.config.charge;
				node1.velocity.y += dy / l2 * this.config.charge;
				node2.velocity.x -= dx / l2 * this.config.charge;
				node2.velocity.y -= dy / l2 * this.config.charge;

				// Separation test
				let sepRad = (node1.size/2 + node2.size/2) * 1.25;
				let l = Math.sqrt(l2);
				let sepFac = Math.pow(Math.max(0, (sepRad - l) / sepRad), 2);
				node1.velocity.x -= 1 * dx * sepFac;
				node1.velocity.y -= 1 * dy * sepFac;
				node2.velocity.x += 1 * dx * sepFac;
				node2.velocity.y += 1 * dy * sepFac;
			}
		}
	}

	drawRelations(time, delta) {
		this.relationGraphics.clear();

		for (const relation of this.relations) {
			// relation.pred
			// relation.prey
			// relation.line

			// Fixa så att alla noder döljs utan markerades grannar......

			// let active = (node == this.selectedWebNode || other == this.selectedWebNode);
			// let thickness = active ? 4.0 : 1.0;
			// let alpha = active ? 0.75 : 0.14;
			// this.relationGraphics.setBlendMode(Phaser.BlendModes.ADD);

			let visibility = relation.pred.visibility * relation.prey.visibility;
			let selected = visibility * (relation.pred.selected || relation.prey.selected);

			let strokeWidth = selected ? 2.5 : 1.5;
			let strokeColor = selected ? 0xFFFFFF : 0xFFFFFF;
			let strokeOpacity = selected ? 0.9 : 0.1 * visibility;
			this.relationGraphics.lineStyle(strokeWidth, strokeColor, strokeOpacity);

			relation.line.draw(this.relationGraphics);


			if (this.anyNodesSelected && selected) {
				relation.pred.setAlphaGoal(1.0);
				relation.prey.setAlphaGoal(1.0);
			}
		}
	}
}
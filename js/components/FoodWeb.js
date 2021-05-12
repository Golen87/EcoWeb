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
			center: new Phaser.Math.Vector2(WX+WW/2, WY+WH/2), // Center point which gravity pulls towards

			// Borders which nodes stay within
			borderLeft: -200,
			borderTop: -200,
			borderRight: scene.W + 200,
			borderBottom: scene.H + 200,
		};

		this.initNodes();
		this.initRelations();
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
	}


	initNodes() {
		this.nodes = [];
		for (let i = 0, n = window.simulator2.scenario.species.length; i < n; i++) {

			let species = window.simulator2.scenario.species[i];
			// let x = Phaser.Math.Between(0, this.scene.W);
			// let y = Phaser.Math.Between(0, this.scene.H);
			let x = Phaser.Math.Between(this.config.borderLeft, this.config.borderRight);
			let y = (Math.random() < 1.0) ? this.config.borderTop : this.config.borderBottom;
			// let x = this.groupPositions[species.group].x + (-1+2*Math.random()) * 100;
			// let y = this.groupPositions[species.group].y + (-1+2*Math.random()) * 100;

			let node = new FoodWebNode(this.scene, x, y, species, this.config);
			this.add(node);
			this.nodes.push(node);
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

			let selected = relation.pred.selected || relation.prey.selected;
			let visibility = relation.pred.visibility * relation.prey.visibility;

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
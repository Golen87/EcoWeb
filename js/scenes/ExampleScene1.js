class ExampleScene1 extends Phaser.Scene {
	constructor() {
		super({key: 'ExampleScene1'});
	}

	preload() {
		this.load.image('cat', 'assets/images/cat.jpeg');
		this.load.image('circle', 'assets/images/circle.png');
		this.load.spritesheet( 'items', 'assets/images/items.png', { frameWidth: 16, frameHeight: 16 });
	}

	create() {
		//this.scene.start("ClickScene");

		this.image = this.add.image(-400, 300, 'cat');
		this.item = this.add.image(0, 400, 'items');
		this.item.setOrigin(0, 0);
		this.item.scaleX = 0;
		this.item.scaleY = 0;

		this.circleImage = this.add.image(400, 300, 'circle');
		this.circleImage.setScale(0.4);

		//this.item.setInteractive();
		//this.item.on('pointerdown', function(pointer) {
		//	console.log('click', pointer);
		//});

		this.image.setInteractive();
		this.image.on('pointerdown', function(pointer) {
			this.setScale(0.9, 0.9);
		});

		this.input.keyboard.on('keyup_D', function(event) {
			this.image.x += 10;
		}, this);

		this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

		//this.input.on('pointerdown', function(event) {
		//	this.image.x = event.x;
		//	this.image.y = event.y;
		//}, this);

		this.input.keyboard.on('keyup_P', function(event) {
			let physicsImage = this.physics.add.image(this.image.x, this.image.y, 'cat');
			physicsImage.setVelocity(
				Phaser.Math.RND.integerInRange(-100, 100),
				-300
			);
		}, this);

		this.input.keyboard.on('keyup', function(event) {
			if (event.key == '2') {
				this.scene.start("ExampleScene2");
			}
			if (event.key == '3') {
				this.scene.start("ExampleScene3");
			}
			if (event.key == '4') {
				this.scene.start("ClickScene");
			}
		}, this);


		this.graphics = this.add.graphics();
		this.graphics.setDefaultStyles({
			lineStyle: {
				width: 1,
				color: 0xffffff,
				alpha: 1
			},
			fillStyle: {
				color: 0xffffff,
				alpha: 1
			}
		});

		this.circle = new Phaser.Geom.Circle(100, 100, 20);
		this.circle2 = new Phaser.Geom.Circle(100, 200, 40);
		this.graphics.fillCircleShape(this.circle); // circle: {x, y, radius}
		this.graphics.fillCircle(200, 100, 30);
		this.graphics.strokeCircleShape(this.circle2);  // circle: {x, y, radius}
		this.graphics.strokeCircle(200, 200, 50);
	}

	update(delta) {
		if (this.key_A.isDown) {
			this.image.x -= 1;
		}
	}
}
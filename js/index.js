var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game',
	//scale: {
	//	width: "100%",
	//	height: "100%",
	//	mode: Phaser.Scale.ScaleModes.FIT
	//},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200}
		}
	},
	scene: [
		ExampleScene1,
		ExampleScene2,
		ExampleScene3,
		ClickScene
	]
};

var game = new Phaser.Game(config);
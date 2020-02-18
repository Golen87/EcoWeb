var config = {
	type: Phaser.WEBGL,
	width: 800,
	height: 600,
	parent: 'game',
	scale: {
		mode: Phaser.Scale.FIT
		//mode: Phaser.Scale.RESIZE
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200}
		}
	},
	scene: [
		PreloadScene,
		TitleScene,
		WorldScene,
		LevelScene,

		ExampleScene1,
		ExampleScene2,
		ExampleScene3,
		ClickScene,
	]
};

var game = new Phaser.Game(config);
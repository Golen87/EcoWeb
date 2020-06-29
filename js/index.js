var config = {
	type: Phaser.WEBGL,
	width: 16*70,
	height: 9*70,
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
		LevelScene2,

		ExampleScene1,
		ExampleScene2,
		ExampleScene3,
		ClickScene,
	]
};

var game = new Phaser.Game(config);

game.font = "Mukta";
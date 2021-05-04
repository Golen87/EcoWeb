const config = {
	type: Phaser.WEBGL,
	width: 16*70*1.5,
	height: 9*70*1.5,
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
	pipeline: [
		GrayScalePostFilter,
		BlurPostFilter
	],
	scene: [
		PreloadScene,
		TitleScene,
		WorldScene,
		LevelScene,
		LevelScene2,
		LevelScene3,

		ExampleScene1,
		ExampleScene2,
		ExampleScene3,
	]
};

const game = new Phaser.Game(config);

game.font = "Mukta";
game.language = "English";
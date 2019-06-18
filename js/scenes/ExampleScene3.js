class ExampleScene3 extends Phaser.Scene {
	constructor() {
		super({key: 'ExampleScene3'});
	}

	preload() {
		this.load.audio('pop', [ 'assets/audio/pop.ogg', 'assets/audio/pop.mp3' ] );
	}

	create() {
		this.soundFX = this.sound.add('pop', { loop: true });
		this.soundFX.play();
		this.soundFX.rate = Phaser.Math.RND.realInRange(0.5, 1.5);

		this.input.keyboard.on('keydown_L', function(event) {
			this.soundFX.loop = !this.soundFX.loop;
			if (this.soundFX.loop) {
				this.soundFX.play();
			}
		}, this);

		this.input.keyboard.on("keydown_P", function(event) {
			if (this.soundFX.isPlaying) {
				this.soundFX.pause();
			} else {
				this.soundFX.resume();
			}
		}, this);

		this.input.keyboard.on('keyup', function(event) {
			if (event.key == '1') {
				this.scene.start("ExampleScene1");
			}
			if (event.key == '2') {
				this.scene.start("ExampleScene2");
			}
		}, this);
	}

	update(time, delta) {
	}
}
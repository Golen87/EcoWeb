class LevelScene extends Phaser.Scene {
	constructor() {
		super({key: 'LevelScene'});
	}

	preload() {
		this.load.image('bakgrund', 'assets/images/backgrounds/Bakgrund.png');
		this.load.image('bakrund2', 'assets/images/backgrounds/Bakrund2.png');
		this.load.image('bakrund3', 'assets/images/backgrounds/Bakrund3.png');
		this.load.image('bakrund4', 'assets/images/backgrounds/Bakrund4.png');
		this.load.image('bakrund5', 'assets/images/backgrounds/Bakrund5.png');
		this.load.image('bakrund6', 'assets/images/backgrounds/Bakrund6.png');

		this.load.image('älg', 'assets/images/icons/Älg.png');
		this.load.image('blåbär', 'assets/images/icons/Blåbär.png');
		this.load.image('fiskgjuse_lås', 'assets/images/icons/Fiskgjuse_Lås.png');
		this.load.image('fiskgjuse', 'assets/images/icons/Fiskgjuse.png');
		this.load.image('gräs', 'assets/images/icons/Gräs.png');
		this.load.image('näckros', 'assets/images/icons/Näckros.png');
		this.load.image('örter', 'assets/images/icons/Örter.png');
		this.load.image('rådjur', 'assets/images/icons/Rådjur.png');
		this.load.image('räv', 'assets/images/icons/Räv.png');
		this.load.image('skogshare', 'assets/images/icons/Skogshare.png');
		this.load.image('svamp', 'assets/images/icons/Svamp.png');
		this.load.image('träd', 'assets/images/icons/Träd.png');
		this.load.image('trollflugelarv_lås', 'assets/images/icons/Trollflugelarv_Lås.png');
		this.load.image('trollflugelarv', 'assets/images/icons/Trollflugelarv.png');
		this.load.image('varg', 'assets/images/icons/Varg.png');

		this.load.image('ui_symbol', 'assets/images/UI_Symbol.png');

		this.load.image('cat', 'assets/images/cat.jpeg');
		this.load.image('circle', 'assets/images/circle.png');
		this.load.image('image', 'assets/images/image.png');
		this.load.image('items', 'assets/images/items.png');
	}

	create() {
		this.title = this.add.text(0, 0, "Level", { font: "40px Courier" });

		let button = new TextButton(this, 100, 100, 'Back', {
			font: "30px Courier", fill: '#0f0'
		}, () => {
			this.scene.start("WorldScene");
		});
		this.add.existing(button);

		this.button = new CircleButton(this, 300, 100, () => {
			web.solve(10);
			updateChart();
		});
		this.add.existing(this.button);
	}

	update(delta) {
	}
}
class PreloadScene extends Phaser.Scene {
	constructor() {
		super({key: 'PreloadScene'});
	}

	preload() {
		initWeb();

		this.loading = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Loading...", { font: "20px Courier" });
		this.loading.setOrigin(0.5);

		this.load.image('bg_title', 'assets/images/background/BgTitel.png');
		this.load.image('bg_world', 'assets/images/background/BgVärld.png');
		this.load.image('bg_1', 'assets/images/background/BG1.png');
		this.load.image('bg_2', 'assets/images/background/BG2.png');


		/* Menu */		
		this.load.image('menu_line', 'assets/images/ui/menu/Line.png');
		this.load.image('menu_bar', 'assets/images/ui/menu/Bar.png');
		this.load.image('menu_bar_hover', 'assets/images/ui/menu/BarMouseover.png');

		this.load.image('pause_window', 'assets/images/ui/pause/Bas.png');
		this.load.image('pause_button', 'assets/images/ui/pause/Knapp.png');
		this.load.image('pause_button_hover', 'assets/images/ui/pause/KnappMouseover.png');


		/* UI */
		this.load.image('checkbox', 'assets/images/ui/checkbox/CheckBox.png');
		this.load.image('checkmark', 'assets/images/ui/checkbox/Checkmark.png');

		this.load.image('symbol_button', 'assets/images/ui/button/HändelseNod.png');

		this.load.image('time_bar', 'assets/images/ui/time/TidsAxelBar.png');
		this.load.image('time_background', 'assets/images/ui/time/TidsAxel.png');
		this.load.image('time_button', 'assets/images/ui/time/Timglas.png');
		this.load.image('time_button_arrows', 'assets/images/ui/time/TimglasMedPil.png');

		this.load.image('socket_button', 'assets/images/ui/socket/button.png');
		this.load.image('socket_socket', 'assets/images/ui/socket/socket.png');
		this.load.image('socket_mask', 'assets/images/ui/socket/mask.png');

		this.load.image('growth_slider', 'assets/images/ui/growth_slider/Matare.png');
		this.load.image('growth_slider_arrow', 'assets/images/ui/growth_slider/Vippa.png');


		/* Nodes */
		this.load.image('circle', 'assets/images/circle.png');
		this.load.image('pixel', 'assets/images/pixel.png');
		this.load.image('arrow', 'assets/images/arrow.png');

		this.load.image('missing', 'assets/images/icons/Missing.png');

		this.load.image('räv', 'assets/images/icons/Räv.png');
		this.load.image('lo', 'assets/images/icons/Lo.png');
		this.load.image('duvhök', 'assets/images/icons/Duvhök.png');
		this.load.image('kattuggla', 'assets/images/icons/Kattuggla.png');
		this.load.image('snok', 'assets/images/icons/Snok.png');

		this.load.image('dovhjort', 'assets/images/icons/Dovhjort.png');
		this.load.image('rådjur', 'assets/images/icons/Rådjur.png');
		this.load.image('hare', 'assets/images/icons/Hare.png');
		this.load.image('norvacka', 'assets/images/icons/Norvacka.png');

		this.load.image('träd', 'assets/images/icons/Träd.png');
		this.load.image('gräs', 'assets/images/icons/Gräs.png');
		this.load.image('ört', 'assets/images/icons/Ört.png');
		this.load.image('blåbär', 'assets/images/icons/Blåbär.png');


		/* Audio */
		this.load.audio('hover_button', [ 'assets/audio/hover_button.ogg' ] );
		this.load.audio('press_button', [ 'assets/audio/press_button.ogg' ] );
		this.load.audio('release_button', [ 'assets/audio/release_button.ogg' ] );
		this.load.audio('ui_box_open', [ 'assets/audio/ui_box_open.ogg' ] );
		this.load.audio('ui_menu_close', [ 'assets/audio/ui_menu_close.ogg' ] );
		this.load.audio('ui_menu_open', [ 'assets/audio/ui_menu_open.ogg' ] );
		this.load.audio('ui_dnd_click', [ 'assets/audio/ui_dnd_click.ogg' ] );
		this.load.audio('ui_dnd_grab', [ 'assets/audio/ui_dnd_grab.ogg' ] );
		this.load.audio('ui_dnd_drop', [ 'assets/audio/ui_dnd_drop.ogg' ] );

		//this.load.image('älg', 'assets/images/icons/Älg.png');
		//this.load.image('blåbär', 'assets/images/icons/Blåbär.png');
		//this.load.image('fiskgjuse_lås', 'assets/images/icons/Fiskgjuse_Lås.png');
		//this.load.image('fiskgjuse', 'assets/images/icons/Fiskgjuse.png');
		//this.load.image('gräs', 'assets/images/icons/Gräs.png');
		//this.load.image('näckros', 'assets/images/icons/Näckros.png');
		//this.load.image('örter', 'assets/images/icons/Örter.png');
		//this.load.image('rådjur', 'assets/images/icons/Rådjur.png');
		//this.load.image('räv', 'assets/images/icons/Räv.png');
		//this.load.image('skogshare', 'assets/images/icons/Skogshare.png');
		//this.load.image('svamp', 'assets/images/icons/Svamp.png');
		//this.load.image('träd', 'assets/images/icons/Träd.png');
		//this.load.image('trollflugelarv_lås', 'assets/images/icons/Trollflugelarv_Lås.png');
		//this.load.image('trollflugelarv', 'assets/images/icons/Trollflugelarv.png');
		//this.load.image('varg', 'assets/images/icons/Varg.png');

		//this.load.image('energilinje', 'assets/images/ui/EnergiLinje.png');
		//this.load.image('energipil', 'assets/images/ui/EnergiPil.png');
		//this.load.image('händelse_bar', 'assets/images/ui/Händelse_Bar.png');
		//this.load.image('händelsenodflyttbar', 'assets/images/ui/HändelseNodFlyttbar.png');
		//this.load.image('händelsenod', 'assets/images/ui/HändelseNod.png');
		//this.load.image('händelsenodtom', 'assets/images/ui/HändelseNodTom.png');
		//this.load.image('ikon', 'assets/images/ui/Ikon.png');
		//this.load.image('infobox', 'assets/images/ui/Infobox.png');
		//this.load.image('menyknapp', 'assets/images/ui/MenyKnapp.png');
		//this.load.image('questbox', 'assets/images/ui/QuestBox.png');
		//this.load.image('skala_infobox', 'assets/images/ui/Skala_InfoBox.png');
		//this.load.image('slider_infobox', 'assets/images/ui/Slider_InfoBox.png');
		//this.load.image('tidsaxel_bar', 'assets/images/ui/Tidsaxel_Bar.png');
		//this.load.image('tidsaxel', 'assets/images/ui/TidsAxel.png');
		//this.load.image('timmblas', 'assets/images/ui/Timmblas.png');
		//this.load.image('tomnod', 'assets/images/ui/TomNod.png');
		//this.load.image('tomtiddaxelnod', 'assets/images/ui/TomTiddaxelNod.png');

		//this.load.image('ui_symbol', 'assets/images/UI_Symbol.png');
		//this.load.image('full', 'assets/images/Radjur.png');

		//this.load.image('cat', 'assets/images/cat.jpeg');
		//this.load.image('image', 'assets/images/image.png');
		//this.load.image('items', 'assets/images/items.png');


		this.load.on('progress', this.onLoadProgress, this);
		//this.load.on('complete', this.onLoadComplete, this);
	}

	onLoadProgress(progress) {
		this.loading.setText(`Loading... ${Math.round(progress * 100)}%`);
	}

	create() {
		//this.scene.start("LevelScene");
		this.scene.start("TitleScene");
	}

	update(time, delta) {
	}
}
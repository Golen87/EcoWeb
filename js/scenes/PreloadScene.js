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
		this.load.image('bg_3', 'assets/images/background/BG3.png');

		this.load.image('bg_parallax_1', 'assets/images/background/parallax/1.png');
		this.load.image('bg_parallax_2', 'assets/images/background/parallax/2.png');
		this.load.image('bg_parallax_3', 'assets/images/background/parallax/3.png');
		this.load.image('bg_parallax_4', 'assets/images/background/parallax/4.png');
		this.load.image('bg_parallax_5', 'assets/images/background/parallax/5.png');
		this.load.image('bg_parallax_6', 'assets/images/background/parallax/6.png');


		/* Menu */
		this.load.image('menu_line', 'assets/images/ui/menu/Line.png');
		this.load.image('menu_bar', 'assets/images/ui/menu/Bar.png');
		this.load.image('menu_bar_hover', 'assets/images/ui/menu/BarMouseover.png');

		this.load.image('pause_window', 'assets/images/ui/pause/Bas.png');
		this.load.image('pause_button', 'assets/images/ui/pause/Knapp.png');
		this.load.image('pause_button_hover', 'assets/images/ui/pause/KnappMouseover.png');

		this.load.image('event_background', 'assets/images/ui/event/EventBG.png');
		this.load.image('event_divider_top', 'assets/images/ui/event/Divider_Top.png');
		this.load.image('event_divider', 'assets/images/ui/event/Divider.png');
		this.load.image('event_type_plant', 'assets/images/ui/event/VäxtIkon.png');
		this.load.image('event_type_animal', 'assets/images/ui/event/DjurIkon.png');
		this.load.image('event_type_build', 'assets/images/ui/event/ByggIkon.png');
		this.load.image('event_type_chemistry', 'assets/images/ui/event/KemiIkon.png');


		/* UI */
		this.load.image('checkbox', 'assets/images/ui/checkbox/CheckBox.png');
		this.load.image('checkmark', 'assets/images/ui/checkbox/Checkmark.png');

		this.load.image('symbol_button', 'assets/images/ui/button/HändelseNod.png');
		this.load.image('symbol_menu', 'assets/images/ui/button/MenyKnapp.png');

		this.load.image('time_bar', 'assets/images/ui/time/TidsAxelBar.png');
		this.load.image('time_background', 'assets/images/ui/time/TidsAxel.png');
		this.load.image('time_button', 'assets/images/ui/time/TimglasMedPil.png');

		this.load.image('event_add', 'assets/images/ui/Markor.png');
		this.load.image('symbol_plus', 'assets/images/ui/plus.png');

		this.load.image('socket_button', 'assets/images/ui/socket/button.png');
		this.load.image('socket_socket', 'assets/images/ui/socket/socket.png');
		this.load.image('socket_mask', 'assets/images/ui/socket/mask.png');

		this.load.image('growth_slider', 'assets/images/ui/growth_slider/Matare.png');
		this.load.image('growth_slider_arrow', 'assets/images/ui/growth_slider/Vippa.png');

		this.load.image('info_background', 'assets/images/ui/info_background.png');
		this.load.image('info_scale', 'assets/images/ui/info_scale.png');
		this.load.image('info_marker', 'assets/images/ui/info_marker.png');

		this.load.spritesheet('player_icons', 'assets/images/ui/PlayerIcons.png', { frameWidth: 100, frameHeight: 100 });


		/* Nodes */
		this.load.image('circle', 'assets/images/circle_128.png');
		this.load.image('pixel', 'assets/images/pixel.png');
		this.load.image('dot', 'assets/images/dot.png');

		this.load.image('missing', 'assets/images/icons/Missing_128.png');

		this.load.image('räv', 'assets/images/icons/Räv_128.png');
		this.load.image('lo', 'assets/images/icons/Lo_128.png');
		this.load.image('duvhök', 'assets/images/icons/Duvhök_128.png');
		this.load.image('kattuggla', 'assets/images/icons/Kattuggla_128.png');
		this.load.image('snok', 'assets/images/icons/Snok_128.png');

		this.load.image('dovhjort', 'assets/images/icons/Dovhjort_128.png');
		this.load.image('rådjur', 'assets/images/icons/Rådjur_128.png');
		this.load.image('hare', 'assets/images/icons/Hare_128.png');
		this.load.image('skogssorkgråsiding', 'assets/images/icons/Skogssork_Grasiding_128.png');
		this.load.image('norvacka', 'assets/images/icons/Norvacka_128.png');
		this.load.image('koltrast', 'assets/images/icons/Koltrast_128.png');
		this.load.image('vanliggroda', 'assets/images/icons/VanligGroda_128.png');

		this.load.image('daggmask', 'assets/images/icons/Daggmask_128.png');
		this.load.image('skalbagge', 'assets/images/icons/Skalbagge_128.png');
		this.load.image('trädlevandeinsekt', 'assets/images/icons/TrädlevandeInsekt_128.png');

		this.load.image('träd', 'assets/images/icons/Träd_128.png');
		this.load.image('gräs', 'assets/images/icons/Gräs_128.png');
		this.load.image('ört', 'assets/images/icons/Ört_128.png');
		this.load.image('blåbär', 'assets/images/icons/Blåbär_128.png');
		this.load.image('hasselnöt', 'assets/images/icons/Hasselnöt_128.png');
		this.load.image('svamp', 'assets/images/icons/Svamp_128.png');
		this.load.image('detrius', 'assets/images/icons/Detrius_128.png');

		this.load.image('havsutter', 'assets/images/icons/Havsutter_128.png');
		this.load.image('jättekelp', 'assets/images/icons/Jättekelp_128.png');
		this.load.image('lax', 'assets/images/icons/Lax_128.png');
		this.load.image('sjöelefant', 'assets/images/icons/Säl_Sjöelefant_128.png');
		this.load.image('sjöborre', 'assets/images/icons/Sjöborre_128.png');
		this.load.image('sjölejon', 'assets/images/icons/Sjölejon_California_128.png');
		this.load.image('späckhuggare', 'assets/images/icons/Späckhuggare_128.png');


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
		this.load.audio('ui_menu_swoosh', [ 'assets/audio/ui_menu_swoosh.ogg' ] );

		this.load.audio('ambience_main_menu', [ 'assets/audio/ambience_main_menu.ogg' ] );


		this.load.on('progress', this.onLoadProgress, this);
		//this.load.on('complete', this.onLoadComplete, this);
	}

	onLoadProgress(progress) {
		this.loading.setText(`Loading... ${Math.round(progress * 100)}%`);
	}

	create() {
		web.startScenario(0);
		//this.scene.start("LevelScene");
		this.scene.start("TitleScene");
	}

	update(time, delta) {
	}
}
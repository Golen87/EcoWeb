class PreloadScene extends Phaser.Scene {
	constructor() {
		super({key: 'PreloadScene'});
	}

	preload() {
		initWeb();

		this.loading = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Loading...", {
			fontFamily: game.font,
			fontSize: "20px",
			fill: "#fff"
		});
		this.loading.setOrigin(0.5);

		// this.load.image('bg_title', 'assets/images/background/BgTitel.png');
		// this.load.image('bg_world', 'assets/images/background/BgVärld.png');
		// this.load.image('bg_1', 'assets/images/background/BG1.png');
		// this.load.image('bg_2', 'assets/images/background/BG2.png');
		// this.load.image('bg_3', 'assets/images/background/BG3.png');

		this.load.image('bg_uni_1', 'assets/images/background/universeum/serengeti-small-blur.png');
		this.load.image('bg_land', 'assets/images/background/universeum/land.png');

		// this.load.image('bg_parallax_1', 'assets/images/background/parallax/1.png');
		// this.load.image('bg_parallax_2', 'assets/images/background/parallax/2.png');
		// this.load.image('bg_parallax_3', 'assets/images/background/parallax/3.png');
		// this.load.image('bg_parallax_4', 'assets/images/background/parallax/4.png');
		// this.load.image('bg_parallax_5', 'assets/images/background/parallax/5.png');
		// this.load.image('bg_parallax_6', 'assets/images/background/parallax/6.png');
		// this.load.image('bg_parallax_7', 'assets/images/background/parallax/7.png');


		/* Menu */
		// this.load.image('menu_line', 'assets/images/ui/menu/Line.png');
		// this.load.image('menu_bar', 'assets/images/ui/menu/Bar.png');
		// this.load.image('menu_bar_hover', 'assets/images/ui/menu/BarMouseover.png');

		// this.load.image('pause_window', 'assets/images/ui/pause/Bas.png');
		// this.load.image('pause_button', 'assets/images/ui/pause/Knapp.png');
		// this.load.image('pause_button_hover', 'assets/images/ui/pause/KnappMouseover.png');

		// this.load.image('event_background', 'assets/images/ui/event/EventBG.png');
		// this.load.image('event_divider_top', 'assets/images/ui/event/Divider_Top.png');
		// this.load.image('event_divider', 'assets/images/ui/event/Divider.png');
		// this.load.image('event_type_plant', 'assets/images/ui/event/VäxtIkon.png');
		// this.load.image('event_type_animal', 'assets/images/ui/event/DjurIkon.png');
		// this.load.image('event_type_build', 'assets/images/ui/event/ByggIkon.png');
		// this.load.image('event_type_chemistry', 'assets/images/ui/event/KemiIkon.png');


		/* UI */
		// this.load.image('checkbox', 'assets/images/ui/checkbox/CheckBox.png');
		// this.load.image('checkmark', 'assets/images/ui/checkbox/Checkmark.png');

		// this.load.image('symbol_button', 'assets/images/ui/button/HändelseNod.png');
		// this.load.image('symbol_menu', 'assets/images/ui/button/MenyKnapp.png');

		// this.load.image('time_bar', 'assets/images/ui/time/TidsAxelBar.png');
		// this.load.image('time_background', 'assets/images/ui/time/TidsAxel.png');
		// this.load.image('time_button', 'assets/images/ui/time/TimglasMedPil.png');

		// this.load.image('event_add', 'assets/images/ui/Markor.png');
		// this.load.image('symbol_plus', 'assets/images/ui/plus.png');

		// this.load.image('socket_button', 'assets/images/ui/socket/button.png');
		// this.load.image('socket_socket', 'assets/images/ui/socket/socket.png');
		// this.load.image('socket_mask', 'assets/images/ui/socket/mask.png');

		// this.load.image('growth_slider', 'assets/images/ui/growth_slider/Matare.png');
		// this.load.image('growth_slider_arrow', 'assets/images/ui/growth_slider/Vippa.png');

		// this.load.image('info_background', 'assets/images/ui/info_background.png');
		// this.load.image('info_scale', 'assets/images/ui/info_scale.png');
		// this.load.image('info_marker', 'assets/images/ui/info_marker.png');

		// this.load.spritesheet('player_icons', 'assets/images/ui/PlayerIcons.png', { frameWidth: 100, frameHeight: 100 });

		// this.load.image('search', 'assets/images/ui/search.png');
		// this.load.image('cross', 'assets/images/ui/cross.png');
		// this.load.image('check', 'assets/images/ui/check.png');
		// this.load.image('star', 'assets/images/ui/star.png');
		// this.load.image('star_empty', 'assets/images/ui/star_empty.png');
		// this.load.image('lock', 'assets/images/ui/lock.png');
		// this.load.image('book', 'assets/images/ui/book.png');

		// this.load.image('arrow_down_big', 'assets/images/ui/arrow/DownBig.png');
		// this.load.image('arrow_down_small', 'assets/images/ui/arrow/DownSmall.png');
		// this.load.image('arrow_up_big', 'assets/images/ui/arrow/UpBig.png');
		// this.load.image('arrow_up_small', 'assets/images/ui/arrow/UpSmall.png');

		// this.load.image('frame_ui', 'assets/images/ui/frame/Ram.png');
		// this.load.image('frame_ui', 'assets/images/ui/frame/UI_Ram2.png');
		// this.load.image('frame_briefing', 'assets/images/ui/frame/LevelIntroBlank.png');
		// this.load.image('frame_briefing', 'assets/images/ui/frame/LevelIntroConcept.png');
		// this.load.image('frame_ok', 'assets/images/ui/frame/OK.png');
		// this.load.image('frame_timeline', 'assets/images/ui/frame/Timeline.png');
		// this.load.image('frame_search', 'assets/images/ui/frame/search.png');

		// Universeum
		this.load.image('icon-foodWeb', 'assets/images/ui/universeum/icon-foodWeb.png');
		this.load.image('icon-ecoWeb', 'assets/images/ui/universeum/icon-ecoWeb.png');
		this.load.image('icon-ecoChallenge', 'assets/images/ui/universeum/icon-ecoChallenge.png');
		this.load.image('icon-ecoMission', 'assets/images/ui/universeum/icon-ecoMission.png');
		this.load.image('icon-backToBeginning', 'assets/images/ui/universeum/icon-backToBeginning.png');
		this.load.image('icon-backward', 'assets/images/ui/universeum/icon-backward.png');
		this.load.image('icon-forward', 'assets/images/ui/universeum/icon-forward.png');
		this.load.image('icon-play', 'assets/images/ui/universeum/icon-play.png');
		this.load.image('icon-soil', 'assets/images/ui/universeum/icon-soil.png');
		this.load.image('icon-sun', 'assets/images/ui/universeum/icon-sun.png');
		this.load.image('icon-rain', 'assets/images/ui/universeum/icon-rain.png');
		this.load.image('icon-info', 'assets/images/ui/universeum/icon-info.png');
		this.load.image('icon-reset', 'assets/images/ui/universeum/icon-reset.png');
		this.load.image('icon-bookmark-saved', 'assets/images/ui/universeum/icon-bookmark-saved.png');
		this.load.image('icon-annualFlower', 'assets/images/ui/universeum/icon-annualFlower.png');
		this.load.image('icon-grass', 'assets/images/ui/universeum/icon-grass.png');
		this.load.image('icon-herb', 'assets/images/ui/universeum/icon-herb.png');
		this.load.image('icon-shrub', 'assets/images/ui/universeum/icon-shrub.png');
		this.load.image('icon-tree', 'assets/images/ui/universeum/icon-tree.png');
		this.load.image('icon-menu-flag-se', 'assets/images/ui/universeum/icon-menu-flag-se.png');
		this.load.image('icon-menu-flag-en', 'assets/images/ui/universeum/icon-menu-flag-en.png');


		/* Videos */
		// this.load.video('planet_video', 'assets/videos/planet.mp4', 'loadeddata', false, true);
		// this.load.image('planet_still', 'assets/videos/planet.png');


		/* Nodes */
		this.load.image('circle', 'assets/images/circle_128.png');
		this.load.image('circle_hq', 'assets/images/circle.png');
		this.load.image('diamond', 'assets/images/diamond_128.png');
		this.load.image('pixel', 'assets/images/pixel.png');
		this.load.image('dot', 'assets/images/dot.png');

		for (const data of NODE_IMAGES) {
			this.load.image(data.value, NODE_IMAGES_PATH_SMALL + data.text);
		}
		// for (const data of NODE_IMAGES) {
			// this.load.image(data.value+"_hq", NODE_IMAGES_PATH + data.text);
		// }


		/* Audio */
		// this.load.audio('hover_button', [ 'assets/audio/hover_button.ogg' ] );
		// this.load.audio('press_button', [ 'assets/audio/press_button.ogg' ] );
		// this.load.audio('release_button', [ 'assets/audio/release_button.ogg' ] );
		// this.load.audio('ui_box_open', [ 'assets/audio/ui_box_open.ogg' ] );
		// this.load.audio('ui_menu_close', [ 'assets/audio/ui_menu_close.ogg' ] );
		// this.load.audio('ui_menu_open', [ 'assets/audio/ui_menu_open.ogg' ] );
		// this.load.audio('ui_dnd_click', [ 'assets/audio/ui_dnd_click.ogg' ] );
		// this.load.audio('ui_dnd_grab', [ 'assets/audio/ui_dnd_grab.ogg' ] );
		// this.load.audio('ui_dnd_drop', [ 'assets/audio/ui_dnd_drop.ogg' ] );
		// this.load.audio('ui_menu_swoosh', [ 'assets/audio/ui_menu_swoosh.ogg' ] );

		// this.load.audio('ambience_main_menu', [ 'assets/audio/ambience_main_menu.ogg' ] );


		/* Plugins */
		this.load.plugin('rexroundrectangleplugin', 'web/rexroundrectangleplugin.min.js', true);


		this.load.on('progress', this.onLoadProgress, this);
		//this.load.on('complete', this.onLoadComplete, this);
	}

	onLoadProgress(progress) {
		this.loading.setText(`Loading... ${Math.round(progress * 100)}%`);
	}

	create() {
		//web.startScenario(0);
		window.simulator.loadScenario(database.scenarios[0]);
		window.simulator2.loadScenario(database.scenarios[0]);
		// this.scene.start("TitleScene");
		// this.scene.start("WorldScene");
		// this.scene.start("LevelScene2");
		this.scene.start("LevelScene3");
	}

	update(time, delta) {
	}
}
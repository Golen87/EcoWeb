class GrayScalePostFilter extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
	constructor (game) {
		super({
			game,
			name: 'GrayScalePostFilter'
		});
	}

	onPreRender () {
		// this.colorMatrix.grayscale(1.0);
		this.colorMatrix.blackWhite();
	}

	onDraw (renderTarget) {
		this.drawFrame(renderTarget, this.fullFrame1);
		this.bindAndDraw(this.fullFrame1);
	}
}


class BlurPostFilter extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
	constructor (game) {
		super({
			game,
			name: 'BlurPostFilter',
			fragShader: `
				#ifdef GL_FRAGMENT_PRECISION_HIGH
				#define highmedp highp
				#else
				#define highmedp mediump
				#endif
				precision highmedp float;

				uniform sampler2D uMainSampler;
				varying vec2 outTexCoord;
				uniform vec2 uTexSize;
				uniform vec2 uOffset;

				void main (void) {
					vec4 c = texture2D( uMainSampler, outTexCoord );
					vec4 l = texture2D( uMainSampler, outTexCoord + uOffset );
					vec4 r = texture2D( uMainSampler, outTexCoord - uOffset );

					gl_FragColor = (1.0*c + 1.0*l + 1.0*r) / 3.0;
				}
			`
		});

		// this.horiFrag = this.shaders[0];
		// this.vertFrag = this.shaders[1];

		this.offsetX = 1;
		this.offsetY = 1;
		this.lowres = true;
		this.steps = 8;
	}

	onPreRender () {
		this.set2f('uTexSize', this.game.scale.width, this.game.scale.height);
	}

	onDraw (renderTarget) {
		const target1 = (this.lowres) ? this.halfFrame1 : this.fullFrame1;
		const target2 = (this.lowres) ? this.halfFrame2 : this.fullFrame2;

		this.copyFrame(renderTarget, target1);

		const x = (1 / target1.width) * this.offsetX;
		const y = (1 / target1.height) * this.offsetY;

		for (let i = 0; i < this.steps; i++)
		{
			this.set2f('uOffset', x, 0);
			this.bindAndDraw(target1, target2);

			this.set2f('uOffset', 0, y);
			this.bindAndDraw(target2, target1);
		}

		this.bindAndDraw(target1);
	}
}
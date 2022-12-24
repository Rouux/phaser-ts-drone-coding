export class UIScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'UIScene',
			active: true
		});
	}

	protected preload() {
		this.load.image('build--button', 'assets/ui_button_build.jpg');
	}

	protected create() {
		const buildButton = this.add
			.image(0, this.game.canvas.height, 'build--button')
			.setOrigin(0, 1)
			.setDisplaySize(150, 50)
			.setInteractive()
			.on('pointerup', () => this.events.emit('spawn-drone'));
		this.scale.on(
			Phaser.Scale.Events.RESIZE,
			(
				gameSize: Phaser.Structs.Size,
				_baseSize: Phaser.Structs.Size,
				_displaySize: Phaser.Structs.Size,
				_previousWidth: number,
				_previousHeight: number
			) => {
				const { width, height } = gameSize;
				buildButton.setPosition(0, height);
			},
			this
		);
	}
}

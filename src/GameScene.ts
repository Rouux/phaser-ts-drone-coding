import { DroneEditor } from './DroneEditor';
import { Player } from './Player';
import { Vector2 } from './utils/math';

export class GameScene extends Phaser.Scene {
	public player: Player;

	constructor() {
		super('GameScene');
	}

	protected preload() {
		this.load.image('background', 'assets/background_tile.png');
		this.load.image('logo', 'assets/phaser3-logo.png');
		this.load.image('ship', 'assets/ship.png');
	}

	protected create() {
		this.add.existing((this.player = new Player(this, 0, 0, 'ship')));
		this.scene
			.get('UIScene')
			.events.on('spawn-drone', () =>
				this.add.existing(this.player.spawnDrone(this))
			);

		const background = this.add.image(0, 0, 'background');
		background.scale = 100;
		background.setInteractive();
		background.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			DroneEditor.Close();
			this.player.target = new Vector2(pointer.x, pointer.y);
		});
	}

	public update(time: number, delta: number): void {
		delta /= 1000;
		this.player.update(time, delta);
		this.player.fleet.forEach(drone => drone.update(time, delta));
	}
}

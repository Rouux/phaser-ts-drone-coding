import { Drone } from './Drone';
import { DroneEditor } from './DroneEditor';
import { Player } from './Player';
import { Vector2 } from './utils/math';

export class GameScene extends Phaser.Scene {
	public player: Player;
	private _drones: Phaser.GameObjects.Group;

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
		this._drones = this.add.group({
			classType: Drone
		});

		this._drones.add(new Drone(this, 100, 200, 'ship', 'drone-001'), true);
		this._drones.add(new Drone(this, 200, 400, 'ship', 'drone-002'), true);

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
		this._drones.children.iterate(drone => drone.update(time, delta));
	}
}

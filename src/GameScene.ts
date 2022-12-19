import { Drone } from './Drone';

export class GameScene extends Phaser.Scene {
	private _drones: Phaser.GameObjects.Group;

	constructor() {
		super('GameScene');
	}

	protected preload() {
		this.load.image('logo', 'assets/phaser3-logo.png');
		this.load.image('ship', 'assets/ship.png');
	}

	protected create() {
		const logo = this.add.image(400, 70, 'logo');

		this._drones = this.add.group({
			classType: Drone
		});

		this._drones.add(new Drone(this, 100, 200, 'ship', 'drone-001'), true);

		this.tweens.add({
			targets: logo,
			y: 350,
			duration: 1500,
			ease: 'Sine.inOut',
			yoyo: true,
			repeat: -1
		});
	}

	public update(time: number, delta: number): void {
		delta /= 1000;
		this._drones.children.iterate(drone => drone.update(time, delta));
	}
}

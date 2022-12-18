import { Drone } from './Drone';

let drone: Drone;

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

		drone = new Drone(this, 100, 200, 'ship');
		this._drones.add(drone, true);

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

window.addEventListener('message', function (event) {
	const message = event.data;
	console.log('Message received from the child iframe: ', message);
	switch (message.type) {
		case 'compile':
			compile(message);
			break;
	}
});

function compile(message: any) {
	drone.run = new Function(
		'window',
		'Window',
		'document',
		'globalThis',
		'eval',
		'self',
		'frames',
		`with(this) {${message.editorText}}`
	);
}

import { Drone } from './Drone';

let drone: Drone;

export class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	preload() {
		this.load.image('logo', 'assets/phaser3-logo.png');
		this.load.image('ship', 'assets/ship.png');
	}

	create() {
		const logo = this.add.image(400, 70, 'logo');

		const drones = this.add.group({
			classType: Drone
		});

		drone = drones.get(200, 150, 'ship');

		this.tweens.add({
			targets: logo,
			y: 350,
			duration: 1500,
			ease: 'Sine.inOut',
			yoyo: true,
			repeat: -1
		});
	}

	update(_time: number, delta: number): void {
		delta /= 1000;
		drone.update(delta);
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

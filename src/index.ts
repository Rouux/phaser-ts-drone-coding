import { Drone } from './Drone';

const drone = new Drone();

window.addEventListener('message', function (event) {
	const message = event.data;
	console.log('Message received from the child iframe: ', message);
	switch (message.type) {
		case 'compile':
			compile(message);
			break;
		case 'test':
			compile(message);
			update(1);
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

function nextTick(drone: Drone) {
	const self = {
		// @ts-ignore
		_actions: [],
		x: drone.x,
		y: drone.y,
		memory: drone.memory,
		moveTo(x: number, y: number) {
			this._actions.push({
				op: 'moveTo',
				args: [x, y]
			});
		}
	};
	drone.run.call(self);
	drone.updateActions(self._actions);
}

function update(delta: number) {
	nextTick(drone);
	drone.tick(delta);
}

const canvas = <HTMLCanvasElement>document.getElementById('game--canvas');
const context = canvas.getContext('2d');

let lastUpdate = performance.now();
function loop() {
	const now = performance.now();
	const delta = (now - lastUpdate) / 1000;

	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = 'red';
	context.fillRect(drone.x, drone.y, 50, 50);
	update(delta);

	lastUpdate = now;
	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

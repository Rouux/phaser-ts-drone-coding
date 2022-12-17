import { Vector2 } from './Vector2';

const clamp = (num: number, min: number, max: number): number =>
	Math.min(Math.max(num, min), max);

export class Drone {
	public position: Vector2;
	public speed: number;
	public moveThreshold: number;
	public actions: any;
	public memory: any;
	public run: any;

	constructor(x = 0, y = 0) {
		this.position = new Vector2(x, y);
		this.speed = 8;
		this.moveThreshold = 1e-3;
		this.actions = {};
		this.memory = {};
		this.run = function () {};
	}

	get x() {
		return this.position.x;
	}

	get y() {
		return this.position.y;
	}

	updateActions(actions: any[] = []) {
		actions.forEach(action => {
			this.actions[action.op] = action.args;
		});
	}

	tick(delta: number) {
		Object.keys(this.actions).forEach(key => {
			// @ts-ignore
			this[key](delta, ...this.actions[key]);
		});
	}

	moveTo(delta: number, x: number, y: number) {
		const destination = new Vector2(x, y);
		if (this.position.distanceTo(destination) < this.moveThreshold) {
			delete this.actions['moveTo'];
			return;
		}
		const direction = destination.sub(this.position).normalize();
		const movement = direction.multiplyScalar(this.speed * delta);
		this.position.x = clamp(
			this.x + movement.x,
			Math.min(this.x, x),
			Math.max(this.x, x)
		);
		this.position.y = clamp(
			this.y + movement.y,
			Math.min(this.y, y),
			Math.max(this.y, y)
		);
	}
}

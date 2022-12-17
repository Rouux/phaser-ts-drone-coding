import { Vector2 } from './Vector2';

const clamp = (num: number, min: number, max: number): number =>
	Math.min(Math.max(num, min), max);

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
	return self._actions;
}

export class Drone extends Phaser.GameObjects.Sprite {
	public speed: number;
	public moveThreshold: number;
	public actions: any;
	public memory: any;
	public run: any;

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		this.speed = 8;
		this.moveThreshold = 1e-3;
		this.actions = {};
		this.memory = {};
		this.run = function () {};
	}

	public update(delta: number): void {
		this.updateActions(nextTick(this));
		Object.keys(this.actions).forEach(key => {
			// @ts-ignore
			this[key](delta, ...this.actions[key]);
		});
	}

	protected moveTo(delta: number, x: number, y: number) {
		const destination = new Vector2(x, y);
		const position = new Vector2(this.x, this.y);
		if (position.distanceTo(destination) < this.moveThreshold) {
			delete this.actions['moveTo'];
			return;
		}
		const direction = destination.sub(position).normalize();
		const movement = direction.multiplyScalar(this.speed * delta);
		this.x = clamp(
			this.x + movement.x,
			Math.min(this.x, x),
			Math.max(this.x, x)
		);
		this.y = clamp(
			this.y + movement.y,
			Math.min(this.y, y),
			Math.max(this.y, y)
		);
	}

	private updateActions(actions: any[] = []) {
		actions.forEach(action => {
			this.actions[action.op] = action.args;
		});
	}
}

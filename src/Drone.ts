import { DroneEditor } from './DroneEditor';
import { Depth } from './config/depth';
import { Vector2, clamp } from './utils/math';

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
	return drone.editor.run(self);
}

export class Drone extends Phaser.GameObjects.Sprite {
	public readonly editor: DroneEditor;

	public speed: number;
	public moveThreshold: number;
	public actions: any;
	public memory: any;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string,
		name?: string
	) {
		super(scene, x, y, texture);
		this.setInteractive();
		this.depth = Depth.DRONE;
		this.name = name;
		this.speed = 100;
		this.moveThreshold = 1e-3;
		this.actions = {};
		this.memory = {};
		this.editor = new DroneEditor(this);
		this.on('pointerup', () => {
			if (this.editor.isEditorOpenFor(this)) {
				DroneEditor.Close();
			} else {
				this.editor.open();
			}
		});
	}

	public update(_time: number, delta: number): void {
		this.updateActions(nextTick(this));
		Object.keys(this.actions).forEach(key => {
			// @ts-ignore
			this[key](delta, ...this.actions[key]);
		});
	}

	protected moveTo(delta: number, x: number, y: number): void {
		const destination = new Vector2(x, y);
		const position = new Vector2(this.x, this.y);
		if (position.distance(destination) < this.moveThreshold) {
			delete this.actions['moveTo'];
			return;
		}
		const direction = destination.subtract(position).normalize();
		const movement = direction.scale(this.speed * delta);
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

import { Depth } from './config/depth';
import { Drone } from './Drone';
import { clamp, Vector2 } from './utils/math';

export class Player extends Phaser.GameObjects.Sprite {
	public speed: number;
	public moveThreshold: number;
	public target: Vector2;
	public fleet: Drone[];

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		this.setInteractive();
		this.depth = Depth.PLAYER;
		this.scale = 2;
		this.speed = 500;
		this.moveThreshold = 1e-3;
		this.target = undefined;
		this.fleet = [];
	}

	public spawnDrone(scene: Phaser.Scene): Drone {
		const drone = new Drone(
			scene,
			this.x,
			this.y,
			'ship',
			`drone-${this.fleet.length.toLocaleString(undefined, {
				minimumIntegerDigits: 3
			})}`
		);
		this.fleet.push(drone);
		return drone;
	}

	public update(_time: number, delta: number): void {
		if (this.target) {
			const reachedTarget = this.moveTo(delta, this.target.x, this.target.y);
			if (reachedTarget) {
				this.target = undefined;
			}
		}
	}

	protected moveTo(delta: number, x: number, y: number): boolean {
		const destination = new Vector2(x, y);
		const position = new Vector2(this.x, this.y);
		if (position.distance(destination) < this.moveThreshold) {
			return true;
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
		return false;
	}
}

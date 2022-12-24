import { Drone } from './Drone';

export class Fleet {
	private readonly _fleet: Drone[];

	public constructor() {
		this._fleet = [];
	}

	public get length(): number {
		return this._fleet.length;
	}

	public addDrone(drone: Drone): Drone {
		this._fleet.push(drone);
		return drone;
	}

	public updateAll(time: number, delta: number): void {
		this._fleet.forEach(drone => drone.update(time, delta));
	}
}

export class LimitedQueue<T> {
	public limit: number;
	private _items: T[] = [];
	constructor(limit: number) {
		this.limit = limit;
	}

	public push(item: T): void {
		this._items.push(item);
		if (this.length > this.limit) {
			this._items.shift();
		}
	}

	public lastInserted(shift = 0): T | undefined {
		return this._items[this.length - 1 - shift];
	}

	public get length(): number {
		return this._items.length;
	}
}

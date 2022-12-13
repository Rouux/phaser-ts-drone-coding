class Vector2 {
	constructor(x = 0, y = 0) {
		Vector2.prototype.isVector2 = true;

		this.x = x;
		this.y = y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;

		return this;
	}

	setScalar(scalar) {
		this.x = scalar;
		this.y = scalar;

		return this;
	}

	setX(x) {
		this.x = x;

		return this;
	}

	setY(y) {
		this.y = y;

		return this;
	}

	clone() {
		return new this.constructor(this.x, this.y);
	}

	copy(v) {
		this.x = v.x;
		this.y = v.y;

		return this;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;

		return this;
	}

	addScalar(s) {
		this.x += s;
		this.y += s;

		return this;
	}

	addVectors(a, b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;
	}

	addScaledVector(v, s) {
		this.x += v.x * s;
		this.y += v.y * s;

		return this;
	}

	sub(v) {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	}

	subScalar(s) {
		this.x -= s;
		this.y -= s;

		return this;
	}

	subVectors(a, b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;
	}

	multiply(v) {
		this.x *= v.x;
		this.y *= v.y;

		return this;
	}

	multiplyScalar(scalar) {
		this.x *= scalar;
		this.y *= scalar;

		return this;
	}

	divide(v) {
		this.x /= v.x;
		this.y /= v.y;

		return this;
	}

	divideScalar(scalar) {
		return this.multiplyScalar(1 / scalar);
	}

	min(v) {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);

		return this;
	}

	max(v) {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);

		return this;
	}

	clamp(min, max) {
		// assumes min < max, componentwise
		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));

		return this;
	}

	clampScalar(minVal, maxVal) {
		this.x = Math.max(minVal, Math.min(maxVal, this.x));
		this.y = Math.max(minVal, Math.min(maxVal, this.y));

		return this;
	}

	clampLength(min, max) {
		const length = this.length();

		return this.divideScalar(length || 1).multiplyScalar(
			Math.max(min, Math.min(max, length))
		);
	}

	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);

		return this;
	}

	ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);

		return this;
	}

	round() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);

		return this;
	}

	roundToZero() {
		this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
		this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);

		return this;
	}

	negate() {
		this.x = -this.x;
		this.y = -this.y;

		return this;
	}

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	cross(v) {
		return this.x * v.y - this.y * v.x;
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y);
	}

	normalize() {
		return this.divideScalar(this.length() || 1);
	}

	angle() {
		// computes the angle in radians with respect to the positive x-axis
		const angle = Math.atan2(-this.y, -this.x) + Math.PI;

		return angle;
	}

	distanceTo(v) {
		return Math.sqrt(this.distanceToSquared(v));
	}

	distanceToSquared(v) {
		const dx = this.x - v.x,
			dy = this.y - v.y;
		return dx * dx + dy * dy;
	}

	manhattanDistanceTo(v) {
		return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
	}

	setLength(length) {
		return this.normalize().multiplyScalar(length);
	}

	lerp(v, alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;

		return this;
	}

	lerpVectors(v1, v2, alpha) {
		this.x = v1.x + (v2.x - v1.x) * alpha;
		this.y = v1.y + (v2.y - v1.y) * alpha;

		return this;
	}

	equals(v) {
		return v.x === this.x && v.y === this.y;
	}

	fromArray(array, offset = 0) {
		this.x = array[offset];
		this.y = array[offset + 1];

		return this;
	}

	toArray(array = [], offset = 0) {
		array[offset] = this.x;
		array[offset + 1] = this.y;

		return array;
	}

	rotateAround(center, angle) {
		const c = Math.cos(angle),
			s = Math.sin(angle);

		const x = this.x - center.x;
		const y = this.y - center.y;

		this.x = x * c - y * s + center.x;
		this.y = x * s + y * c + center.y;

		return this;
	}

	random() {
		this.x = Math.random();
		this.y = Math.random();

		return this;
	}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}
}

class Drone {
	constructor(x = 0, y = 0) {
		this.position = new Vector2(x, y);
		this.speed = 8;
		this.moveThreshold = 1;
		this.actions = {};
		this.run = function () {};
	}

	get x() {
		return this.position.x;
	}

	get y() {
		return this.position.y;
	}

	updateActions(actions = []) {
		actions.forEach(action => {
			this.actions[action.op] = action.args;
		});
	}

	tick(delta) {
		Object.keys(this.actions).forEach(key => {
			this[key](delta, ...this.actions[key]);
		});
	}

	move(delta, x, y) {
		const destination = new Vector2(x, y);
		if (this.position.distanceTo(destination) < this.moveThreshold) {
			delete this.actions['move'];
			return;
		}
		const direction = destination.sub(this.position).normalize();
		this.position.x += direction.x * this.speed * delta;
		this.position.y += direction.y * this.speed * delta;
	}
}

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

function compile(message) {
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

function nextTick() {
	const self = {
		_actions: [],
		move(x, y) {
			this._actions.push({
				op: 'move',
				args: [x, y]
			});
		}
	};
	drone.run.call(self);
	drone.updateActions(self._actions);
}

function update(delta) {
	nextTick();
	drone.tick(delta);
}

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game--canvas');
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

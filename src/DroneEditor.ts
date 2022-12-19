import { Drone } from './Drone';

export class DroneEditor {
	public static CurrentDrone: Drone = undefined;
	private static _editor: HTMLIFrameElement;

	static {
		window.addEventListener('message', event => {
			const message = event.data;
			const drone = DroneEditor.CurrentDrone;
			switch (message.type) {
				case 'openEditor':
					DroneEditor.editor.style.display = 'initial';
					break;
				case 'closeEditor':
					if (drone) {
						drone.editor.text = message.editorText;
					}
					break;
				case 'compile':
					if (drone) {
						drone.editor.updateCode(message.editorText);
					}
					break;
			}
		});
	}

	private readonly _drone: Drone;
	private _text: string;
	private _run = new Function();

	constructor(drone: Drone) {
		this._drone = drone;
	}

	public static get editor() {
		return (this._editor ??= <HTMLIFrameElement>(
			document.getElementById('editor--iframe')
		));
	}

	public get text(): string {
		return this._text;
	}

	public set text(text: string) {
		this._text = text;
	}

	public updateCode(text: string) {
		this._text = text;
		this._run = new Function(
			'window',
			'Window',
			'document',
			'globalThis',
			'eval',
			'self',
			'frames',
			`with(this) {${text}}`
		);
	}

	public isEditorOpenFor(drone: Drone) {
		return (
			DroneEditor.CurrentDrone === drone &&
			DroneEditor.editor.style.display === 'initial'
		);
	}

	public open() {
		DroneEditor.CurrentDrone = this._drone;
		DroneEditor.editor.contentWindow.postMessage({
			op: 'openEditor',
			name: this._drone.name,
			text: this._text
		});
	}

	public close() {
		DroneEditor.editor.style.display = 'none';
		DroneEditor.editor.contentWindow.postMessage({
			op: 'closeEditor'
		});
	}

	public run(self: any) {
		this._run.call(self);
		return self._actions;
	}
}

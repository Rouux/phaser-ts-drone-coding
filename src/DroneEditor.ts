import { Drone } from './Drone';
import { EditorRequest, EditorResponse } from './editor-enum';
import { LimitedQueue } from './utils/collections';

export class DroneEditor {
	public static EditedQueue = new LimitedQueue<Drone>(10);
	private static _editor: HTMLIFrameElement;

	static {
		window.addEventListener('message', event => {
			const message = event.data;
			let drone = this.EditedQueue.lastInserted();
			switch (message.type) {
				case EditorResponse.OPEN_EDITOR:
					this.Editor.style.display = 'initial';
					drone = this.EditedQueue.lastInserted(1);
					if (drone) {
						drone.editor.text = message.editorText;
					}
					break;
				case EditorResponse.CLOSE_EDITOR:
					if (drone) {
						drone.editor.text = message.editorText;
					}
					break;
				case EditorResponse.COMPILE:
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

	public static get Editor() {
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
			DroneEditor.EditedQueue.lastInserted() === drone &&
			DroneEditor.Editor.style.display === 'initial'
		);
	}

	public open() {
		DroneEditor.EditedQueue.push(this._drone);
		DroneEditor.Editor.contentWindow.postMessage({
			op: EditorRequest.OPEN_EDITOR,
			name: this._drone.name,
			text: this._text
		});
	}

	public close() {
		DroneEditor.Editor.style.display = 'none';
		DroneEditor.Editor.contentWindow.postMessage({
			op: EditorRequest.CLOSE_EDITOR
		});
	}

	public run(self: any) {
		this._run.call(self);
		return self._actions;
	}
}

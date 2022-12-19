import * as ace from 'brace';
import 'brace/ext/language_tools';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/theme/monokai';
import { EditorRequest, EditorResponse } from './editor-enum';

const editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');
editor.setOptions({
	enableBasicAutocompletion: true,
	enableSnippets: true,
	enableLiveAutocompletion: false
});

const compileButton = document.getElementById('compile-code--button');
compileButton?.addEventListener('click', () => {
	const editorText = editor.getValue();
	window.parent.postMessage({ type: EditorResponse.COMPILE, editorText }, '/');
});

window.addEventListener('message', event => {
	const message = event.data;
	switch (message.op) {
		case EditorRequest.OPEN_EDITOR:
			document.getElementById('editor-drone-name').textContent = message.name;
			editor.setValue(message.text || '', -1);
			window.parent.postMessage(
				{
					type: EditorResponse.OPEN_EDITOR,
					editorText: editor.getValue()
				},
				'/'
			);
			break;
		case EditorRequest.CLOSE_EDITOR:
			window.parent.postMessage(
				{
					type: EditorResponse.CLOSE_EDITOR,
					editorText: editor.getValue()
				},
				'/'
			);
			break;
	}
});

import * as ace from 'brace';
import 'brace/ext/language_tools';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/theme/monokai';

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
	window.parent.postMessage({ type: 'compile', editorText }, '/');
});

window.addEventListener('message', event => {
	const message = event.data;
	const editorText = editor.getValue();
	switch (message.op) {
		case 'openEditor':
			document.getElementById('editor-drone-name').textContent = message.name;
			editor.setValue(message.text || '// Type your code here ...');
			window.parent.postMessage({ type: 'openEditor', editorText }, '/');
			break;
		case 'closeEditor':
			window.parent.postMessage({ type: 'closeEditor', editorText }, '/');
			break;
	}
});

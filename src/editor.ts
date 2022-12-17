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

const testButton = document.getElementById('test-code--button');
testButton?.addEventListener('click', () => {
	const editorText = editor.getValue();
	window.parent.postMessage({ type: 'test', editorText }, '/');
});

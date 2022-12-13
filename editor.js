ace.require('ace/ext/language_tools');
const editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');
editor.setShowPrintMargin(false);
editor.setOptions({
	enableBasicAutocompletion: true,
	enableSnippets: true,
	enableLiveAutocompletion: false
});

function compile() {
	const editorText = editor.getValue();
	window.parent.postMessage({ type: 'compile', editorText }, '/');
}

function test() {
	const editorText = editor.getValue();
	window.parent.postMessage({ type: 'test', editorText }, '/');
}

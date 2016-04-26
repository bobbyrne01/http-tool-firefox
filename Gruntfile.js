module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jsbeautifier: {
			files: ['addon/data/js/controller.js', 'addon/lib/*.js', 'addon/data/html/view.html', 'addon/data/css/style.css'],
			options: {
				js: {
					braceStyle: "collapse",
					breakChainedMethods: false,
					e4x: false,
					evalCode: false,
					indentChar: "\t",
					indentLevel: 0,
					indentSize: 1,
					indentWithTabs: true,
					jslintHappy: true,
					keepArrayIndentation: false,
					keepFunctionIndentation: false,
					maxPreserveNewlines: 10,
					preserveNewlines: true,
					spaceBeforeConditional: true,
					spaceInParen: false,
					unescapeStrings: false,
					wrapLineLength: 0
				},
				html: {
					braceStyle: "collapse",
					indentChar: "\t",
					indentScripts: "keep",
					indentSize: 1,
					maxPreserveNewlines: 10,
					preserveNewlines: true,
					wrapLineLength: 0
				},
				css: {
					indentChar: "\t",
					indentSize: 1
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-jsbeautifier");

	grunt.registerTask('default', ['jsbeautifier']);
};

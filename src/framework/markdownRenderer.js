const termutils = require('./termutils.js');
const chalk = require('chalk');

function markdownRenderer(text, options = {}) {
	if (!options.width) options.width = null;

	if (options.linkUrlRenderer) {
		text = addResourceLinks(text, options.linkUrlRenderer);
	}

	text = termutils.toPlainText(text);

	// Currently the preRender step is only used for syntax highlighting since
	// it needs the entire text to render. Everything else is rendered line
	// by line.
	text = preRender(text, options);

	const lines = text.split("\n");

	const wrappedLines = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		wrappedLines.push(termutils.wrapLine(line, options.width));
	}

	let context = {
		isCode: false,
		options: options,
	};

	for (let i = 0; i < wrappedLines.length; i++) {
		const line = wrappedLines[i];
		const nextLine = i <= wrappedLines.length - 2 ? wrappedLines[i+1] : null;
		const type = blockType(line);

		if (type == 'code') {
			context.isCode = !context.isCode;
		}

		wrappedLines[i] = renderLine(wrappedLines[i], nextLine, context);
	}

	return wrappedLines.join('\n');
}

function preRender(text) {
	// Optimization: if there's no code block, we can exit now.
	if (!containsCodeBlock(text)) return text;

	const emphasize = require('emphasize');

	const lines = text.split("\n");

	const renderCodeBlock = function(language, codeBlock) {
		let codeText = codeBlock.join("\n");

		try {
			if (language) {
				codeText = emphasize.highlight(language, codeText).value;
			} else {
				codeText = emphasize.highlightAuto(codeText).value;
			}
		} catch (error) {
			// Happens for example when specified language is not registered
			return 'ERROR: Following code block cannot be displayed correctly due to: ' + error.message + "\n\n" + codeBlock;
		}

		return codeText.split("\n");
	}

	let output = [];
	let inCodeBlock = false;
	let codeBlockLanguage = null;

	let currentCodeBlock = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (isCodeBlockMarker(line)) {
			inCodeBlock = !inCodeBlock;
			codeBlockLanguage = codeBlockMarkerLanguage(line);
			if (inCodeBlock) {
				currentCodeBlock = [];
			} else {
				output = output.concat(renderCodeBlock(codeBlockLanguage, currentCodeBlock));
				currentCodeBlock = [];
			}
			output.push(line);
			continue;
		}

		if (inCodeBlock) {
			currentCodeBlock.push(line);
		} else {
			output.push(line);
		}
	}

	if (currentCodeBlock.length) {
		output = output.concat(renderCodeBlock(codeBlockLanguage, currentCodeBlock));
	}

	return output.join('\n');
}

function headerUnderlineLevel(line) {
	if (!line || line.length < 3) return 0;
	if (line.indexOf('===') !== 0 && line.indexOf('---') !== 0) return 0;
	if (/^(.)\1+$/.test(line)) return line[0] === '=' ? 1 : 2;
	return 0;
}

function inlineHeaderLevel(line) {
	if (!line || line.length <= 2) return 0;
	if (line.indexOf('###') === 0) return 3;
	if (line.indexOf('##') === 0) return 2;
	if (line.indexOf('#') === 0) return 1;
	return 0;
}

function headerLevelStyle(level, isAlreadyUnderlined) {
	if (!level) return chalk.white;

	let levelToColor = ['magenta', 'green', 'cyan', 'yellow'];

	const i = level - 1;
	const color = i >= levelToColor.length ? levelToColor[levelToColor.length - 1] : levelToColor[i];

	let output = chalk[color];

	if (!output) throw new Error('Invalid color: ' + color + ' (' + i + ')');

	if (!isAlreadyUnderlined) output = output.underline;

	return output;
}

function isSpace(char) {
	return char === ' ' || char === ' ';
}

function isQuote(line) {
	if (line.indexOf('>') === 0) {
		if (line.length === 1) return true;
		return isSpace(line[1]);
	}
	return false;
}

function renderLine(line, nextLine, context) {
	if (context.isCode) return line; // It has already been rendered in preRender()

	const lineHeaderLevel = headerUnderlineLevel(line);
	const nextLineHeaderLevel = headerUnderlineLevel(nextLine);

	if (lineHeaderLevel || nextLineHeaderLevel) {
		const level = lineHeaderLevel ? lineHeaderLevel : nextLineHeaderLevel;
		return headerLevelStyle(level, true)(line);
	}

	const inlineLevel = inlineHeaderLevel(line);
	if (inlineLevel) {
		return headerLevelStyle(inlineLevel, false)(line);
	}

	if (isQuote(line)) {
		return chalk.gray(line);
	}

	if (isCodeBlockMarker(line)) return line;

	let output = [];
	let inBold = false;
	let inEm = false;
	let inCode = false;
	let currentPiece = '';
	for (let i = 0; i < line.length; i++) {
		const c = line[i];
		const nextC = i <= line.length - 2 ? line[i+1] : '';
		const nextNextC = i <= line.length - 3 ? line[i+2] : '';

		if (inBold) {
			if (c === '*' && nextC === '*') {
				inBold = false;
				i++;
				output.push(chalk.bold('**' + currentPiece + '**'));
				currentPiece = '';
				continue;
			}
		}

		if (inEm) {
			if (c === '*') {
				inEm = false;
				output.push(chalk.italic('*' + currentPiece + '*'));
				currentPiece = '';
				continue;
			}
		}

		if (inCode) {
			if (c === '`') {
				inCode = false;
				output.push(chalk.cyan('`' + currentPiece + '`'));
				currentPiece = '';
				continue;
			}
		}

		if (!inBold && !inEm && !inCode) {
			if (c === '*' && nextC === '*' && !isSpace(nextNextC)) {
				inBold = true;
				output.push(currentPiece);
				currentPiece = '';
				i++;
				continue;
			}

			if (c === '*' && !isSpace(nextC)) {
				inEm = true;
				output.push(currentPiece);
				currentPiece = '';
				continue;
			}

			if (c === '`' && !isSpace(nextC)) {
				inCode = true;
				output.push(currentPiece);
				currentPiece = '';
				continue;
			}
		}

		currentPiece += c;
	}

	if (currentPiece) {
		if (inBold) currentPiece = '**' + currentPiece;
		if (inEm) currentPiece = '*' + currentPiece;
		if (inCode) currentPiece = '`' + currentPiece;
		output.push(currentPiece);
	}

	return output.join('');
}

function addResourceLinks(text, linkUrlRenderer) {
	// [link text](:/ddfc0cdbbe6948709419cb53585a2214)
	let linkIndex = 0;
	const linkUrlRegex = /\[(.*?)\]\((.*?)\)/gi;
	const urlTitleRegex = /(.*?)\s+"(.*?)"/; // i.e. for link like [Belgium](https://simple.wikipedia.org/wiki/Belgium "Belgium")
	return text.replace(linkUrlRegex, function(match, p1, p2) {
		let url = p2.trim();

		const urlTitleMatches = url.match(urlTitleRegex);
		// For now discard the "title" part of a link
		if (urlTitleMatches && urlTitleMatches.length > 1) url = urlTitleMatches[1];

		url = linkUrlRenderer(linkIndex++, url);
		return url ? '[' + p1.trim() + '](' + url + ')' : p1.trim();
	});
}

function containsCodeBlock(text) {
	return text.indexOf('~~~') >= 0 || text.indexOf('```') >= 0;
}

function isCodeBlockMarker(line) {
	return line.indexOf('~~~') === 0 || line.indexOf('```') === 0;
}

function codeBlockMarkerLanguage(line) {
	if (!isCodeBlockMarker(line)) return null;
	return line.substr(3).trim();
}

function blockType(line) {
	if (isCodeBlockMarker(line)) return 'code';
	return line;
}

module.exports = markdownRenderer;
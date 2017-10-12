const wrap = require('word-wrap');
const chalk = require('chalk');

function markdownRenderer(text, options = {}) {
	if (!options.width) options.width = null;

	const lines = text.split("\n");

	const wrapOptions = { indent: '' };
	if (options.width) wrapOptions.width = options.width;
	const wrappedLines = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		wrappedLines.push(wrap(line, wrapOptions));
	}

	let context = {
		isCode: false,
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

function isQuote(line) {
	return line.indexOf('> ') === 0 || line === '>';
}

function renderLine(line, nextLine, context) {
	if (context.isCode) return isCodeBlockMarker(line) ? line : chalk.blue(line);

	const lineHeaderLevel = headerUnderlineLevel(line);
	const nextLineHeaderLevel = headerUnderlineLevel(nextLine);

	if (lineHeaderLevel || nextLineHeaderLevel) {
		return chalk.yellow(line);
	}

	if (inlineHeaderLevel(line)) {
		return chalk.yellow(line);
	}

	if (isQuote(line)) {
		return chalk.gray(line);
	}

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
				output.push(chalk.blue('`' + currentPiece + '`'));
				currentPiece = '';
				continue;
			}
		}

		if (!inBold && !inEm && !inCode) {
			if (c === '*' && nextC === '*' && nextNextC !== ' ') {
				inBold = true;
				output.push(currentPiece);
				currentPiece = '';
				i++;
				continue;
			}

			if (c === '*' && nextC !== ' ') {
				inEm = true;
				output.push(currentPiece);
				currentPiece = '';
				continue;
			}

			if (c === '`' && nextC !== ' ') {
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

function isCodeBlockMarker(line) {
	return line.indexOf('~~~') === 0;
}

function blockType(line) {
	if (isCodeBlockMarker(line)) return 'code';
	return line;
}

module.exports = markdownRenderer;
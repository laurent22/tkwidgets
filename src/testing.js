'use strict';

global.ilog = function(s) {
	const fs = require('fs');
	if (typeof s === 'object') s = JSON.stringify(s);
	s = ((new Date()).getTime()) + ': ' + s;
	fs.appendFileSync('log.txt', s + "\n");
}


ilog('=======================================================');


const termutils = require('./framework/termutils.js');
const Renderer = require('./framework/Renderer.js');
// const MarkdownRenderer = require('./framework/MarkdownRenderer.js');

const ListWidget = require('./ListWidget.js');
const TextWidget = require('./TextWidget.js');
const ConsoleWidget = require('./ConsoleWidget.js');
const HLayoutWidget = require('./HLayoutWidget.js');
const VLayoutWidget = require('./VLayoutWidget.js');
const RootWidget = require('./RootWidget.js');
const WindowWidget = require('./WindowWidget.js');
const markdownRenderer = require('./framework/markdownRenderer.js');



function main() {

	const tk = require('terminal-kit');
	const term = tk.terminal;


	//const renderer = new MarkdownRenderer(term);

	const text1 = `
An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and . Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

* Nested list A Nested list A Nested list A

  * sub item A1 sub item A1 sub item A1 sub item A1
  * sub item A2 sub item A2 sub item A2 sub item A2
  * sub item A3 sub item A3 sub item A3 sub item A3
* Nested list B
    * sub item B1
    * sub item B2

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. LonglongLonglongLonglongLonglongLonglongword
`;

	const text2 = `
An h1 header
============

Paragraphs are separated by a blank line *bold*.

  * Nested list A Nested list A Nested list A

      * sub item A1 sub item A1 sub item A1 sub item A1
      * sub item A2 sub item A2 sub item A2 sub item A2
      * sub item A3 sub item A3 sub item A3 sub item A3

  * Nested list B

      * sub item B1
      * sub item B2

  1. this one
  2. that one
  3. the other one
`;


	const text3 = `
An h1 header
============

Paragraphs are separated by a blank line *bold*.

  * Nested list A

  	* Sub item A1
  	* Sub item A2

  * Nested list B
  	* Sub item B1

Some more text
`;

const text4 = `
abcd *some italic text* **and bold**.
`

const text5 = `
> Quote over
> multiple lines
> and another one.
`

const text6 = `
  * Nested list B

      * sub item B1
      * sub item B2
`;

const text7 = `
An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and \`monospace\`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺



An h2 header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

Note again how the actual text starts at 4 columns in (4 characters
from the left side). Here's a code sample:

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

~~~
define foobar() {
    print "Welcome to flavor country!";
}
~~~

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:

~~~python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
~~~



### An h3 header ###

Now a nested list:

 1. First, get these ingredients:

      * carrots
      * celery
      * lentils

 2. Boil some water.

 3. Dump everything in the pot and follow
    this algorithm:

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote [^1].

[^1]: Footnote text goes here.

Tables can look like this:

size  material      color
----  ------------  ------------
9     leather       brown
10    hemp canvas   natural
11    glass         transparent

Table: Shoes, their sizes, and what they're made of

(The above is the caption for the table.) Pandoc also supports
multi-line tables:

--------  -----------------------
keyword   text
--------  -----------------------
red       Sunsets, apples, and
          other red or reddish
          things.

green     Leaves, grass, frogs
          and other things it's
          not easy being.
--------  -----------------------

A horizontal rule follows.

***

Here's a definition list:

apples
  : Good for making applesauce.
oranges
  : Citrus!
tomatoes
  : There's no "e" in tomatoe.

Again, text is indented 4 spaces. (Put a blank line between each
term/definition pair to spread things out more.)

Here's a "line block":

| Line one
|   Line too
| Line tree

and images can be specified like so:

![example image](example-image.jpg "An exemplary image")

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:

$$I = \int \rho R^{2} dV$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.
`;

const text8 = `
Here's a footnote [^1].

[^1]: Footnote text goes here.
`;

const text9 = `
Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.
`;

const text10 = `
Test \`this[isinline]\` code.
`;

const text11 = `我打算旅行，我想去中国的南边，因为那儿的天气不太冷。也我听说有很多意思的地方。特别是凤凰县（fèng huáng xiàn）：那儿有很老的城市。看起来美极了。也我想去上海。你呢？`;
const text12 = `Subsequent paragraphsparagraphs are indented to show that they belong to the previous footnote.`;


const text13 = `
Dialogue 口语

L: 你好，我是洛弘。你叫什么名字？
J:
L:你是哪国人？
J:
L我是法国人。我在北京学习汉语。你呢？
J:
L你习惯北京的生活吗？
J:
L你习惯中国饭吗？
J:
L没问题，我习惯筷子。但是我还不习惯中国的饭，因为法国饭和中国反很不同。
J:
L我在四个月中国，你呢？
J:
L马达加斯加怎么样？
J:
L我去马达加斯加的话，我要去哪儿？
J:
L我是布列塔尼人，布列塔尼在法国的西北边。那儿有很漂亮的地方，特别是海岸。在布列塔尼有好吃的饭。薄饼(báo bǐng)，和苹果酒很有名。你呢？马达加斯加的饭怎么样？
J:
L在布列塔尼我习惯吃土豆(tǔ dòu)，牛肉，挂面(guà miàn)，奶酪，等等。你来中国一个人吗？
J:
L我来中国一个人。我的家人在法国。你的家人有几口人？
J:
L 我的家人有四口人：妈妈爸爸姐姐和我。他们都住在布列塔尼。我的姐姐有两个孩子：一个奴孩子和一个男孩子。
J:
L我打算旅行，我想去中国的南边，因为那儿的天气不太冷。也我听说有很多意思的地方。特别是凤凰县（fèng huáng xiàn）：那儿有很老的城市。看起来美极了。也我想去上海。你呢？
J:
L下学期你做什么？
J:
L对，下学期我也在清华大学学习汉语。你喜欢学习汉语吗？
J:
L我也喜欢学习汉语，我同意（tóng yì ）很难。但是觉得中国汉字有意思。我希望一天我能说和听懂汉语。
J:
L我觉得汉语越来越重要。
J:
L有空儿的时候，你做什么？
J:
L: 你去什么卡拉OK。在五道口有好的卡拉OK？
J:
L:这个有英语音乐吗？
J:
L: 你唱汉语还是英语歌？
J:
L 我喜欢游泳，看电影，看书，等等。也喜欢看我的朋友。我们一起打羽毛球（yǔ máo qiú ），去酒吧，吃饭，等等。我也喜欢起电动车看北京，但是现在不太好因为天气很冷。你有自行车吗？
J:
L: 为什么？
J:
L: 好的，明白。
J:
L: 我也很高兴认识你。再见。
J: 再见。
`;



	// // const termWrap = function(line, width) {
	// // 	let current = '';
	// // 	let lines = [];
	// // 	for (let i = 0; i < line.length; i++) {
	// // 		current += line[i];
	// // 		if (termutils.textLength(current) >= width) {
	// // 			lines.push(current);
	// // 			current = '';
	// // 		}
	// // 	}
	// // 	return lines.join('\n');
	// // }


	const wrapAnsi = require('wrap-ansi');

	console.info('0123456789');
	console.info(wrapAnsi(text13, 10, { hard: true }));
	console.info('0123456789');

	// const wrap = require('wordwrap');
	// console.info(wrap.hard(0, 0)(text10));


	// console.info(markdownRenderer(text10, {
	// 	width: 40,
	// }));

	// const md = require('markdown-it')();
	// const tokens = md.parse(text9);

	// const wrap = require('word-wrap');

	// const lines = text7.split("\n");

	// const wrappedLines = [];
	// for (let i = 0; i < lines.length; i++) {
	// 	const line = lines[i];
	// 	wrappedLines.push(wrap(line, { indent: '' }));
	// }

	// const chalk = require('chalk');



	// let context = {
	// 	isCode: false,
	// };

	// for (let i = 0; i < wrappedLines.length; i++) {
	// 	const line = wrappedLines[i];
	// 	const nextLine = i <= wrappedLines.length - 2 ? wrappedLines[i+1] : null;
	// 	const type = blockType(line);

	// 	if (type == 'code') {
	// 		context.isCode = !context.isCode;
	// 	}

	// 	wrappedLines[i] = renderLine(wrappedLines[i], nextLine, context);
	// }


	// console.info(wrappedLines.join('\n'));


	//console.info(markdownRenderer(text11, { width: null }));



	// var markdown = require('markdown-it')();
	// var terminal = require('markdown-it-terminal');
	 
	// markdown.use(terminal);

	// var result = markdown.render(text1);

	// console.info(result);


	// const MarkdownIt = require('markdown-it');
	// const md = new MarkdownIt();
	// const tokens = md.parse(text1);

	// function parseText(tokens) {
	// 	let lastIndex = null;
	// 	let output = [];
	// 	let currentBlock = null;

	// 	for (let i = 0; i < tokens.length; i++) {
	// 		const t = tokens[i];

	// 		if (t.type == 'text') {
	// 			if (!currentBlock) {
	// 				output.push({ text: t.content });
	// 			} else {
	// 				currentBlock.text = t.content;
	// 			}
	// 		} else if (t.type == 'em_open') {
	// 			currentBlock = { format: 'em', text: '' };
	// 		} else if (t.type == 'strong_open') {
	// 			currentBlock = { format: 'strong', text: '' };
	// 		} else if (t.type == 'em_close' || t.type === 'strong_close') {
	// 			output.push(currentBlock);
	// 			currentBlock = null;
	// 		} else if (t.type == 'softbreak') {
	// 			output.push({ text: ' ' });
	// 		} else {
	// 			throw new Error('Unknown type: ' + JSON.stringify(t));
	// 		}
	// 	}

	// 	return output;
	// }

	// function parseList(tokens, tokenIndex) {
	// 	let list = { type: 'list', ordered: false, children: [] };
	// 	let currentItemText = [];
	// 	let lastIndex = null;
	// 	let counter = 1;

	// 	for (let i = tokenIndex; i < tokens.length; i++) {
	// 		const t = tokens[i];
	// 		lastIndex = i;

	// 		if (i === tokenIndex && t.type !== 'bullet_list_open' && t.type !== 'ordered_list_open') throw new Error('*_list_open tag expected and got ' + JSON.stringify(t));

	// 		if (t.type == 'bullet_list_open' || t.type == 'ordered_list_open') {
	// 			if (i !== tokenIndex) {
	// 				list.children.push({ text: currentItemText });
	// 				currentItemText = [];
	// 				const r = parseList(tokens, i);
	// 				list.children.push(r.list);
	// 				i = r.lastIndex;
	// 				continue;
	// 			} else {
	// 				list.markup = t.markup;
	// 				list.ordered = t.type === 'ordered_list_open';
	// 			}
	// 		} else if (t.type == 'bullet_list_close' || t.type == 'ordered_list_close') {
	// 			break;
	// 		} else if (t.type == 'list_item_open') {
	// 			currentItemText = [];
	// 			if (list.ordered) {
	// 				currentItemText.push(counter);
	// 				counter++;
	// 			}
	// 			currentItemText.push(list.markup);
	// 			currentItemText.push(' ');
	// 		} else if (t.type == 'list_item_close') {
	// 			if (currentItemText.length) list.children.push({ text: currentItemText });
	// 			currentItemText = [];
	// 		} else if (t.type == 'inline') {
	// 			currentItemText = currentItemText.concat(parseText(t.children));
	// 		} else if (t.type == 'paragraph_open' || t.type == 'paragraph_close') {
	// 			// Ignore it
	// 		} else {
	// 			throw new Error('Unknown type: ' + JSON.stringify(t));
	// 		}
	// 	}

	// 	return {
	// 		list: list,
	// 		lastIndex: lastIndex,
	// 	};
	// }

	// function parseTokens(tokens) {
	// 	let blocks = [];
	// 	let currentBlock = null;
	// 	let inBlockQuote = false;

	// 	for (let i = 0; i < tokens.length; i++) {
	// 		const t = tokens[i];

	// 		if (!currentBlock) currentBlock = {};

	// 		if (t.type == 'heading_open') {
	// 			currentBlock.type = 'heading';
	// 		} else if (t.type == 'heading_close') {
	// 			blocks.push(currentBlock);
	// 			currentBlock = null;
	// 		} else if (t.type == 'inline') {
	// 			if (!('text' in currentBlock)) currentBlock.text = [];
	// 			currentBlock.text = parseText(t.children);
	// 		} else if (t.type == 'paragraph_open') {
	// 			currentBlock.type = 'paragrah';
	// 		} else if (t.type == 'paragraph_close') {
	// 			if (inBlockQuote) currentBlock.inBlockQuote = true;
	// 			blocks.push(currentBlock);
	// 			currentBlock = null;
	// 		} else if (t.type == 'blockquote_open') {
	// 			inBlockQuote = true;
	// 		} else if (t.type == 'blockquote_close') {
	// 			inBlockQuote = false;
	// 		} else if (t.type == 'bullet_list_open' || t.type == 'ordered_list_open') {
	// 			const r = parseList(tokens, i);
	// 			blocks.push(r.list);
	// 			i = r.lastIndex;
	// 		} else {
	// 			throw new Error('Unknown token: ' + JSON.stringify(t));
	// 		}
	// 	}

	// 	return blocks;
	// }

	// function textLength(str) {
	// 	return str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, "").length;
	// };

	// function wrapBlock(block, indent, options) {
	// 	let width = options.width;
	// 	if (width === null) return block.text;

	// 	var reflowed = [];
	// 	var fragments = block.text.split(/(\u001b\[(?:\d{1,3})(?:;\d{1,3})*m)/g);
	// 	var column = 0;
	// 	var currentLine = '';
	// 	var lastWasEscapeChar = false;

	// 	width = width - indent * options.indentChars.length;

	// 	if (block.inBlockQuote) {
	// 		width -= 2;
	// 	}

	// 	while (fragments.length) {
	// 		var fragment = fragments[0];

	// 		if (fragment === '') {
	// 			fragments.splice(0, 1);
	// 			lastWasEscapeChar = false;
	// 			continue;
	// 		}

	// 		// This is an escape code - leave it whole and
	// 		// move to the next fragment.
	// 		if (!textLength(fragment)) {
	// 			currentLine += fragment;
	// 			fragments.splice(0, 1);
	// 			lastWasEscapeChar = true;
	// 			continue;
	// 		}

	// 		var words = fragment.split(/[ \t\n]+/);

	// 		for (var i = 0; i < words.length; i++) {
	// 			var word = words[i];
	// 			var addSpace = column != 0;
	// 			if (lastWasEscapeChar) addSpace = false;

	// 			// If adding the new word overflows the required width
	// 			if (column + word.length + addSpace > width) {

	// 				if (word.length <= width) {
	// 					// If the new word is smaller than the required width
	// 					// just add it at the beginning of a new line
	// 					reflowed.push(currentLine);
	// 					currentLine = word;
	// 					column = word.length;
	// 				} else {
	// 					// If the new word is longer than the required width
	// 					// split this word into smaller parts.
	// 					var w = word.substr(0, width - column - addSpace);
	// 					if (addSpace && w.length) currentLine += ' ';
	// 					currentLine += w;
	// 					reflowed.push(currentLine);
	// 					currentLine = '';
	// 					column = 0;

	// 					word = word.substr(w.length);
	// 					while (word.length) {
	// 						var w = word.substr(0, width);

	// 						if (!w.length) break;

	// 						if (w.length < width) {
	// 							currentLine = w;
	// 							column = w.length;
	// 							break;
	// 						} else {
	// 							reflowed.push(w);
	// 							word = word.substr(width);
	// 						}
	// 					}
	// 				}
	// 			} else {
	// 				if (addSpace) {
	// 					currentLine += ' ';
	// 					column++;
	// 				}

	// 				currentLine += word;
	// 				column += word.length;
	// 			}

	// 			lastWasEscapeChar = false;
	// 		}

	// 		fragments.splice(0, 1);
	// 	}

	// 	if (textLength(currentLine)) reflowed.push(currentLine);

	// 	if (indent) {
	// 		for (let i = 0; i < reflowed.length; i++) {
	// 			reflowed[i] = options.indentChars.repeat(indent) + reflowed[i];
	// 		}
	// 	}

	// 	if (block.inBlockQuote) {
	// 		for (let i = 0; i < reflowed.length; i++) {
	// 			reflowed[i] = '> ' + reflowed[i];
	// 		}			
	// 	}

	// 	return reflowed.join('\n');
	// }

	// function renderBlock(block, indent, options) {
	// 	const chalk = require('chalk');

	// 	let result = '';
	// 	for (let i = 0; i < block.text.length; i++) {
	// 		const t = block.text[i];

	// 		if (typeof t === 'string') {
	// 			result += t;
	// 		} else if (block.type === 'heading') {
	// 			result += chalk.bold(chalk.yellow(chalk.underline(t.text)));
	// 		} else if (!('format' in t)) {
	// 			result += t.text;
	// 		} else if (t.format === 'em') {
	// 			result += chalk.italic(t.text);
	// 		} else if (t.format === 'strong') {
	// 			result += chalk.bold(t.text);
	// 		} else {
	// 			throw new Error('Invalid format: ' + JSON.stringify(block));
	// 		}
	// 	}

	// 	block.text = result;

	// 	result = wrapBlock(block, indent, options);

	// 	return result;
	// }

	// function renderBlocks(blocks, addNewLines, indent, options) {
	// 	let output = [];

	// 	for (let i = 0; i < blocks.length; i++) {
	// 		const block = blocks[i];

	// 		if (i > 0 && addNewLines) output.push('');

	// 		if (block.type == 'list') {
	// 			const r = renderBlocks(block.children, false, indent + 1, options);
	// 			output = output.concat(r);
	// 		} else {
	// 			output.push(renderBlock(block, indent, options));
	// 		}
	// 	}

	// 	return output;
	// }

	// const options = {
	// 	width: 30,
	// 	indentChars: '  ',
	// };

	// let blocks = parseTokens(tokens);

	// //console.info(JSON.stringify(tokens));

	// //	console.info(JSON.stringify(blocks));

	// let rendered = renderBlocks(blocks, true, 0, options);

	// console.info(rendered.join("\n"));


	
	// const marked = require('marked');

	// const block = function(text) {
	// 	return { type: 'block', text: text, children: [], parent: null };
	// }

	// const inline = function(text) {
	// 	return { type: 'inline', text: text };
	// }

	// const tokens = marked.lexer(text1, {
	// 	gfm: true,
	// 	breaks: true,
	// 	sanitize: true,
	// });



	// // console.info(tokens); process.exit();

	// const renderer = {

	// 	currentLists_: [],

	// 	inListItem_: false,

	// 	listId_: 0,

	// 	inBlockQuote_: false,

	// 	indent: function() {
	// 		return this.currentLists_.length;
	// 	},

	// 	currentList: function() {
	// 		return this.currentLists_.length ? this.currentLists_[this.currentLists_.length - 1] : null;
	// 	},

	// 	currentNode: function() {
	// 		if (!this.currentNode_) this.currentNode_ = this.root();
	// 		return this.currentNode_;
	// 	},

	// 	space: function(token) {
	// 		//return { type: 'inline', text: ' ' };
	// 		// Not sure what this is as it comes up even when
	// 		// there's no space on its own. It seems it can be ignored.
	// 	},

	// 	text: function(token) {
	// 		let o = { type: 'inline', text: token.text, indent: this.indent() };
			
	// 		if (this.currentList()) {
	// 			o.text = '* ' + o.text;
	// 			o.listId = this.currentList().id;
	// 		}

	// 		if (this.inBlockQuote_) {
	// 			o.text = '> ' + o.text;
	// 		}

	// 		return o;
	// 	},

	// 	heading: function(token) {
	// 		// TODO: handle depth
	// 		return { type: 'block', text: token.text };
	// 	},

	// 	paragraph: function(token) {
	// 		return { type: 'block', text: token.text, inBlockQuote: this.inBlockQuote_ };
	// 	},

	// 	blockquote_start: function(token) {
	// 		this.inBlockQuote_ = true;
	// 	},

	// 	blockquote_end: function(token) {
	// 		this.inBlockQuote_ = false;
	// 	},

	// 	list_start: function(token) {
	// 		this.listId_++;
	// 		this.currentLists_.push({ type: 'block', children: [], id: this.listId_ });
	// 	},

	// 	list_end: function(token) {
	// 		this.currentLists_.pop();
	// 		return { type: 'inline', text: ' ' };
	// 	},

	// 	loose_item_start: function(token) {
	// 		this.list_item_start(token);
	// 	},

	// 	list_item_start: function(token) {
	// 		this.inListItem_ = true;
	// 	},

	// 	list_item_end: function(token) {
	// 		this.inListItem_ = false;
	// 	},
	// };

	// let nodes = [];
	// for (let i = 0; i < tokens.length; i++) {
	// 	const token = tokens[i];

	// 	if (!(token.type in renderer)) {
	// 		throw new Error('Missing renderer property: ' + JSON.stringify(token));
	// 		continue;
	// 	}

	// 	const r = renderer[token.type](token);
	// 	if (r) {
	// 		if (Array.isArray(r)) {
	// 			nodes = nodes.concat(r);
	// 		} else {
	// 			nodes.push(r);
	// 		}
	// 	}
	// }

	// console.info(nodes);


	// const buildString = function(nodes) {
	// 	let output = [];
	// 	let previousType = null;

	// 	for (let i = 0; i < nodes.length; i++) {
	// 		const node = nodes[i];

	// 		if (previousType === 'block') output.push('');

	// 		let line = node.text;
	// 		if (node.indent) line = '  '.repeat(node.indent) + line;

	// 		output.push(line);
	// 		previousType = node.type;
	// 	}

	// 	return output.join('\n');
	// }

	//console.info(buildString(nodes));












	// term.fullscreen();

	// termutils.hideCursor(term);



	// let items = [
	// 	{ label: "un", },
	// 	{ label: "deux", },
	// 	{ label: "trois", },
	// 	{ label: "quatre", },
	// 	{ label: "cinq", },
	// 	{ label: "six", },
	// 	{ label: "setp", },
	// 	{ label: "heigt", },
	// 	{ label: "nuef", },
	// 	{ label: "dix", },
	// ];

	// for (var i = 0; i < 10000; i++) {
	// 	items.push({label: 'item ' + i});
	// }

	// let items2 = [
	// 	"22_un",
	// 	"22_deux",
	// 	"22_trois",
	// 	"22_quatre",
	// 	"22_cinq",
	// 	"22_six",
	// 	"22_setp",
	// 	"22_heigt",
	// 	"22_nuef",
	// 	"22_dix",
	// ];

	// let customItems = [
	// 	{ id: 1, title: "one" },
	// 	{ id: 2, title: "two" },
	// 	{ id: 3, title: "three" },
	// ];











	// const rootWidget = new RootWidget();
	// rootWidget.name = 'rootWidget';

	// const textWidget = new TextWidget();
	
	// //textWidget.setText('Now is the time');	

	// //textWidget.setText("# mon titre\n\du texte *en gras*\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ligula massa, elementum et pretium sit amet, ornare facilisis libero. Integer ut pharetra augue. Praesent luctus interdum lacus vel faucibus. Morbi mollis ac nulla ac euismod. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi eu nibh augue. Ut at est malesuada, luctus tortor ac, tristique lacus. Donec vel nunc ut dui ultricies ultrices at sed odio. Morbi tempus tellus quis orci elementum consectetur id eu nibh FIN.");
	// //textWidget.text = '# Longlongtitle\n\nAs they rounded a bend in the path that ran beside the *river*, Lara recognized the *silhouette* of a fig tree atop a nearby hill. The weather was hot and the days were long. The fig tree was in full leaf, but not yet bearing fruit.';

	// //textWidget.text = "# title\n\n* Lorem ipsum dolor sit amet\n* Item consectetur adipiscing elit.\n* Ut ligula massa, elementum et\n* pretium sit amet, ornare facilisis libero\n\n\n1. one one one one one one one one\n2. two two two two two two two two\n3. ThreeThreeThreeThreeThreeThreeThreeThree";

	// //textWidget.text = "* ul item item item item item item item \n    * ul item 2\n    * ul item 3";

	// textWidget.text = "* ul item item item item item item item \n    * ul item 2\n    * ul item 3";

	// //textWidget.text = "  some spaces some spaces some spaces some spaces some spaces ";

	// //textWidget.text = "# title\n\n* Lorem ipsum dolor sit amet\n* Item consectetur adipiscing elit.\n* Ut ligula massa, elementum et\n* pretium sit amet, ornare facilisis libero";

	// //textWidget.text = "O Item1234 456";

	// //textWidget.setText("1234567890 1234567890");
	// //textWidget.setText("123456789 1234 56789");
	// textWidget.name = 'textWidget';
	// textWidget.setWidth(30);
	// textWidget.setVStretch(true);
	// textWidget.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });

	// const win1 = new WindowWidget();
	// win1.addChild(textWidget);
	// win1.name = 'win1';

	// rootWidget.addChild(win1);

	// renderer = new Renderer(term, rootWidget);
	// renderer.start();









	// const rootWidget = new RootWidget();
	// rootWidget.setName('rootWidget');

	// const listWidget1 = new ListWidget();
	// listWidget1.setItems(customItems);
	// listWidget1.setItemRenderer((item) => { return item.title + ' (' + item.id + ')'; });
	// listWidget1.setLocation(1, 1);
	// listWidget1.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });
	// listWidget1.setName('listWidget1');
	// listWidget1.setVStretch(true);
	// listWidget1.on('currentItemChange', function() {
	// 	ilog(listWidget1.currentItem());
	// });

	// const listWidget2 = new ListWidget();
	// listWidget2.setLocation(25, 1);
	// listWidget2.setItems(items2);
	// listWidget2.setName('listWidget2');
	// listWidget2.setVStretch(true);
	// listWidget2.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });

	// const textWidget = new TextWidget();
	// textWidget.setLocation(50, 1);
	// textWidget.setVStretch(true);
	// textWidget.setText("# mon titre\n\du texte *en gras*\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ligula massa, elementum et pretium sit amet, ornare facilisis libero. Integer ut pharetra augue. Praesent luctus interdum lacus vel faucibus. Morbi mollis ac nulla ac euismod. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi eu nibh augue. Ut at est malesuada, luctus tortor ac, tristique lacus. Donec vel nunc ut dui ultricies ultrices at sed odio. Morbi tempus tellus quis orci elementum consectetur id eu nibh FIN.");
	// textWidget.setName('textWidget');
	// textWidget.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });

	// const listWidget3 = new ListWidget();
	// listWidget3.setItems(items2);
	// listWidget3.setHStretch(true);
	// listWidget3.setName('listWidget3');
	// listWidget3.setStyle({
	// 	borderTopWidth: 1,
	// 	borderBottomWidth: 1,
	// 	borderLeftWidth: 1,
	// 	borderRightWidth: 1,
	// });

	// const layout1 = new HLayoutWidget();
	// layout1.addChild(textWidget, { type: 'fixed', factor: 20 });
	// layout1.addChild(listWidget1, { type: 'stretch', factor: 60 });
	// layout1.addChild(listWidget2, { type: 'stretch', factor: 60 });

	// const layout2 = new VLayoutWidget();
	// layout2.addChild(layout1, { type: 'stretch', factor: 1 });
	// layout2.addChild(listWidget3, { type: 'fixed', factor: 5 });

	// const win1 = new WindowWidget();
	// win1.addChild(layout2);
	// //win1.addChild(layout1);
	// win1.setName('win1');
	// win1.setLocation(1,1);

	// rootWidget.addChild(win1);

	// renderer = new Renderer(term, rootWidget);
	// renderer.start();

	












	// term.grabInput();

	// term.on('key' , function( name , matches , data ) {
	// 	if (name === 'CTRL_C' ) {
	// 		termutils.showCursor(term);
	// 		term.fullscreen(false);
	// 		process.exit();
	// 	}

	// 	if (name === 'CTRL_J') {
	// 		consoleWidget.focus();
	// 	}

	// 	if (name == 't') {
	// 		if (win1.isActiveWindow) {
	// 			win2.activate();
	// 		} else {
	// 			win1.activate();
	// 		}
	// 	}
	// });
}

main();
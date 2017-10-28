class ScreenWrapper {

	constructor(screenBuffer) {
		this.buffer_ = screenBuffer;
	}

	moveTo(x, y) {
		return this.buffer_.moveTo(x, y);
	}

	write(string, style = null) {
		return this.buffer_.put({attr: { color: 'red' , underline: true }}, string);
	}

	draw(x, y) {
		return this.buffer_.draw({x:x, y:y});
	}

}

module.exports = ScreenWrapper;
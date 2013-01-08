function randomDateBetween(start, end) {
	
	/*
	* Returns random Date between start and end Dates passed
	*/
	
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min, max) {
	
	 /*
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function textNearPhrase(text, phrase, numChars) {
	
	/*
	* Returns all text within a certain number of characters surrounding a phrase found within the text
	*/
	
	var phraseIndex = text.toLowerCase().indexOf(phrase.toLowerCase());
	if (phraseIndex == -1) {
		return null;
	}
	var startIndex = phraseIndex - numChars;
	if (startIndex < 0) {
		startIndex = 0;
	}
	var endIndex = phraseIndex + numChars;
	if (endIndex > text.length) {
		endIndex = text.length;
	}
	return text.substring(startIndex, endIndex);
}
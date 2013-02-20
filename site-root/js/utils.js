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

function citationWikitext(attributes) {
	
	/*
	* Ex.) {
			'type': 'news', 
			'fields': {
				'last': 'Caisse',
				'first': 'Peter',
				'title': 'Good Stuff'
			}
			
	}
	*/
	
	if (attributes.length > 0) {
		// open
		var wikitext = "<ref>{{cite " + attributes.type + "|";
		// loop over dictionary
		_.map(attributes.fields, function(key, value) {
			wikitext += key + "=" + value + "|";
		});
		// close
		wikitext += "}}</ref>";
		// return wikitext
		return wikitext;
	} else {
		return null;
	}
	
}
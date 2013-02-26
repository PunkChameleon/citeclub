var WikitextProcessor = {
	
	/*
	* Processes Wikitext (or Wiki markup)
	*/

	needsCitationPattern: /\{{2}(Citation needed|Fact|Cn)((?!}})[^])*\}{2}/, // See http://en.wikipedia.org/wiki/Template:Citation_needed

	citationNeededParagraph: function(text) {
		
		/*
		* Returns paragraph that citation needed flag is in
		*/
		
		var lineBreakPattern = /(\r\n|\n|\r)/;
		var citationNeededParagraphsPattern = new RegExp(lineBreakPattern.source + ".+" + WikitextProcessor.needsCitationPattern.source + ".*" + lineBreakPattern.source);
		var paragraph = text.match(citationNeededParagraphsPattern);
		if (paragraph !== null) {
			return paragraph[0];
		} else {
			return null;
		}
	},
	
	citationNeededSections: function(text) {
		
		/*
		* Returns array with section number and text
		* for all sections needing a citation 
		*/
	
		// create array to hold citation needed section number and text
		var citationNeededSections = [];
		
		var topSectionPattern = /^(((?!==)[^])+)/;
		var allSectionsPattern = /(={2,3}((?!==).)+={2,3}((?!==)[^])+)/g;
	
		// get top section text (everything up to start of first section)
		var topSection = text.match(topSectionPattern);
		if (topSection !== null) {
			var topSectionText = topSection[0];
			if (topSectionText.match(WikitextProcessor.needsCitationPattern)) {
				citationNeededSections.push({'section': 0, 'text': topSectionText});
			}
		}
	
		// get text for all other sections
		var allSections = text.match(allSectionsPattern);
		
		if (allSections !== null) {
			// loop over sections
			allSections.map(function(sectionText, index) {
				// check if section needs citation
				if (sectionText.match(WikitextProcessor.needsCitationPattern)) {
					citationNeededSections.push({'section': index+1, 'text': sectionText});
				}
			});
		}
		
		return citationNeededSections;
	},
	
	firstCitationNeededSectionText: function(text) {
		
		/*
		* Searches text passed and returns text of first section needing a citation
		*/
		
		var sections = this.citationNeededSections(text);
		
		if (sections !== undefined && sections !== null && sections.length > 0)
			return sections[0];
		else
			return null;
	},
	
	buildCitationWikitext: function(attributes) {
	
		/*
		* Hashmap of citation attributes is translated into wikitext
		* ex.) 
				{'type': 'news', 'fields': { 'last': 'Caisse', 'first': 'Peter', 'title': 'Good Stuff'}} 
												becomes 
				<ref>{{cite news|last=Caisse|first=Peter|title=Good Stuff}}</ref>
		*/
		
		if (attributes !== undefined && attributes !== null) {
			try {
				// open
				var wikitext = "<ref>{{cite " + attributes.type;
				// loop over dictionary
				var fields = attributes.fields;
				for (var i in fields) {
					wikitext +=  "|" + i + "=" + fields[i];
				}
				// close
				wikitext += "}}</ref>";
				// return wikitext
				return wikitext;
			} catch (err) {
				console.log(err);
				return null;
			}
		} else {
			return null;
		}
		
	},
	
	citedSectionWikitext: function(sectionText, citationText) {
		
		/*
		* Replaces citation need wikitext ({{Citation needed}}) in section text
		* with citation wikitext (<ref>{{cite web|title=Title}}</ref>)
		*/
			
		return sectionText.replace(WikitextProcessor.needsCitationPattern, citationText);
	}
}

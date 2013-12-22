var WikitextProcessor = {
	
	/*
	* Processes Wikitext (or Wiki markup)
	*/

	needsCitationPattern: /\{{2}(Citation needed|Fact|Cn)((?!}})[^])*\}{2}/i, // See http://en.wikipedia.org/wiki/Template:Citation_needed
	lineBreakPattern: /(\r\n|\n|\r)/,
	citationNeededText: 'citation needed',

	citationNeededParagraph: function(text) {
		
		/*
		* Returns paragraph that citation needed flag is in
		*/
		
		var citationNeededParagraphsPattern = new RegExp(WikitextProcessor.lineBreakPattern.source + ".+" + WikitextProcessor.needsCitationPattern.source + ".*" + WikitextProcessor.lineBreakPattern.source);
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
											       |
											    becomes
											       |
											       V 
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
		* Replaces citation needed wikitext ({{Citation needed}}) in section text
		* with citation wikitext (<ref>{{cite web|title=Title}}</ref>)
		*/
			
		return sectionText.replace(WikitextProcessor.needsCitationPattern, citationText);
	},

	hasRefList: function(text) {

		/*
		* Returns true if text contains a reference list, otherwise false
		*/

		return /\{\{reflist/i.test(text); 
	},

	wrapInBrackets: function(text) {
		return '[' + text + ']';
	},

	quoteText: function(text) {

		var matches = text.match(WikitextProcessor.needsCitationPattern);
		if (matches) {
			var matchText = matches[1];
			if (matchText) {
				var matchTextIndex = text.indexOf(matchText),
					sectionA = text.substring(0, matchTextIndex),
					sectionB = text.substring(matchTextIndex + matchText.length, text.length),
					lineBreakPatternLast = new RegExp("[^]*(?=" + WikitextProcessor.lineBreakPattern.source + ")"),
					sectionAMatches = sectionA.match(lineBreakPatternLast),
					sectionBMatches = sectionB.match(WikitextProcessor.lineBreakPattern),
					sectionAStartIndex = sectionAMatches ? sectionAMatches[0].length : 0,
					sectionAEndIndex = sectionA.length,
					sectionBStartIndex = 0,
					sectionBEndIndex = sectionBMatches ? sectionBMatches.index : sectionB.length;
					resultWikitext = sectionA.substring(sectionAStartIndex, sectionAEndIndex) + matchText + sectionB.substring(sectionBStartIndex, sectionBEndIndex),
					resultText = resultWikitext
									.replace(WikitextProcessor.needsCitationPattern, ' <a>' + WikitextProcessor.wrapInBrackets(WikitextProcessor.citationNeededText) + '</a>')
									.replace(/\{{2}(((?!\{{2}).)+)\}{2}/g, '')			 // removes {{a}}
									.replace(/\'{2,5}(((?!\'{2,5}).)+)\'{2,5}/g, '$1') 	 // replaces ''a'' with a
									.replace(/\[{2}[^\|]+\|(((?!\[{2}).)+)\]{2}/g, '$1') // replaces [[a|b]] with b
									.replace(/\[{2}(((?!\[{2}).)+)\]{2}/g, '$1') 		 // replaces [[a]] with a
									.replace(/((\r\n|\n|\r|^)\| ?)/, '') 			     // remove initial pipes and line break
									.replace(/((\r\n|\n|\r|^)\* ?)/, ''); 			     // remove initial asterisk and line break

				return resultText;
			}
		}
	}
}

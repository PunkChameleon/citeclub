asyncTest( "citation needed sections for Stankonia", function() {
	$.get("/tests/data/stankoniaAll.txt", function(allWikitext){
		$.get("/tests/data/stankoniaCNSection.txt", function(CNSectionWikitext){
			var returnedResult = WikitextProcessor.firstCitationNeededSectionText(allWikitext);
			var expectedResult = {'section': 1, 'text': CNSectionWikitext};
			ok(JSON.stringify(returnedResult) == JSON.stringify(expectedResult), "Passed!" );
			start();
		});
	});
});

test("build citation wikitext", function() {
	var input = {'type': 'news', 'fields': { 'last': 'Caisse', 'first': 'Peter', 'title': 'Good Stuff'}};
	var result = WikitextProcessor.buildCitationWikitext(input);
	var expectedResult = "<ref>{{cite news|last=Caisse|first=Peter|title=Good Stuff}}</ref>";
	ok(result==expectedResult, "Passed!");
});

asyncTest("cited section", function() {
	$.get("/tests/data/stankoniaCNSection.txt", function(CNSectionWikitext){
		var citationWikitext = "<ref>{{cite news|last=Caisse|first=Peter|title=Good Stuff}}</ref>";
		var expectedResult = "== Section 1 ==\n\nThis is section 1. This is section 1. This is section 1. This is section 1 " + citationWikitext + ". This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. Peter!!! This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. This is section 1. end of section 1\n\n";
		var returnedResult = WikitextProcessor.citedSectionWikitext(CNSectionWikitext, citationWikitext);
		ok(returnedResult == expectedResult, "Passed!" );
		start();
	});
});
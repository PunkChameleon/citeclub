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
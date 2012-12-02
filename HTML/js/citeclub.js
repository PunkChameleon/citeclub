// global constants
var API_URL = "http://en.wikipedia.org/w/api.php";
var CITATION_NEEDED = "citation needed";

// define and instantiate class to hold page data
function PageDataArray(){};
PageDataArray.prototype = new Array();
PageDataArray.prototype.unusedPages = function() {
	return this.filter(function(page) { return page.used == false ; });
}
PageDataArray.prototype.hasPage = function(id) {
	return (this.filter(function(page) { return page.id == id ; }).length > 0);
}
var pages = new PageDataArray(); // array to hold all citation needed page data

function citationNeededPage(keywords, pageFound) {
	
	/*
	* Get citation needed Wikipedia page URL
	* If keywords were passed, use them to search. Otherwise, get random pages.
	*/
	
	var nextUnusedPage = pages.unusedPages()[0];
	var resultAlreadyFound = false;
	
	if (nextUnusedPage && keywords == nextUnusedPage.keywords) {
		// we already have a page to use and it's related to the same keywords
		nextUnusedPage.used = true;
		pageFound(nextUnusedPage);
	} else {
		// we need to look for URLs
		pageIds(keywords, function(pageIds) {
			citationNeededPageData(keywords, pageIds, function(result) {
				var retry = false;
				if (result != null) {
					// if there are no unused pages, use only first one (this one)
					result.used = (resultAlreadyFound == false && pages.unusedPages().length == 0);
					// at least one page found this time around
					resultAlreadyFound = true;
					// add page only if hasn't already been added
					if (!pages.hasPage(result.id)) {
						// save in array
						pages.push(result);
						// pass result with callback only if page is new AND is to be used
						if (result.used) {
							pageFound(result);
						} 
					} else {
						// page already added, retry
						retry = true;
					}
				} else {
					// no results found, retry
					retry = true;
				}
				if (retry == true) {
					//  function calls itself again
					citationNeededPage(keywords, pageFound);
				}
			});
		});
	}
}
	
function pageIds(keywords, foundPages) {

	/*
	* If keywords were passed, use them to search for pages and return their ids.
	* Otherwise, find the page ids of 10 random Wikipedia pages.
	*/
	
	var isFiltered = (keywords && keywords.length > 0);
	
	var randomParams = {
						'action': 'query', 
						'list': 'random', 
						'format': 'json', 
						'rnlimit': 10, 
						'rnnamespace': 0
					};
				
	// example URL: http://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnlimit=10&rnnamespace=0
	
	var filteredParams = {
						'action': 'query',
						'generator': 'search',
						'gsrsearch': keywords, 
						'format': 'json'
					};
	
	// example URL: http://en.wikipedia.org/w/api.php?action=query&generator=allpages&gaplimit=500&gapfrom=dog&format=json
	
	var queryParams = isFiltered ? filteredParams : randomParams;
	
	$.ajax({
		dataType: 'jsonp',
		url: API_URL,
		data: queryParams,
		success: function(data) {
			var ids = new Array();
			if (isFiltered) {
				var obj = data.query.pages;
				for (var prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						ids.push(obj[prop].pageid);
					 }
				}
			} else
				ids = data.query.random.map(function(random) { return random.id; });
			foundPages(ids);
		},
		error: function(xhr, error){
			console.debug(xhr);
			console.debug(error);
		}
	});
}

function citationNeededPageData(keywords, pageIds, resultReturned) {

	/*
	* Look for [citation needed] in Wikipedia pages until one is found. 
	* If none found, call for more random pages.
	*/
	
	var numFailedPages = 0;
	var numPages = pageIds.length;
	
	// example: http://en.wikipedia.org/w/api.php?action=parse&pageid=736&format=json
	
	// iterate over page ids
	pageIds.map(function(pageId) {
	
		// request Wikipedia page using page id
		$.ajax({
			dataType: 'jsonp',
			url: API_URL,
			data: {'action': 'parse', 
				   'pageid': pageId, 
				   'format': 'json'},
			success: function(data) {
				var html = data.parse.text['*'];
				if (html.indexOf(CITATION_NEEDED) !== -1) {
					// "citation needed" found
					var title = data.parse.title;
					resultReturned({'id':pageId, 'title':title, 'keywords':keywords});
				} else {
					// not found
					numFailedPages++;
					if (numFailedPages==numPages) {
						// we've parsed all the pages we had and no dice
						resultReturned(null);
					}								
				}
			},
			error: function(xhr, error){
				console.debug(xhr);
				console.debug(error);
			}
		});
	});
}

function urlFromPageId(pageId) {

	/* 
	* Return Wikipedia page URL using pageId passed
	*/

	var PAGE_URL = "http://en.wikipedia.org/wiki";
	return PAGE_URL + "?" + "curid=" + pageId;
}




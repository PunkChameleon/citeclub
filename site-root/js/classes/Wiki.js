

function Wiki(wikiURL) { 
	
	/*
	* Query Wiki via API
	*/

	var wikiURL = wikiURL;
	var apiURL = wikiURL + "/w/api.php";
	
	this.citationNeededPage = citationNeededPage;
	this.getPageHTML = getPageHTML;
	this.getPageContent = getPageContent;
	this.citationNeededPagesByKeyword = citationNeededPagesByKeyword;
	this.urlFromPageId = urlFromPageId;
	
	function citationNeededPage(keywords, pageFound) {
		
		/*
		* Get citation needed Wikipedia page data
		*/
		
		if (keywords.length > 0) {
			// some keywords were passed
			citationNeededPagesByKeyword(keywords, function(result){
				pageFound(result[0]);
			});
		} else {		
			// no keywords passed
			randomCitationNeededPages(function(result) {
				var randomNum = randomInt(0, result.length-1);
				pageFound(result[randomNum]);
			});
		}
	}
	
	function getPageHTML(pageId, foundHTML) {
		
		/*
		* Returns HTML for page id passed
		*/
				
		var params = {
					'action': 'parse', 
					'pageid': pageId, 
					'format': 'json'
		};
		
		// example: http://en.wikipedia.org/w/api.php?action=parse&pageid=736&format=json
		
		$.ajax({
			dataType: 'jsonp',
			url: apiURL,
			data: params,
			success: function(data) {
				var html;
				if (data.parse) {
					html = data.parse.text['*'];
				}
				foundHTML(html);
			},
			error: function(xhr, error){
				console.debug(xhr);
				console.debug(error);
			}
		});
	}
	
	function getPageContent(pageIds, foundContent) {
		
		/*
		* Get page content (in Wikipedia markup) for all page ids passed
		*/
		
		pageIdsStr = $.isArray(pageIds) ? pageIds.join('|') : pageIds; // pageIds can be an array or a single value
		
		var params = {
							'action': 'query',
							'pageids': pageIdsStr,
							'prop': 'revisions',
							'rvprop': 'content',
							'format': 'json'					
		};
		
		// example: http://en.wikipedia.org/w/api.php?format=jsonfm&action=query&pageids=736|4453&prop=revisions&rvprop=content
		
		$.ajax({
			dataType: 'jsonp',
			url: apiURL,
			data: params,
			success: function(data) {
				var content = [];
				if (data.query) {
					var obj = data.query.pages;
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) {
							content.push({'id': obj[prop].pageid, 'title': obj[prop].title, 'content': obj[prop].revisions[0]['*']});
						 }
					}
				}
				if (content.length == 1) {
					// there's only one result, so let's return just its text by itself
					foundContent(content[0].content);
				} else {
					// return whole array
					foundContent(content);	
				}
			},
			error: function(xhr, error){
				console.debug(xhr);
				console.debug(error);
			}
		});
	}
	
	function randomCitationNeededPages(foundPages) {
		
		/*
		* Find data for random [citation needed] pages
		* Returns array of ids and titles
		*/
		
		var randomISODate = randomDateBetween(new Date(2007, 2, 8, 12, 18, 51), new Date()).toISOString(); // oldest page in this category (as of the time this code was written) is from 2007-02-08T12:18:51Z			
					
		var params = {
							'action': 'query',
							'list': 'categorymembers',
							'cmtitle': 'Category:All_articles_with_unsourced_statements', // Category:All articles with unsourced statements
							'cmlimit': 500,
							'cmsort': 'timestamp',
							'cmstart': randomISODate,
							'cmprop': 'ids|title',
							'format': 'json'					
		};
		
		// example URL: http://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmpageid=9329647&cmlimit=500&cmsort=timestamp&cmstart=2007-11-02T12:51:15Z&cmprop=ids|title|timestamp
		
		$.ajax({
			dataType: 'jsonp',
			url: apiURL,
			data: params,
			success: function(data) {
				var pageData = new Array();
				var cms = data.query.categorymembers;
				if (cms)
					pageData = cms.map(function(cm) { return {'id':cm.pageid, 'title':cm.title}; });
				foundPages(pageData);
			},
			error: function(xhr, error){
				console.debug(xhr);
				console.debug(error);
			}
		});
	}
	
	function citationNeededPagesByKeyword(keywords, foundPages) {
		
		/*
		* Return [citation needed] pages based on keywords passed
		*/
		
		var params = {
						'action': 'query',
						'generator': 'search',
						'gsrsearch': keywords, 
						'format': 'json',
						'prop': 'categories',
						'clcategories': 'Category:All articles with unsourced statements'
					};
		
		// example URL: http://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=dog&format=json&prop=categories
					
		$.ajax({
			dataType: 'jsonp',
			url: apiURL,
			data: params,
			success: function(data) {
				var pages = new Array(); // array to hold page data
				if (data.query && data.query.pages) {
					var obj = data.query.pages;
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) {
							var categories = obj[prop].categories;
							if (categories) {
								pages.push({'id':obj[prop].pageid, 'title':obj[prop].title});
							}
						 }
					}
				}
				foundPages(pages);
			},
			error: function(xhr, error){
				console.debug(xhr);
				console.debug(error);
			}
		});
	}
	
	function urlFromPageId(pageId) {
	
		/* 
		* Return Wikipedia page URL using pageId passed
		*/
	
		var pageURL = wikiURL + "/wiki";
		return pageURL + "?" + "curid=" + pageId;
	}

}



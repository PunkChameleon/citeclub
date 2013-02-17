$(document).ready(function() {
	
	// hide edit and login forms
	$('form#edit').hide();
	$('form#login').hide();


	function showCorrectForm(param) {
			$('#cite_buttons #' + param).click(function() {
			$('#cite_buttons').hide();
			if ($('#forms form').is(':visible')) {
				$('#forms').hide()
			}
			$('#forms form#'+ param).show();
		});
	}

	showCorrectForm('web');
	showCorrectForm('news');
	showCorrectForm('book');
	showCorrectForm('journal');

	$.get('/ajax/getWikiURL.php', function(wikiURL) {

		var wiki = new Wiki(wikiURL);
	
		$('#searching').html("Searching for a page that needs your help...");
	
		// add event handler to link
		$('#citeIt').click(function() {
			$('#cite_or_skip').hide();
			$('#cite_buttons').show();
			
		});
		
		//Set up Skipping Event
		$('#skipIt').click(function() {
			newPage(wiki);
		});
		
		//Set up "Look" Event
		$('#newPage').click(function() {
			var keywords = $.trim($('#keywords').val());
			newPage(wiki, keywords);
		});
		
		//Set up Random "Roll the Dice" event
		$('#dice').click(function() {
			newPage(wiki);
		});
	
		// get new page automatically
		$('#skipIt').click();
		
		$('#showLogin').click(function() {
			$('form#login').show();
		});
	});
});

function newPage(wiki, keywords) {

	/*
	* Gets new page URL, displays iframe (in case it's hidden), and sets iframe src to it
	*/

	// disable button and edit form while searching
	$('#newPage').prop('disabled', true);
	$('#explanation, blockquote, form#edit').hide();
	$('#searching').empty();

	wiki.citationNeededPage(keywords, function(pageData) {
		if (pageData != null) {
		// data found!

			// get page id and title
			var id = pageData.id;
			var title = pageData.title;
			
			wiki.getPageContent(id, function(content) {
				wiki.getPageHTML(id, function(html) {
												
					$('#searching').html("Page found!");

					// give page id to edit form
					$('form#edit #pageId').val(id);

					// text for this section in Wikipedia markup language
					var firstSection = WikitextProcessor.firstCitationNeededSectionText(content);
					var sectionText;
					var sectionNum;
					
					if (firstSection !== null) {
						sectionNum = firstSection['section'];
						sectionText = firstSection['text'];
					} else {
						sectionText = content;
					}
					
					// set section
					if (sectionNum !== undefined) {
						$('form#edit #section').val(sectionNum);
					}
					
					// set text
					$('form#edit #text').html(sectionText);
					
					// set article title & link
					$('#article_link').html('<a href="' + wiki.urlFromPageId(id) + '">' + title + '</a>');
					
					// set paragraph 
					var paragraphHTML = $(html).find(":contains('citation needed')").parent().html();
					$('#quote').html(paragraphHTML);
					
					// show article info & edit form
					$('#explanation, #quote, form#edit').show();
					
					// enable button
					$('#newPage').prop('disabled', false);
				});
			});

		} else {
			// couldn't find any pages
			$('#searching').html("No pages found.");
			// hide article info
			$('#explanation, blockquote, form#edit').hide();
			// enable button
			$('#newPage').prop('disabled', false);
		}

	});
}



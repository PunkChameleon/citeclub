$(document).ready(function() {
	
	// hide edit and login forms
	$('form#edit').hide();
	$('form#login').hide();

	//Initialize Colorbox
	$(".inline").colorbox({inline:true, width:"50%"});
	//$(".iframe").colorbox({iframe:true, width:"80%", height:"80%"});

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
	
	//Create a send Spinner (spin.js)
	var opts = {
	  lines: 11, // The number of lines to draw
	  length: 30, // The length of each line
	  width: 20, // The line thickness
	  radius: 31, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 0, // The rotation offset
	  color: '#000', // #rgb or #rrggbb
	  speed: 1, // Rounds per second
	  trail: 60, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: 'auto', // Top position relative to parent in px
	  left: 'auto' // Left position relative to parent in px
	};
	
	var target = document.getElementById('quote');
	var spinner = new Spinner(opts).spin(target);

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



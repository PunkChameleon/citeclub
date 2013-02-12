$(document).ready(function() {

	$('#citeIt').click(function() {
		$('#cite_or_skip').hide();
		$('#cite_buttons').show();
	});

	function showCorrectForm(param) {
			$('#cite_buttons #' + param).click(function() {
			//alert('hey')
			$('#cite_buttons').hide();
			//alert('hey')
			if ($('#forms form').is(':visible')) {
				$('#forms').hide()
			}
			//alert('hey')
			$('')
			$('#forms form#'+ param).show();
			//alert('he')
		});
	}

	showCorrectForm('web');
	showCorrectForm('news');
	showCorrectForm('book');
	showCorrectForm('journal');


});
$(document).ready(function() {

	$('#citeIt').click(function() {
		$('#cite_or_skip').hide();
		$('#cite_buttons').show();
	});

	function showCorrectForm(param) {
			$('#' + param).click(function() {
			//alert('hey')
			$('#cite_buttons').hide();
			//alert('hey')
			$('#forms').hide();
			//alert('hey')
			$('#forms form#'+ param).show();
			//alert('he')
		});
	}

	showCorrectForm('web');
	showCorrectForm('news');
	showCorrectForm('book');
	showCorrectForm('journal');


});
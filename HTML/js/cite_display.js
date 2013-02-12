$(document).ready(function() {

	function formShowSwitcher(param) {
		$('#forms #' + param).show();
	}

	formShowSwitcher();

	$('#forms #chooser').change(function() {)
		formShowSwitcher($(this).val())
	});

});
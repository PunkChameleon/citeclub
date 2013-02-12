
/*
* PageDataArray extends Array
*/

function PageDataArray(){};
PageDataArray.prototype = new Array();

PageDataArray.prototype.unusedPages = function() {

	/*
	* Returns all unused pages
	*/

	return this.filter(function(page) { return page.used == false ; });
}
PageDataArray.prototype.hasPage = function(id) {

	/*
	* Returns boolean that is 'true' if there is a page with the id passed, otherwise 'false'
	*/

	return (this.filter(function(page) { return page.id == id ; }).length > 0);
}
PageDataArray.prototype.hasPages = function(ids) {

	/*
	* Returns boolean that is 'true' only if there is a page for all ids passed, otherwise 'false' 
	*/

	return (this.filter(function(page) { return ids.indexOf(page.id) >= 0 ; }).length > 0); // will not work on IE8 or older
}
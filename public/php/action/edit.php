<?php

try {

	// include files
	include('../MediaWiki.class.php');
	include('../MediaWiki.config.php');

	// get message and page id passed from form
	$text = $_POST['text'];
	$pageId = $_POST['pageId'];
	$sectionNum = $_POST['section'];
	
	$editXML = MediaWiki::edit($pageId, $text, $sectionNum);

	echo json_encode($editXML);
	exit();
	
} catch (Exception $e) {
	die("Edit failed: " . $e->getMessage());
}
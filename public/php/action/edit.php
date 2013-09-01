<?php

try {

	// include files
	include('../MediaWiki.class.php');
	include('../MediaWiki.config.php');

	// get message and page id passed from form
	$pageId = $_POST['pageId'];
	$sectionNum = $_POST['sectionNum'];
	$text = $_POST['text'];
	$summary = 'CiteClub Citation';
	
	echo MediaWiki::edit($pageId, $sectionNum, $text, $summary);

	exit();
	
} catch (Exception $e) {
	die("Edit failed: " . $e->getMessage());
}
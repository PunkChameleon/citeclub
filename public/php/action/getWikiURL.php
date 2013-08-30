<?php

try {

	// include files
	include('../MediaWiki.class.php');
	include('../MediaWiki.config.php');
	
	echo MediaWiki::$wikiURL;

	exit();
	
} catch (Exception $e) {
	die("Wiki URL retrieval failed: " . $e->getMessage());
}
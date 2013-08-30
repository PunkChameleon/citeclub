<?php

try {

	// include files
	include('../MediaWiki.class.php');
	include('../MediaWiki.config.php');
	
	echo MediaWiki::get(http_build_query($_GET));

	exit();
	
} catch (Exception $e) {
	die("Query failed: " . $e->getMessage());
}
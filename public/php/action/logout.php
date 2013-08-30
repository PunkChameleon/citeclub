<?php

try {

	// include files
	include('../MediaWiki.class.php');
	include('../MediaWiki.config.php');

	// log out of Wikipedia
	$logoutXML = MediaWiki::logout();
	
	// destroy session
	session_start();
	session_destroy();
	
	echo json_encode($logoutXML);
	exit();
	
} catch (Exception $e) {
	die("Logout failed: " . $e->getMessage());
}
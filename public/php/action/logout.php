<?php

try {

	// include files
	include('../MediaWiki.class.php');
	include('../MediaWiki.config.php');

	// log out of Wikipedia
	$logout = MediaWiki::logout();
	
	// destroy session
	session_start();
	session_destroy();
	
	echo $logout;
	exit();
	
} catch (Exception $e) {
	die("Logout failed: " . $e->getMessage());
}
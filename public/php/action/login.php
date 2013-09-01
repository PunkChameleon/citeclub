<?php

try {

	// include files
	include('../MediaWiki.class.php');
	include('../MediaWiki.config.php');

	// get username and password passed from form
	$username = $_POST['username'];
	$password = $_POST['password'];
	
	// login and get login data from test.wikipedia.org
	$login = MediaWiki::login($username, $password);
	
	if (!is_null($login)) {
		// start new session
		session_start();
		// save username for this session
		$_SESSION['username'] = $username;	
	}
	
	echo $login;
	exit();
	
} catch (Exception $e) {
	echo "Login failed: " . $e->getMessage();
	die();
}


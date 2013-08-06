<?php

try {

	// include files
	include('../MediaWiki.class.php');
	include('../MediaWiki.config.php');

	// get username and password passed from form
	$username = $_POST['username'];
	$password = $_POST['password'];
	
	// login and get login data from test.wikipedia.org
	$loginXML = MediaWiki::login($username, $password);
	
	if (!is_null($login)) {
		// start new session
		session_start();
		// save login data for this session
		foreach ($login as $key => $value) {
			$_SESSION[$key] = $value;	
		}
		// create session var for Wiki URL
		$_SESSION['wikiURL'] = Wiki::$wikiURL;
	}
	
	echo json_encode($loginXML);
	exit();
	
} catch (Exception $e) {
	echo "Login failed: " . $e->getMessage();
	die();
}

?>


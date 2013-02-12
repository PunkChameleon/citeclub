<?php

try {
	// get username and password passed from form
	$username = $_POST['username'];
	$password = $_POST['password'];
	
	// login and get login data from test.wikipedia.org
	$login = Wiki::login($username, $password);
	
	if (!is_null($login)) {
		// start new session
		session_start();
		// save login data for this session
		foreach ($login as $key => $value) {
			$_SESSION[$key] = $value;	
		}
		// create session var for Wiki URL
		$_SESSION['wikiURL'] = Wiki::$wikiURL;
	} else {
		$redirectParam = '?login=0'; 
	}
	
	// redirect
	header('Location:  /' . $redirectParam);
	exit();
	
} catch (Exception $e) {
	die("Login failed: " . $e->getMessage());
}

?>


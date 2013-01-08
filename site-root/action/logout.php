<?php

try {
	// log out of Wikipedia
	Wiki::logout();
	
	// destroy session
	session_start();
	session_destroy();
	
	// redirect
	header('Location:  /index.php');
	exit();
	
} catch (Exception $e) {
	die("Logout failed: " . $e->getMessage());
}

?>
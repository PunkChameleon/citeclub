<?php

try {
	
	session_start();
	echo $_SESSION['username'];
	exit();
	
} catch (Exception $e) {
	die("Error getting user: " . $e->getMessage());
}
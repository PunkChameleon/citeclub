<?php

try {
	// get message and page id passed from form
	$text = $_POST['text'];
	$pageId = $_POST['pageId'];
	
	// write message in sandbox
	$result = Wiki::edit($pageId, $text);
	
	if ($result) {	
		// redirect
		$urlEncodedResult = http_build_query($result);
		header('Location:  /index.php?' . $urlEncodedResult);
		exit();
	}
	
} catch (Exception $e) {
	die("Edit failed: " . $e->getMessage());
}

?>
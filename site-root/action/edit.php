<?php

try {
	// get message and page id passed from form
	$text = $_POST['text'];
	$pageId = $_POST['pageId'];
	$sectionNum = $_POST['section'];
	
	// write message in sandbox
	$result = Wiki::edit($pageId, $text, $sectionNum);
	
	if ($result) {	
		// redirect
		$urlEncodedResult = http_build_query($result);
		header('Location:  /?' . $urlEncodedResult);
		exit();
	}
	
} catch (Exception $e) {
	die("Edit failed: " . $e->getMessage());
}

?>
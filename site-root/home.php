<?php
	
	// start session to be able to access session variables
	session_start();
		
	if (isset($_SESSION['lgusername'])) {
		$lgusername = $_SESSION['lgusername'];
	}		
					
	$result 	= $_GET['result'];
	$pageId		= $_GET['pageid'];	
	$url		= $_GET['url'];
	$question	= $_GET['question'];
	$wikiURL	= Wiki::$wikiURL;

	// populate array with data to pass to template
	$data = array(
					'lgusername'	 => $lgusername,
					'result' 		 => $result,
					'pageId'		 => $pageId,
					'url'			 => $url,
					'question'		 => $question,
					'wikiURL'		 => $wikiURL
	);
	
	// load template
	RequestHandler::respond('main', $data);
		
?>		

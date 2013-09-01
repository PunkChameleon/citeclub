<?php

class MediaWiki {

	/*
	* Uses cURL to GET and POST data using MediaWiki API
	*/
	
	public static $wikiURL;
	public static $settings = array( // default settings
		'userAgent' 	 => 'MediaWiki API PHP Wrapper',
		'encoding' 		 => 'UTF-8',
		'returnTransfer' => TRUE,
		'cookiesFile'  	 => 'cookies.txt',
		'format'         => 'json'
	);
	private static $PATH_TO_API = "/w/api.php";

	public static function get($queryStr) {

		/*
		* Make GET request using query string
		*/

		$queryStr .= '&format=' . static::$settings['format'];
		$url = static::_buildURL($queryStr);
		return static::_makeHTTPRequest($url);
	}
		
	public static function edit($pageId, $text, $summary, $sectionNum, $captchaId, $captchaWord) {
		
		/*
		* Edit a page
		*/

		if (empty($pageId)) {
			throw new Exception("No page id passed.");
		}
		
		$token = static::_getEditToken($pageId);
		
		// build URL
		$getParams = array(
			'action' => 'edit',
			'format' => static::$settings['format']
		);
        $url = static::_buildURL($getParams);
        
        // set POST params
		$postParams = array(
			'section' => $sectionNum,
			'summary' => $summary,
			'text'	  => utf8_encode($text),
			'pageid'  => $pageId,
			'token'   => $token
		);

        if (!empty($captchaId)) {
        	// add captcha id to params
        	array_merge($params, array('captchaid'=>$captchaId));
        }
		if (!empty($captchaWord)) {
			// add captcha word to params
			array_merge($params, array('captchaword'=>$captchaWord));
		}
		
		return static::_makeHTTPRequest($url, http_build_query($postParams));
	}
	
	public static function login($user, $pass) {
		
		/*
		* Log user in using credentials and return login data
		*/

		if (empty($user) || empty($pass)) {
			throw new Exception("No username and/or password passed.");
		}
		
		$token = static::_getLoginToken($user, $pass);
		return static::_logUserIn($user, $pass, $token);
	}
	
	public static function logout() {
		
		/*
		* Log user out (deletes the login tokens and other browser cookies)
		*/
		
		$url = static::_buildURL(array('action' => 'logout'));
		return static::_makeHTTPRequest($url);
	}
	
	private static function _makeHTTPRequest($url, $post="") {

		/*
		* Make HTTP request to MediaWiki using cURL
		*/
	
		// initialize cURL session
        $ch = curl_init();
        
        // set options
        curl_setopt($ch, CURLOPT_USERAGENT, static::$settings['userAgent']);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_ENCODING, static::$settings['encoding']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, static::$settings['returnTransfer']);
        $cookiesFile = static::$settings['cookiesFile'];
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookiesFile);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookiesFile);
        if (!empty($post)) {
        	// POST request
        	// must set method to POST and modify headers
        	curl_setopt($ch, CURLOPT_POST, TRUE);
        	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        	$headers = array("Expect:", "Content-Type: application/x-www-form-urlencoded"); // see http://www.mediawiki.org/wiki/API:Edit#Example
        	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);         
        }
        
        // send request and get response
        $response = curl_exec($ch);
        
        // capture any errors
        $curlError = curl_error($ch);
        
        // throw exceptions as needed
        if ($curlError) {
        	throw new Exception("There was a cURL error: $curlError");
        }
        if (!$response) {
        	throw new Exception("Error getting data from server ($url): $curlError");
        }

		// close session
        curl_close($ch);
        
        // return response
        return $response;
	}
	
	private static function _getEditToken($pageId) {
		
		/*
		* Get edit token
		*/
		
		$params = array(
			'action' => 'query',
			'prop' => 'info',
			'intoken' => 'edit',
			'pageids' => $pageId,
			'format' => 'xml'
		);
		$url = static::_buildURL($params);
		$xml = simplexml_load_string(static::_makeHTTPRequest($url));
		
		// get edit token id from XML
	    $result = $xml->xpath("/api/query/pages/page");	

	    $token = (string)$result[0]->attributes()->edittoken;
	    
	    if(!isset($token)) {
	    	throw new Exception("Edit token not found in XML");
	    }
	    
	    return $token;
	}
	
	private static function _getLoginToken($user, $pass) {
		
		/*
		* Get login token for these user credentials
		*/
		
		$getParams = array(
			'action' => 'login',
			'format' => 'xml'
		);
		$url = static::_buildURL($getParams);
		$postParams = array(
			'lgname' => $user,
			'lgpassword' => $pass
		);
		$xml = simplexml_load_string(static::_makeHTTPRequest($url, http_build_query($postParams)));

        $result = $xml->xpath("/api/login");
		$token = (string)$result[0]->attributes()->token;

        if(!isset($token)) {
        	throw new Exception("Login token not found in XML");
        }
        
        return $token;        
	}
	
	private static function _logUserIn($user, $pass, $token) {
		
		/*
		* Log user in using login token. 
		*/
	
		$getParams = array(
			'action' => 'login',
			'format' => static::$settings['format']
		);
		$url = static::_buildURL($getParams);

		$postParams = array(
			'lgname' => $user,
			'lgpassword' => $pass,
			'lgtoken' => $token
		);

		return static::_makeHTTPRequest($url, http_build_query($postParams));
	}
	
	private static function _buildURL($getParams) {
		
		/*
		* Builds URL using wiki URL, path to api.php, and GET parameters
		*/
		
		$wikiURL = rtrim(static::$wikiURL, '/'); // remove trailing slash as necessary
		$queryStr = is_array($getParams) ? http_build_query($getParams) : $getParams;
		return $wikiURL . static::$PATH_TO_API . "?" . $queryStr;
	}
}
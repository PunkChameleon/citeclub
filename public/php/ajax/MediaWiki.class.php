<?php

class MediaWiki {

	/*
	* Uses cURL to GET and POST data using MediaWiki API
	*/
	
	static public $wikiURL;
	static public $curlSettings = array( 	// default settings
											'userAgent' 	 => 'MediaWiki API PHP Wrapper',
					              			'encoding' 		 => 'UTF-8',
					              			'returnTransfer' => true,
					              			'cookiesFile'  	 => 'cookies.txt'
				              		   );
		
	static public function edit($pageId, $text, $summary, $sectionNum, $captchaId, $captchaWord) {
		
		/*
		* Edit a page
		*/
		
		$token = static::_getEditToken($pageId);
		
		// build URL
		$getParams = array(
							'action' => 'edit',
	              			'format' => 'xml'
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
		
		$xml = static::_httpRequest($url, http_build_query($postParams));

		$error = $xml->xpath("/api/error");

		if (!empty($error)) {
			// an error occurred
			$errorAttrs = $error[0]->attributes();
			$errorCode = (string)$errorAttrs->code;
			$errorInfo = (string)$errorAttrs->info;
			return array(
						'result'=>'failure',
						'errorCode'=>$errorCode,
						'errorInfo'=>$errorInfo
					);
		}

        $result = $xml->xpath("/api/edit");
        
        $resultVal = (string)$result[0]->attributes()->result; 
	
        if (isset($resultVal) && $resultVal === "Success") {
        	// edit was successful!
        	$newRevisionId = (string)$result[0]->attributes()->newrevid;
        	return array(
        					'result'=>'success',
        					'newrevid'=>$newRevisionId,
        					'pageid'=>$pageId
        				);
        } else if (isset($resultVal) && $resultVal === "Failure") {
        	// edit failed
    		// we have a captcha element
    		// check if it's an image captcha
    		$result = $xml->xpath("/api/edit/captcha");
    		$captchaAttrs = $result[0]->attributes();
    		$url = (string)$captchaAttrs->url;
    		$question = (string)$captchaAttrs->question;
    		if (isset($url)) {
    			// image captcha
    			// return image URL
    			return array(
        					'result'=>'captcha',
        					'url'=>$url
        				);
    		} else if (isset($question)) {
    			// check if math captcha
				return array(
    					'result'=>'captcha',
    					'question'=>$question
    				);
    		}
        }
        
        // shouldn't have gotten this far...
        throw new Exception("Unknown Error");
	}
	
	static public function login($user, $pass) {
		
		/*
		* Log user in using credentials and return login data
		*/
		
		$token = static::_getLoginToken($user, $pass);
		$login = static::_loginUser($user, $pass, $token);
		return $login;
	}
	
	static public function logout() {
		
		/*
		* Log user out (deletes the login tokens and other browser cookies)
		*/
		
		$url = static::_buildURL(array('action' => 'logout'));
		static::_httpRequest($url);
		return true;
	}
	
	// internal functions
	
	static private function _httpRequest($url, $post="") {
	
		// initialize cURL session
        $ch = curl_init();
        
        // set options
        curl_setopt($ch, CURLOPT_USERAGENT, static::$curlSettings['userAgent']);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_ENCODING, static::$curlSettings['encoding']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, static::$curlSettings['returnTransfer']);
        $cookiesFile = static::$curlSettings['cookiesFile'];
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookiesFile);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookiesFile);
        if (!empty($post)) {
        	// POST request
        	// must set method to POST and modify headers
        	curl_setopt($ch, CURLOPT_POST, true);
        	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        	$headers = array("Expect:", "Content-Type: application/x-www-form-urlencoded"); // see http://www.mediawiki.org/wiki/API:Edit#Example
        	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);         
        }
        
        // send request and get XML response
        $xmlStr = curl_exec($ch);
        
        // capture any errors
        $curlError = curl_error($ch);
        
        // throw exceptions as needed
        if ($curlError) {
        	throw new Exception("There was a cURL error: $curlError");
        }
        if (!$xmlStr) {
        	throw new Exception("Error getting data from server ($url): $curlError");
        }
        
        // attempt to load XML string to see if is valid XML
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($xmlStr);
        if (!$xml) {
        	// XML is malformed
        	$xmlErrors = libxml_get_errors();
        	libxml_clear_errors();
        	throw new Exception("XML returned from server is malformed: $xmlErrors");
        }

		// close session
        curl_close($ch);
        
        // return XML
        return $xml;
	}
	
	static private function _getEditToken($pageId) {
		
		/*
		* Get edit token
		*/
		
		$url = static::$wikiURL . "/w/api.php?action=query&format=xml&prop=info&intoken=edit&pageids=$pageId";
		$xml = static::_httpRequest($url);
		
		// get edit token id from XML
	    $result = $xml->xpath("/api/query/pages/page");	

	    $token = (string)$result[0]->attributes()->edittoken;
	    
	    if(!isset($token)) {
	    	throw new Exception("Edit token not found in XML");
	    }
	    
	    return $token;
	}
	
	static private function _getLoginToken($user, $pass) {
		
		/*
		* Get login token for these user credentials
		*/
		
		$url = static::$wikiURL . "/w/api.php?action=login&format=xml";
		$params = "lgname=$user&lgpassword=$pass";
		$xml = static::_httpRequest($url, $params);

        $result = $xml->xpath("/api/login");
		$token = (string)$result[0]->attributes()->token;

        if(!isset($token)) {
        	throw new Exception("Login token not found in XML");
        }
        
        return $token;        
	}
	
	static private function _loginUser($user, $pass, $token) {
		
		/*
		* Log user in using login token. 
		*/
	
        $url = static::$wikiURL . "/w/api.php?action=login&format=xml";
        $params = "lgname=$user&lgpassword=$pass&lgtoken=$token";
        $xml = static::_httpRequest($url, $params);

    	return $xml;
	}
	
	static private function _buildURL($getParams) {
		
		/*
		* Builds URL using wiki URL, path to api.php, and GET parameters
		*/
		
		$wikiURL 	= rtrim(static::$wikiURL, '/'); // remove trailing slash
		$pathToAPI 	= "/w/api.php";
		$queryStr 	= http_build_query($getParams);
		return $wikiURL . $pathToAPI . "?" . $queryStr;
	}
}
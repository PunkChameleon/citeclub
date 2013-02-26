<?php

class Wiki {

	/*
	Uses cURL to GET and POST data using MediaWiki API
	*/
	
	static public $wikiURL;	
	
	function httpRequest($url, $post="") {
	
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_USERAGENT, 'Cite Club, v0.1');
        curl_setopt($ch, CURLOPT_URL, ($url));
        curl_setopt($ch, CURLOPT_ENCODING, "UTF-8" );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $COOKIE_FILE = "cookies.txt";
        curl_setopt($ch, CURLOPT_COOKIEFILE, $COOKIE_FILE);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $COOKIE_FILE);
        if (!empty($post)) {
        	curl_setopt($ch, CURLOPT_POST, true);
        	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        	$headers = array("Expect:", "Content-Type: application/x-www-form-urlencoded"); // set to null to get rid of cURL's 'Expect: 100-continue' header that is automatically inserted
        	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);         
        }
        
        $xmlStr = curl_exec($ch);
        
        $curlError = curl_error($ch);
        
        if ($curlError) {
        	throw new Exception("There was a cURL error: $curlError");
        }
        if (!$xmlStr) {
        	throw new Exception("Error getting data from server ($url): " . curl_error($ch) . " using POST params: $post");
        }

        curl_close($ch);
        
        return $xmlStr;
	}
	
	static public function edit($pageId, $text, $sectionNum, $captchaId, $captchaWord) {
		
		/*
		* Edit a page
		*/
		
		$token = static::getEditToken($pageId, $text);
		
		$url = static::$wikiURL . "/w/api.php?action=edit&format=xml";
		$params = array(
							'section'=>$sectionNum,
	              			'summary'=>'CiteClub Citation',
	              			'text'=>utf8_encode($text),
	              			'pageid'=>$pageId,
	              			'token'=>$token
              			);
        if (!empty($captchaId)) { array_merge($params, array('captchaid'=>$captchaId)); }
		if (!empty($captchaWord)) { array_merge($params, array('captchaword'=>$captchaWord)); }
		
		$xmlStr = static::httpRequest($url, http_build_query($params));
		
		if (empty($xmlStr)) {
	        throw new Exception("No data received from server. Check that API is enabled.");
        }
		
		$xml = simplexml_load_string($xmlStr);
		
        $result = $xml->xpath("/api/edit");
        
        if (empty($result)) {
        	throw new Exception("Error retrieving Wiki response data.");
        }
        
        $resultVal = (string)$result[0]->attributes()->result; 
	
        if (isset($resultVal) && $resultVal == "Success") {
        	// edit was successful!
        	$newRevisionId = (string)$result[0]->attributes()->newrevid;
            if (isset($newRevisionId)) {
            	return array(
            					'result'=>'success',
            					'newrevid'=>$newRevisionId,
            					'pageid'=>$pageId
            				);
            }
        } else if (isset($resultVal) && $resultVal == "Failure") {
        	// edit failed
    		// we have a captcha element
    		// check if it's an image captcha
    		$result = $xml->xpath("/api/edit/captcha");
    		$url = (string)$result[0]->attributes()->url;
    		$question = (string)$result[0]->attributes()->question;
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
        } else {
        	// some other error occurred
    		$result = $xml->xpath("/api/error");
    		// return error code
    		$errorCode = (string)$result[0]->attributes()->code;
    		if (isset($errorCode)) {
    			return array(
        					'result'=>'failure',
        					'question'=>$errorCode
        				);
    		} 
        }
        
        // shouldn't have gotten this far...
        throw new Exception("Unknown Error");
	}
	
	function getEditToken($pageId) {
		
		/*
		* Get edit token
		*/
		
		$url = static::$wikiURL . "/w/api.php?action=query&format=xml&prop=info&intoken=edit&pageids=$pageId";
		$xmlStr = static::httpRequest($url);
		$xml = simplexml_load_string($xmlStr);
		
		// get edit token id from XML
	    $result = $xml->xpath("/api/query/pages/page");	
	    $token = (string)$result[0]->attributes()->edittoken;
	    if(isset($token)) {
	    	return $token;
	    } else {
            throw new Exception("Edit token not found in XML");
        }
	}
	
	static public function login($user, $pass) {
		
		/*
		* Log user in using credentials and return login data
		*/
		
		$token = static::getLoginToken($user, $pass);
		$login = static::loginUser($user, $pass, $token);
		return $login;
	}
	
	static public function logout() {
		
		/*
		* Log user out (deletes the login tokens and other browser cookies)
		*/
		
		$url = static::$wikiURL . "/w/api.php?action=logout";
		static::httpRequest($url);
	}
	
	function getLoginToken($user, $pass) {
		
		/*
		* Get login token
		*/
		
		$url = static::$wikiURL . "/w/api.php?action=login&format=xml";
		$params = "lgname=$user&lgpassword=$pass";
		$xmlStr = static::httpRequest($url, $params);
		
		if (empty($xmlStr)) {
	        throw new Exception("No data received from server. Check that API is enabled.");
        }
		
		$xml = simplexml_load_string($xmlStr);
        $result = $xml->xpath("/api/login");
		$token = (string)$result[0]->attributes()->token;

        if(isset($token)) {
        	return $token;        
        } else {
            throw new Exception("Login token not found in XML");
        }
	}
	
	function loginUser($user, $pass, $token) {
		
		/*
		* Log user in using login token. Returns NULL if login credentials are wrong.
		*/
	
        $url = static::$wikiURL . "/w/api.php?action=login&format=xml";
        $params = "lgname=$user&lgpassword=$pass&lgtoken=$token";
        $data = static::httpRequest($url, $params);
        
        if (empty($data)) {
	        throw new Exception("No data received from server. Check that API is enabled.");
        }

        $xml = simplexml_load_string($data);
        
        // check for successful login
        $result = $xml->xpath("/api/login");
		$resultVal = (string)$result[0]->attributes()->result;
	
        if(isset($resultVal) && $resultVal == "Success") {
	    	// get and return login info now that user has logged in successfully
	    	$properties = array('lguserid', 'lgusername', 'lgtoken', 'cookieprefix', 'sessionid');
	    	foreach ($properties as $p) {
	    		$login[$p] = (string)$result[0]->attributes()->$p;
	    	}
	    	return $login;
        } else {
        	return NULL;
        }
	}
}
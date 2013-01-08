<?php

class CloudMine
{
	// configurable properties
	static public $appId;
	static public $apiKey;
	
	
	// public methods
	static public function query($query = null, $params = array())
	{
		if($query)
			$params['q'] = $query;
			
		return static::_request('GET', '/search', $params);
	}
	
	static public function fetch($params = array())
	{
		if(is_string($params) || is_integer($params))
		{
			$params = array('keys' => $params);
		}
		
		if(is_array($params['keys']))
			$params['keys'] = implode(',',$params['keys']);
			
		return static::_request('GET', '/text', $params);
	}
	
	static public function update($key, $value = null)
	{
		return static::_request('POST', '/text', null, is_array($key) ? $key : array($key => $value));		
	}
	
	static public function delete($keys)
	{
		return static::_request('DELETE', '/data', array(
			'keys' => is_array($keys) ? implode(',', $keys) : $keys
		));		
	}
	
	
	// internal methods
	static protected function _request($method, $endpoint, $params = null, $body = null)
	{
		$url = 'https://api.cloudmine.me/v1/app/'.static::$appId.$endpoint;
		
		if(!empty($params))
		{
			$url .= '?'.http_build_query($params);
		}

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/json'
			,'X-CloudMine-ApiKey: '.static::$apiKey
		));
		
		switch($method)
		{
			case 'GET':
				break;
			case 'POST':
				curl_setopt($ch, CURLOPT_POST, true);
				break;
			default:
				curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
				break;
		}
		
		if($body)
		{
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
		}
		
		$response = curl_exec($ch);
		$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		
		if($statusCode == '200')
		{
			return json_decode($response);
		}
		else
		{
			throw new Exception("Got status $statusCode from CloudMine:\n\n$response");
		}
	}
}
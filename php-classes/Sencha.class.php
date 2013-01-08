<?php

class Sencha
{
	static public $frameworks = array(
		'ext' => array(
			'sdkPath' => '/usr/local/lib/sencha/ext/4.1.3'
		)
		,'touch' => array(
			'sdkPath' => '/usr/local/lib/sencha/touch/2.1.0'
		)
	);
	
	static public $cmdPath = '/usr/local/bin/Sencha/Cmd/current';
	static public $binPaths = array('/bin','/usr/bin','/usr/local/bin');
	
	static public function buildCmd()
	{
		$args = func_get_args();
		$sdk = array_shift($args);
		
		$cmd = sprintf('SENCHA_CMD_3_0_0="%1$s" PATH="%2$s" %1$s/sencha', static::$cmdPath, implode(':', static::$binPaths));
		
		if($sdk)
			$cmd .= ' -sdk ' . static::$frameworks[$sdk]['sdkPath'];
		
		foreach($args AS $arg)
		{
			if(is_string($arg))
				$cmd .= ' ' . $arg;
			elseif(is_array($arg))
				$cmd .= ' ' . implode(' ', $arg);
		}			
		
		return $cmd;
	}
	
	static public function loadProperties($file)
	{
		$properties = array();
		$fp = fopen($file, 'r');
		
		while($line = fgetss($fp))
		{
			// clean out space and comments
			$line = preg_replace('/\s*([^#\n\r]*)\s*(#.*)?/', '$1', $line);
			
			if($line)
			{
				list($key, $value) = explode('=', $line, 2);
				$properties[$key] = $value;
			}
		}
		
		fclose($fp);
		
		return $properties;
	}
}
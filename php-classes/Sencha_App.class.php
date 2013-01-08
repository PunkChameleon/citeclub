<?php

class Sencha_App
{
	static public $externalRoot = '/app';
	
	protected $_name;
	protected $_framework;
	protected $_senchaCfg;
	
	function __construct($name, $framework = null)
	{
		$this->_name = $name;
		
		if($framework)
		{
			$this->_framework = $framework;
		}
	}
	
	static public function getByName($name, $framework = null)
	{
		return new static($name, $framework);
	}
	
	public function getName()
	{
		return $this->_name;
	}
	
	public function getFramework()
	{
		if(!$this->_framework)
		{
			$appConfig = $this->getSenchaCfg();
			$this->_framework = $appConfig['app.framework'];
		}
		
		return $this->_framework;
	}
	
	public function getSenchaCfg($key = null)
	{
		if($this->_senchaCfg)
		{
			return $key ? $this->_senchaCfg[$key] : $this->_senchaCfg;
		}
		
		// try to get from shared cache - this seems annoying and unecessary
#		$cacheKey = "app/$this->_name/config";
#		
#		if($this->_senchaCfg = Cache::fetch($cacheKey))
#		{
#			return $key ? $this->_senchaCfg[$key] : $this->_senchaCfg;
#		}
		
		// get from filesystem
		$configPath = array('sencha-workspace', $this->_name, '.sencha', 'app', 'sencha.cfg');
		
		if(!$configNode = Site::resolvePath($configPath, true, false))
		{
			throw new Exception('Could not find .sencha/app/config.cfg for '.$this->_name);
		}
	
		$this->_senchaCfg = Sencha::loadProperties($configNode->RealPath);
		
		// store in cache
#		Cache::store($cacheKey, $this->_senchaCfg);
		
		return $key ? $this->_senchaCfg[$key] : $this->_senchaCfg;
	}
	
	public function getAsset($filePath, $useCache = true)
	{
		if(is_string($filePath))
		{
			$filePath = Site::splitPath($filePath);
		}
		
		$appName = $this->getName();
		$framework = $this->getFramework();
		
		if($filePath[0] == 'x')
		{
			array_shift($filePath);
			array_unshift($filePath, 'ext-library');
		}
		elseif($filePath[0] == 'sdk' || $filePath[0] == $framework)
		{
			array_shift($filePath);
			array_unshift($filePath, 'sencha-workspace', $framework);
		}
		elseif($filePath[0] == 'build')
		{
			if($filePath[1] == 'sdk' || $filePath[1] == $framework)
			{
				array_shift($filePath);
				array_shift($filePath);
				array_unshift($filePath, 'sencha-workspace', $framework);				
			}
			else
			{
				array_shift($filePath);
				array_unshift($filePath, 'sencha-build', $appName);
			}
		}
		else
		{
			array_unshift($filePath, 'sencha-workspace', $appName);
		}
		
		return Site::resolvePath($filePath, true, $useCache);
	}
	
	public function getVersionedPath($filePath, $useCache = false)
	{
		if(is_string($filePath))
		{
			$filePath = Site::splitPath($filePath);
		}
		
		$Asset = $this->getAsset($filePath);
		$assetPath = static::$externalRoot . '/' . $this->getName() . '/' . implode('/', $filePath);
		
		if($Asset) {
			return $assetPath . '?_sha1=' . $Asset->SHA1;
		}
		else {
			return $assetPath;
		}
	}
}
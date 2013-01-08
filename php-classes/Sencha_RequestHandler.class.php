<?php

class Sencha_RequestHandler extends RequestHandler
{
	static public function handleRequest()
	{
		// first path component is appName
		if(!$appName = static::shiftPath())
		{
			return static::throwInvalidRequestError();
		}

		// check if appName is a framework
		if(array_key_exists($appName, Sencha::$frameworks))
		{
			return static::handleFrameworkRequest($appName, $developer);
		}
		
		// get app
		$App = new Sencha_App($appName);
		
		// enable debug mode if next path component is develop
		$developer = false;
		if(static::peekPath() == 'develop')
		{
			static::shiftPath();
			$developer = true;
		}
		elseif(static::peekPath() == 'docs')
		{
			static::shiftPath();
			return static::handleDocsRequest($App);
		}
		
		return static::handleAppRequest($App, $developer);
	}
	
	static public function handleFrameworkRequest($framework, $developer = false)
	{
		$filePath = static::getPath();
		array_unshift($filePath, 'sencha-workspace', $framework);
		
		if($fileNode = Site::resolvePath($filePath, true, !$developer))
		{
			$fileNode->outputAsResponse();
		}
		else
		{
			return static::throwNotFoundError('Framework asset not found');
		}
	}
	
	static public function handleAppRequest(Sencha_App $App, $developer = false)
	{
		if($developer)
		{
			$GLOBALS['Session']->requireAccountLevel('Developer');
		}
		
		// resolve app files if there is a non-blank path queued
		if(static::peekPath())
		{
			if($fileNode = $App->getAsset(static::getPath(), false)) // false to disable caching, because it's annoying
			{
				$fileNode->outputAsResponse();
			}
			else
			{
				return static::throwNotFoundError('App asset not found');
			}
		}
		
		// render bootstrap HTML
		static::_forceTrailingSlash();
		return static::respond($App->getFramework(), array(
			'App' => $App
			,'developer' => $developer
		));
	}
	
	static public function handleDocsRequest(Sencha_App $App)
	{
		$GLOBALS['Session']->requireAccountLevel('Developer');
		static::_forceTrailingSlash();

		$filePath = static::getPath();
		
		if(empty($filePath[0]))
		{
			$filePath[0] = 'index.html';
		}
		
		array_unshift($filePath, 'sencha-docs', $App->getName());
		
		if($fileNode = Site::resolvePath($filePath))
		{
			$fileNode->outputAsResponse();
		}
		else
		{
			return static::throwNotFoundError('Docs asset not found');
		}
	}
	
	static protected function _forceTrailingSlash()
	{
		// if there is no path component in the stack, then there was no trailing slash
		if(static::peekPath() === false && !empty(Site::$requestPath[0]))
		{
			Site::$requestPath[] = '';
			Site::redirect(Site::$requestPath);
		}
	}
	
	// override default implementation to print naked error without HTML template
	static public function throwError($message)
	{
		die($message);
	}
}
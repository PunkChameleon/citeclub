<?php


class TemplateResource extends Dwoo_Template_File
{

	public function getResourceName()
	{
		return 'Emergence';
	}
	
	public function __construct(SiteFile $templateNode)
	{
		return parent::__construct($templateNode->RealPath);
	}


	public static function templateFactory(Dwoo_Core $dwoo, $resourceId, $cacheTime = null, $cacheId = null, $compileId = null, Dwoo_ITemplate $parentTemplate = null)
	{
		if(substr($resourceId, 0, strlen(Site::$rootPath)) == Site::$rootPath)
		{
			return new Dwoo_Template_File($file, $cacheTime, $cacheId, $compileId, $includePath);
		}
		
		// get current path
		$templatePath = Site::splitPath($resourceId);
		$localRoot = Site::getRootCollection('html-templates');
		$searchStack = array_filter(Site::$requestPath);
		$templateNode = false;
		$searchHistory = array();
		
		while(true)
		{
			$searchPath = array_merge($searchStack, $templatePath);
			$searchHistory[] = $searchPath;
			
			if($templateNode = $localRoot->resolvePath($searchPath))
			{
				break;
			}
			
			if($templateNode = Emergence::resolveFileFromParent('html-templates', $searchPath))
			{
				break;
			}
			
			// pop stack or quit search
			if(count($searchStack))
				array_pop($searchStack);
			else
				break;
		}
	
	
		if(!$templateNode)
		{
			throw new Exception(
				"Could not find template match for \"$resourceId\", checked paths:\n\n"
				.implode(PHP_EOL, array_map(function($a){
					return implode('/',$a);
				}, $searchHistory))
			);
		}


		return new static($templateNode);
	}

}
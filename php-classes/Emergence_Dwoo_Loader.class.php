<?php
class Emergence_Dwoo_Loader implements Dwoo_ILoader
{
    public function loadPlugin($class, $forceRehash = true)
    {

        $VFS_Paths = array(
            'builtin/blocks/'
            ,'builtin/filters/'
            ,'builtin/functions/'
            ,'builtin/processors/'
            ,'builtin/'
            ,'personal/'
            ,'thirdparty/'
            ,''
        );

		if($class == 'array') {
			$class = 'helper.array';
		}
		
		$cacheKey = 'efsi:' . $_SERVER['HTTP_HOST'] . '/dwoo-plugins?file=' . $class . '.php';
		
		if(Site::$production && false !== ($pluginNode = apc_fetch($cacheKey)))
		{
            require($pluginNode->RealPath);
            return;
		}


        $localRoot = Site::getRootCollection('dwoo-plugins');

        foreach($VFS_Paths as $virtualPath)
        {
            $templatePath = Site::splitPath($virtualPath.$class.'.php');

            if($pluginNode = $localRoot->resolvePath($templatePath))
            {
                break;
            }

            if($pluginNode = Emergence::resolveFileFromParent('dwoo-plugins', $templatePath))
            {
                break;
            }

        }

        if($pluginNode && file_exists($pluginNode->RealPath))
        {
        	if(Site::$production)
        		apc_store($cacheKey, $pluginNode);
        		
            require($pluginNode->RealPath);
        }
        else {
            throw new Dwoo_Exception('Plugin <em>'.$class.'</em> can not be found in the Emergence VFS.');
        }

    }

}
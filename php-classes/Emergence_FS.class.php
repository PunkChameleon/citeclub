<?php

class Emergence_FS
{
	static public function cacheTree($path)
	{
		// split path into array
		if(is_string($path))
			$path = Site::splitPath($path);


		// get tree map from parent
		$remoteTree = Emergence::resolveCollectionFromParent($path, true);
		
		if(!$remoteTree)
			return 0;

		// get remote node for tree root
		$rootNode = null;
		while($handle = array_shift($path))
		{
			$rootNode = SiteCollection::getOrCreateCollection($handle, $rootNode, true);
		}
		
		return static::crawlTree($rootNode, $remoteTree);
	}
	
	static protected function crawlTree($rootNode, $treeData)
	{
		$filesResolved = 0;
		
		// crawl parent tree
		foreach($treeData['collection'] AS $childData)
		{
			if($childData['type'] == 'collection')
			{
				$childNode = SiteCollection::getOrCreateCollection($childData['handle'], $rootNode, true);
				
				if(!empty($childData['collection']))
				{
					$filesResolved += static::crawlTree($childNode, $childData);
				}	
			}
			elseif($childData['type'] == 'file')
			{
				$childNode = SiteFile::getByHandle($rootNode->ID, $childData['handle']);
				
				if(!$childNode || $childNode->SHA1 != $childData['sha1'])
				{
					$childNode = Emergence::resolveFileFromParent($rootNode, $childData['handle'], true);
					
					if($childNode)
					{
						$filesResolved++;
					}
				}
				
			}
		}
		
		return $filesResolved;
	}
	
	static public function getTree($path, $localOnly = false, $conditions = array())
	{
		// split path into array
		if(is_string($path))
			$path = Site::splitPath($path);
		
		// resolve local and remote collections
		$rootHandle = array_shift($path);
		
		$localCollection = SiteCollection::getByHandle($rootHandle, null, false);
		
		if(!$localOnly)
			$remoteCollection = SiteCollection::getByHandle($rootHandle, null, true);

		while($handle = array_shift($path))
		{
			if($localCollection)
				$localCollection = SiteCollection::getByHandle($handle, $localCollection->ID, false);
				
			if($remoteCollection)
				$remoteCollection = SiteCollection::getByHandle($handle, $remoteCollection->ID, true);
		}
		
		if(!$localCollection && !$remoteCollection)
			throw new Exception('Source path does not exist locally or remotely');

		// calculate position conditions
		$positionConditions = array();
		if($localCollection)
			$positionConditions[] = sprintf('PosLeft BETWEEN %u AND %u', $localCollection->PosLeft, $localCollection->PosRight);
			
		if($remoteCollection)
			$positionConditions[] = sprintf('PosLeft BETWEEN %u AND %u', $remoteCollection->PosLeft, $remoteCollection->PosRight);
		
		// assemble conditions
		$conditions[] = 'Status = "Normal"';
		$conditions[] = join(') OR (', $positionConditions);
		
		return DB::table(
			'ID'
			,'SELECT ID, Handle, ParentID FROM `%s` WHERE (%s) ORDER BY PosLeft'
			,array(
				SiteCollection::$tableName
				,join(') AND (', $conditions)
			)
		);
	}
		
	static public function exportTree($sourcePath, $destinationPath, $options = array())
	{
		$options = array_merge(array(
			'localOnly' => false
			,'dataPath' => $destinationPath . '/.emergence'
			,'transferDelete' => true
		), $options);
		
		// check destination
		if(!is_dir($destinationPath))
			mkdir($destinationPath, 0777, true);
			
		if(!is_writable($destinationPath))
			throw new Exception("Destination \"$destinationPath\" is not writable");
		
		$tree = static::getTree($sourcePath, $options['localOnly']);
		
		// build relative paths and create directories
		foreach($tree AS &$node)
		{
			
			if($node['ParentID'] && $tree[$node['ParentID']])
				$node['_path'] = $tree[$node['ParentID']]['_path'] . '/' . $node['Handle'];
			else
				$node['_path'] = $destinationPath;
			
			if(!is_dir($node['_path']))
				mkdir($node['_path']);
		}
		
		// read file state frome emergence data
		$mark = 0;
		
		if($options['dataPath'] && is_dir($options['dataPath']))
		{
			$markFilePath = $options['dataPath'] . '/mark';
			
			if(file_exists($markFilePath))
				$mark = file_get_contents($markFilePath);
		}
		
		// get files
		$fileResult = DB::query(
			'SELECT f2.* FROM (SELECT MAX(f1.ID) AS ID FROM `%1$s` f1 WHERE ID > %2$u AND CollectionID IN (%3$s) AND Status != "Phantom" GROUP BY f1.CollectionID, f1.Handle) AS lastestFiles LEFT JOIN `%1$s` f2 USING (ID)'
			,array(
				SiteFile::$tableName
				,$mark
				,join(',', array_keys($tree))
			)
		);
		
		// copy each
		$filesAnalyzed = 0;
		$filesWritten = 0;
		$filesDeleted = 0;
		
		while($fileRow = $fileResult->fetch_assoc())
		{
			$dst = $tree[$fileRow['CollectionID']]['_path'].'/'.$fileRow['Handle'];
			
			if($fileRow['Status'] == 'Normal')
			{
				copy(Site::$rootPath . '/' . SiteFile::$dataPath . '/' . $fileRow['ID'], $dst);
				touch($dst, strtotime($fileRow['Timestamp']));
				$filesWritten++;
			}
			elseif($fileRow['Status'] == 'Deleted')
			{
				if($options['transferDelete'] && is_file($dst))
				{
					unlink($dst);
					$filesDeleted++;
				}
			}
			
			$mark = max($mark, $fileRow['ID']);
			$filesAnalyzed++;
		}
		
		// write emergence data
		if($options['dataPath'])
		{
			if(!is_dir($options['dataPath']))
				mkdir($options['dataPath']);
				
			file_put_contents($options['dataPath'] . '/mark', $mark);
		}
		
		return array(
			'analyzed' => $filesAnalyzed
			,'written' => $filesWritten
			,'deleted' => $filesDeleted
		);
	}
	
	static public function importTree($sourcePath, $destinationPath, $options = array())
	{
		$options = array_merge(array(
			'dataPath' => $sourcePath . '/.emergence'
			,'exclude' => array()
		), $options);
		
		// check source
		if(!is_readable($sourcePath)) {
			throw new Exception("Source \"$sourcePath\" unreadable");
		}
		
		if(!empty($options['exclude']) && is_string($options['exclude'])) {
			$options['exclude'] = array($options['exclude']);
		}
			
		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator(
				$sourcePath
				,FilesystemIterator::CURRENT_AS_SELF | FilesystemIterator::SKIP_DOTS
			)
			,RecursiveIteratorIterator::SELF_FIRST
		);
		$prefixLen = strlen($sourcePath);
		$totalFiles = 0;
		
		foreach($iterator AS $tmpPath => $node)
		{
			$relPath = substr($tmpPath, $prefixLen);
			$path = $destinationPath . $relPath;
			
			if(!empty($options['exclude'])) {
				foreach($options['exclude'] AS $excludePattern) {
					if(preg_match($excludePattern, $relPath)) {
						continue 2;
					}
				}
			}
			
			// handle directory
			if($node->isDir()) {
				SiteCollection::getOrCreatePath($path);
				continue;
			}
			
			// skip .emergence data directory
			if($options['dataPath'] && 0 === strpos($node->getPath(), $options['dataPath'])) {
				continue;
			}
			
			$existingNode = Site::resolvePath($path);
			
			// calculate hash for incoming file
			$sha1 = sha1_file($node->openFile());
			
			// skip if existing local or remote file matches hash
			if($sha1 == $existingNode->SHA1)
				continue;
			
			// use lower level create methods to supply already-calculated hash
			$fileRecord = SiteCollection::createFile($path, null, $existingNode->ID);
			SiteFile::saveRecordData($fileRecord, fopen($node->getPathname(),'r'), $sha1);
			
			$totalFiles++;
		}
		
		return $totalFiles;
	}
	
	static public function getTmpDir($prefix = 'etmp-')
	{
		$tmpPath = tempnam('/tmp', $prefix);
		unlink($tmpPath);
		mkdir($tmpPath);
		return $tmpPath;
	}
}
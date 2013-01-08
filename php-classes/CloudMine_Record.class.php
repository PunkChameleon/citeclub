<?php

class CloudMine_Record implements IteratorAggregate
{
	protected $_key;
	protected $_record;
	
	// IteratorAggregate override
	function getIterator()
	{
		return new ArrayIterator($this->_record);
	}
	
	// magic methods
	function __construct($record = null, $key = null)
	{
		$this->_key = $key;
		$this->_record = $record ? $record : new stdClass;
	}
	
	function __isset($name)
	{
		return property_exists($this->_record, $name);
	}
	
	function __get($name)
	{
		return $this->_record->$name;
	}
	
	function __set($name, $value)
	{
		return $this->_record->$name = $value;
	}
	
	
	// CRUD functionality
	static public function create($record, $save = false)
	{
		$instance = new static((object)$record);
		
		if($save)
			$instance->save();
			
		return $instance;
	}
	
	public function save()
	{
		if(!$this->_key)
			$this->_key = static::generateKey();
			
		if(!isset($this->__class__))
			$this->__class__ = get_called_class();
		
		return CloudMine::update($this->_key, $this->_record);
	}
	
	public function delete()
	{
		$result = CloudMine::delete($this->_key);
		
		return property_exists($result->success, $this->_key);
	}
	
	static public function getByKey($key)
	{
		$result = CloudMine::fetch($key);
		
		if(property_exists($result->success, $key))
		{
			return static::instantiate($result->success->$key, $key);
		}
		else
		{
			return null;
		}
	}
	
	static public function getAll()
	{
		return static::getAllByWhere();
	}
	
	static public function getAllByField($key, $value, $scope = null)
	{
		return static::getAllByWhere(array($key => $value), $scope);
	}
	
	static public function getAllByWhere($where = array(), $scope = null)
	{
		$calledClass = get_called_class();
		
		if(is_string($where))
		{
			$where = array($where);
		}
		
		if(!$scope && $calledClass != __CLASS__)
			$where['__class__'] = $calledClass;
	
		$whereStrings = array();
		foreach($where AS $key => $value)
		{
			if(is_integer($key))
			{
				$whereString[] = $value;
				continue;
			}
			
			if(is_string($value))
				$value = '"'.$value.'"';
			
			$whereString[] = $key.'='.$value;
		}
		
		return static::getAllByQuery($scope.'['.implode(',', $whereString).']');
	}
	
	static public function getAllByQuery($query)
	{
		return new CloudMine_Iterator(CloudMine::query($query)->success);
	}
	
	static public function generateKey($prefix = '')
	{
		return uniqid($prefix, true);
	}
	
	static public function instantiate($record, $key = null)
	{
		$calledClass = get_called_class();
		$className = $record->__class__;
		
		if(!$className)
			$className = get_called_class();
		elseif($className != $calledClass && $calledClass != __CLASS__)
			throw new Exception("Retrieved object is not of class $calledClass: key=$key, __class__=$className");
			
		return new $className($record, $key);
	}
	
	// hash encoder
	public function getData()
	{
		return $this->_record;
	}
	
	public function getKey()
	{
		return $this->_key;
	}
	
	// hash applier
	public function applyData($delta, $save = false)
	{
		foreach($delta AS $key => $value)
		{
			$this->$key = $value;
		}
		
		if($save)
			$this->save();
	}
}
<?php

class CloudMine_Iterator extends ArrayIterator
{
	protected $_instances = array();
	
	public function current()
	{
		$key = parent::key();
		
		if(array_key_exists($key, $this->_instances))
		{
			return $this->_instances[$key];
		}
		else
		{
			return $this->_instances[$key] = CloudMine_Record::instantiate(parent::current(), $key);
		}
	}
}
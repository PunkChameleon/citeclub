<?php



 interface Sabre_DAV_ICollection
{


    /**
     * Creates a new file in the directory 
     * 
     * data is a readable stream resource
     *
     * @param string $name Name of the file 
     * @param resource $data Initial payload 
     * @return void
     */
    function createFile($name, $data = null);

    /**
     * Creates a new subdirectory 
     * 
     * @param string $name 
     * @return void
     */
    function createDirectory($name);

    /**
     * Returns a specific child node, referenced by its name 
     * 
     * @param string $name 
     * @return Sabre_DAV_INode 
     */
    function getChild($name);

    /**
     * Returns an array with all the child nodes 
     * 
     * @return Sabre_DAV_INode[] 
     */
    function getChildren();

    /**
     * Checks if a child-node with the specified name exists 
     * 
     * @return bool 
     */
    function childExists($name);


}
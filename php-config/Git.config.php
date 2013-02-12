<?php

Git::$repositories['citeclub'] = array(
	'remote' => 'git@github.com:streetlight/citeclub.git'
	,'originBranch' => 'master'
	,'workingBranch' => 'dev'
	,'trees' => array(
		'html-templates' => 'html-templates',
		'php-classes' => 'php-classes',
		'php-config' => 'php-config',
		'site-root' => 'site-root'
	)
);
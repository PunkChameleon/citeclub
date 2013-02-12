{extends 'site.tpl'}

{block 'content'}

	<script>
		var wikiURL = "{$wikiURL}";
	</script>
	<script type="text/javascript" src="/js/classes/WikitextProcessor.js"></script>
	<script type="text/javascript" src="/js/home.js"></script>
	
	<h2>Cite Club</h2>
	
	{if $lgusername }
	Hello, {$lgusername}! <a href='/action/logout.php'>logout</a><br/>
	{/if}	

	{if $result == 'success'}
		Page edited successfully! <a href="{$wikiURL}/wiki?curid={$pageId}">edited page</a>
	{elseif $result == 'captcha'}
		Please answer this captcha: <br/>
		{if $url}
			<img src="{$url}" />
		{else}
	
		{/if}
	{elseif $result == 'failure'}
		echo 'Error editing page';
	{/if}
	
	<p id="searching"></p>
	
	<p>
		<input type="button" id="newPage" value="new page" /> search by <input type="text" id="keywords" />
	</p>
			
	<p id="explanation"></p>
	
	<blockquote></blockquote>

	{if $lgusername }
		<form method="POST" id="edit" action="/action/edit.php">
			<input type="hidden" id="section" name="section" />
			<input type="hidden" id="pageId" name="pageId" />
			<textarea id="text" name="text" rows="20" cols="100"></textarea><br/>
			<input type="submit" id="editBtn" value="Edit" />
		</form> 
	{else}
		Please <a href="#" id="showLogin">log in</a> or <a href="{$wikiURL}/w/index.php?title=Special:UserLogin&returnto=Main+Page&type=signup">create an account</a> to start citing! 
		<form method="POST" id="login" action="/action/login.php">
			Username: <input type="text" id="username" name="username" /><br/>
			Password: <input type="password" id="password" name="password" /><br/>
		<input type="submit" value="Go" />
	</form>
	{/if}

{/block}
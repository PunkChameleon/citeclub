{extends 'site.tpl'}

{block 'content'}
	
<!--	<h2>Cite Club</h2>
	
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

	

-->

<div id="wrapper"><!-- Begin Wrapper -->
			<div id="main_container">
				<header class="fixed">
					<a href="/">
						<article id="logo">
							<h1>*[cite] <span>club</span></h1>
							<h2>cite the power</h2>
						</article>
					</a>
					<form>
						{if $lgusername }
							<form method="POST" id="edit" action="/action/edit.php">
								<input type="hidden" id="section" name="section" />
								<input type="hidden" id="pageId" name="pageId" />
								<textarea id="text" name="text" rows="20" cols="100"></textarea><br/>
								<input type="submit" id="editBtn" value="Edit" />
							</form>
							
						{else}
							Please <a href="#login_info" id="showLogin" class="inline">log in</a> or <a class="iframe" target="_blank" href="{$wikiURL}/w/index.php?title=Special:UserLogin&returnto=Main+Page&type=signup">create an account</a> to start citing! 
							
							<div style="display:none">
								<div id="login_info">
									<form method="POST" id="login" action="/action/login.php">
										<label>Username: </label><input type="text" id="username" name="username">
										<label>Password:</label> <input type="password" id="password" name="password">
										<input type="submit" value="Go">
									</form>
								</div>
							</div>
							

						</form>

						{/if}
						<form>
							<input type="text"  id="keywords" class="filter" value"" placeholder="Search for Something to Cite Specifically...">
							<input type="submit" class="button" id="newPage" value="Look">
							<label>Or...</label>
							<input type="submit" class="button" id="dice" value="Roll the Dice">
						</form>
					</form>
					<article id="loader">
						<img src="img/ajax-loader.gif">
					</article>
				</header>
				<section id="quoting_area">
					<h2>From the article on <a href="#" id="article_link" target="_blank"></a>...</h2>
					<article id="quote"><!--<p>"One of his criteria for giving an interview to a journalist is that the journalist agree to use his terminology throughout the article.[65] <span>Sometimes he has even required journalists to read parts of the GNU philosophy before an interview, for "efficiency's sake".<sup>[citation needed]</sup></span>He has been known to turn down speaking requests over some terminology issues.[66]</p>--></article>
				</section>
				<section id="play_area"><!-- Start Play Area -->
					<article id="cite_or_skip">
						<input type="submit" class="button" id="citeIt" value="cite it!">
						<label>or</label>
						<input type="submit" class="button" id="skipIt" value="skip it!">
					</article>
					<article id="cite_buttons" style="display: none;">
						<label>What type of source are you using?</label><br>
						<input type="submit" class="button" id="web" value="Web">
						<input type="submit" class="button" id="news" value="News">
						<input type="submit" class="button" id="book" value="Book">
						<input type="submit" class="button" id="journal" value="Journal">
					</article>
					<article id="forms">
						<form id="web">
							<label>Last Name</label>
							<input id="last_name" type="text">
							<label>First Name</label>
							<input id="first_name" type="text">
							<label>Title</label>
							<input id="title" type="text">
							<label>Url</label>
							<input id="url" type="text">
							<label>Work</label>
							<input id="work" type="text">
							<label>Publisher</label>
							<input id="publisher" type="text">
							<label>Access Date</label>
							<input id="access_date" type="text">
							<label>Reference Name</label>
							<input id="reference_name" type="text">
							<label>Reference Group</label>
							<input id="reference_group" type="text">
							<br>
							<input type="button" value="Submit">
						</form>
						<form id="news">
							<label>Last Name</label>
							<input id="last_name" type="text">
							<label>First Name</label>
							<input id="first_name" type="text">
							<label>Title</label>
							<input id="title" type="text">
							<label>Url</label>
							<input id="url" type="text">
							<label>Title</label>
							<input id="title" type="text">
							<label>Access Date</label>
							<input id="access_date" type="text">
							<label>Date</label>
							<input id="date" type="text">
							<label>Reference Name</label>
							<input id="reference_name" type="text">
							<label>Reference Group</label>
							<input id="reference_group" type="text">
							<br>
							<input type="button" value="Submit">
						</form>
						<form id="book">
							<label>Last Name</label>
							<input id="last_name" type="text">
							<label>First Name</label>
							<input id="first_name" type="text">
							<label>Title</label>
							<input id="title" type="text">
							<label>Year</label>
							<input id="year" type="text">
							<label>Publisher</label>
							<input id="publisher" type="text">
							<label>Location</label>
							<input id="location" type="text">
							<label>ISBN</label>
							<input id="isbn" type="text">
							<label>Pages</label>
							<input id="pages" type="text">
							<label>URL</label>
							<input id="url" type="text">
							<label>Reference Name</label>
							<input id="reference_name" type="text">
							<label>Reference Group</label>
							<input id="reference_group" type="text">
							<br>
							<input type="button" value="Submit">
						</form>
						<form id="journal">
							<label>Last Name</label>
							<input id="last_name" type="text">
							<label>First Name</label>
							<input id="first_name" type="text">
							<label>Coauthor(s)</label>
							<input id="coauthors" type="text">
							<label>Title</label>
							<input id="title" type="text">
							<label>Journal</label>
							<input id="journal" type="text">
							<label>Date</label>
							<input id="date" type="text">
							<label>Year</label>
							<input id="year" type="text">
							<label>Month</label>
							<input id="month" type="text">
							<label>Volume</label>
							<input id="volume" type="text">
							<label>Series</label>
							<input id="series" type="text">
							<label>Issue</label>
							<input id="issue" type="text">
							<label>Pages</label>
							<input id="pages" type="text">
							<label>DOI</label>
							<input id="doi" type="text">
							<label>PMID</label>
							<input id="PMID" type="text">
							<label>URL</label>
							<input id="url" type="text">
							<label>Access Date</label>
							<input id="access_date" type="text">
							<label>Reference Name</label>
							<input id="reference_name" type="text">
							<label>Reference Group</label>
							<input id="reference_group" type="text">
							<br>
							<input type="button" value="Submit">
						</form>
				</article>
				</section><!-- End Play Area -->
				<footer>
				<ul>
					<li><a href="#">About Cite Club</a></li>
					<li><a href="#">How to Cite Like a Boss</a></li>
					<li><a href="#">Contribute</a></li>
					<li><a href="#">Contact</a></li>
				</ul>
			</footer>
			</div>
			
		</div><!-- End Wrapper -->

{/block}
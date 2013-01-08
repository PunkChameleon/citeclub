<!DOCTYPE html>
<html>
	<head>
		<title>Cite Club</title>
		<script type="text/javascript" src="/js/jquery-1.8.2.min.js"></script>
		<script type="text/javascript" src="/js/utils.js"></script>
		<script type="text/javascript" src="/js/citeclub.js"></script>
		
		<?php
		
			// start session to be able to access session variables
			session_start();
		
		?>
		
		<script type="text/javascript">
		
			var wikiURL = "<?php echo $_SESSION['wikiURL']; ?>";
			
			if (wikiURL.length > 0) {
		
				var fetcher = new WikiData(wikiURL);
			
				$(document).ready(function() {
	
					$('#searching').html("Searching for a page that needs your help...");
					
					// hide edit form
					$('form#edit').hide();
	
					// add event handler to link
					$('#newPage').click(function() {
						var keywords = $.trim($('#keywords').val());
						newPage(keywords);
					});
	
					// get new page automatically
					$('#newPage').click();
				});
			
			}

			function newPage(keywords) {

				/*
				* Gets new page URL, displays iframe (in case it's hidden), and sets iframe src to it
				*/

				// disable button and edit form while searching
				$('#newPage').prop('disabled', true);
				$('#explanation, blockquote, form#edit').hide();
				$('#searching').empty();

				fetcher.citationNeededPage(keywords, function(pageData) {
					if (pageData != null) {
						// data found!

						// get page id and title
						var id = pageData.id;
						var title = pageData.title;
						
						fetcher.getPageContent(id, function(content) {
							fetcher.getPageHTML(id, function(html) {
															
								$('#searching').html("Page found!");
		
								// give page id to edit form
								$('form#edit #pageId').val(id);
		
								// set text
								$('form#edit #text').html(content);
								
								// set article title & link
								$('#explanation').html('Citation needed for <a href="' + fetcher.urlFromPageId(id) + '">' + title + '</a>:');
								
								// set paragraph 
								var elem = $(html).find(":contains('citation needed')").parent().html();
								$('blockquote').html(elem);
								
								// show article info & edit form
								$('#explanation, blockquote, form#edit').show();
								
								// enable button
								$('#newPage').prop('disabled', false);
							});
						});

					} else {
						// couldn't find any pages
						$('#searching').html("No pages found.");
						// hide article info
						$('#explanation, blockquote, form#edit').hide();
						// enable button
						$('#newPage').prop('disabled', false);
					}

				});
			}
		</script>
	</head>
	<body>
	
		<h2>Cite Club</h2>

		<?php
		
		$loginSucceeded = $_GET['login'];
		if (isset($loginSucceeded) && $loginSucceeded == 0) {
			echo 'Login failed. ';
		}
		
		if (isset($_SESSION['lgusername'])) {
			
			echo "Hello, " . $_SESSION['lgusername'] . "! <a href='/action/logout.php'>logout</a><br/>";
			
			$result = $_GET['result'];
			$pageId = $_GET['pageid'];
			
			if (isset($result)) {
				if ($result == 'success' && isset($pageId)) {
					echo 'Page edited successfully! <a href="' . Wiki::$wikiURL . '/wiki?curid=' . $pageId . '">edited page</a>';
				} else if ($result == 'captcha') {
					echo 'Please answer this captcha: <br/>';
					$url = $_GET['url'];
					if (isset($url)) {
						// image captcha
						echo '<img src="' . $url . '" />';
					} else {
						// match captcha
						echo $_GET['question'];
					}
				} else if ($result == 'failure')  {
					echo 'Error editing page';
				}
			}

			echo '<p id="searching"></p>';
			
			echo '<p>
						<input type="button" id="newPage" value="new page" /> search by <input type="text" id="keywords" />
					</p>';
					
			echo '<p id="explanation"></p>';
			
			echo '<blockquote></blockquote>';
			
			echo '<form method="POST" id="edit" action="/action/edit.php">
					<input type="hidden" id="pageId" name="pageId" />
					<textarea id="text" name="text" rows="20" cols="100"></textarea><br/>
					<input type="submit" id="editBtn" value="Edit" />
				</form>';
		} else {
			echo "Please log in.";
			echo '<form method="POST" id="login" action="/action/login.php">
					Username: <input type="text" id="username" name="username" /><br/>
					Password: <input type="password" id="password" name="password" /><br/>
					<input type="submit" value="Go" />
				</form>';
		}
		
		?>		
	
	</body>
</html>
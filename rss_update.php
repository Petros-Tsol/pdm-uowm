<?php
// For 1.3+:
require_once('../php/autoloader.php');
 
// We'll process this feed with all of the default options.
$feed = new SimplePie();

// Set which feed to process.
$feed->set_feed_url($_POST['url']); 
// Run SimplePie.
$feed->init();
 
// This makes sure that the content is sent to the browser as text/html and the UTF-8 character set (since we didn't change it).
$feed->handle_content_type();
 
// Let's begin our XHTML webpage code.  The DOCTYPE is supposed to be the very first thing, so we'll keep it on the same line as the closing-PHP tag.
?>
<div>
	<h1><a><?php echo $feed->get_title(); ?></a></h1>

	<?php
	//Here, we'll loop through all of the items in the feed, and $item represents the current item in the loop.	
	//item = $feed->get_item(0); FOR THE LATEST ITEM (only the first)
	foreach ($feed->get_items(0,$_POST['items']) as $item):
	?>
		<h2><a href="<?php echo $item->get_permalink(); ?>"><?php echo $item->get_title(); ?></a></h2>
		<p><?php echo $item->get_content(); ?></p>
		<p><small>Posted on <?php echo $item->get_date('j F Y | g:i a'); ?></small></p>
	<?php endforeach; ?>
</div>

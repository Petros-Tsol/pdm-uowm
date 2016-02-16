<?php

session_start();

if (isset($_POST['file']) && isset($_SESSION['admin'])) {
	$content = file_get_contents($_POST['file']); //get contents of file
	if ($content != FALSE) {
		echo nl2br($content);
	} else {
		echo "File not loaded.";
	}
}

?>

<?php

session_start();
if ((!isset($_SESSION['admin'])) || ($_SESSION['admin'] != "root"))
{
	header('Location: login_page.php');
}
	
?>

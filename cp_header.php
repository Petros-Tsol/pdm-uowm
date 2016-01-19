<h1 id = "head_title">UOWM PUBLIC DISPLAY</h1>

<?php
if(isset($_SESSION["admin"])) 
{
    echo "<div id='admin'>";
		echo "Hello ".$_SESSION["admin"];
		echo '<br>';
		echo '<a href = "control_panel.php">Start Page</a>';
		echo '<br>';
		echo '<a href = "ch_pass.php">Change password</a>';
		echo '<br>';
		echo '<a href = "logout.php">Log out</a>';
	echo '</div>';
}
?>


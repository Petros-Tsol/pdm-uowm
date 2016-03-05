<?php
	//require_once('session_check.php');
?>

<div id = "cpside">
	<?php
	if ($_SESSION['admin']=="root"){
		print '<button class = "menu_button">User</button>';
			print '<a href="register_user.php">Create user</a>';
			print '<a href="search_user.php">Search user</a>';
		print '<br>';
		print '<button class = "menu_button">Screen</button>';
			print '<a href="new_device.php">Create screen</a>';
			print '<a href="search_device.php">Search screen</a>';
		print '<br>';
		print '<button class = "menu_button">Group</button>';
			print '<a href="new_group.php">Create group</a>';
			print '<a href="search_group.php">Search group</a>';
			print '<a href="manage_group.php">Manage group</a>';
		print '<br>';
	}
	?>
	<button onclick = "window.open('layout_design.php')">Layout Design</button>
	<br>
	<button onclick = "window.open('display.php')">Set Screen</button>
	<br>
	<button onclick = "location.href='active_screen.php'">Active Screens</button>
	<br>
	<button onclick = "location.href='announcements.php'">Announcements</button>
</div>

<?php

if ($_SESSION['admin']=="root") {
	print '<blockquote>';
		print '<p class = "explain">In the User menu, you can add a user in the database, update his/her personal information or delete him/her.</p>';
	print '</blockquote>';

	print '<blockquote>';
		print '<p class = "explain">In the Screen menu, you can add a screen in the database, update its characteristics or delete it.</p>';
	print '</blockquote>';

	print '<blockquote>';
		print '<p class = "explain">In the Group menu, you can create a new management group and assign the users and screens of that group.</p>';
	print '</blockquote>';
}
print '<blockquote>';
	print '<p class = "explain">Layout Design is the main feature of the website. It will open in a new browser tab and you can design your layouts and contents, that will be pushed to screens.</p>';
print '</blockquote>';

print '<blockquote>';
	print '<p class = "explain">Set Screen let you assign a name for this screen. An assigned screen can communicate with the server to get content updates. It will open in a new browser tab and you can select one of the available screens.</p>';
print '</blockquote>';

print '<blockquote>';
	print '<p class = "explain">In Active Screens, you can overview which screens are currently online and when they will stop to get new data.</p>';
print '</blockquote>';

print '<blockquote>';
	print '<p class = "explain">In Announcements menu, you can overview the out of the flow contents that will be displayed. You can also set new contents to be displayed in a future time.</p>';
print '</blockquote>';
?>

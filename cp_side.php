<div id = "cpside">
	<h2>Control Panel</h2>
	<?php
	session_start();
	
	if ($_SESSION['admin']=="root"){
		print '<button class = "menu_button">User</button>';
			print '<a href="register_user.php">Create user</a>';
			print '<a href="search_user.php">Search user</a>';
		print '<br>';
		print '<button class = "menu_button">Device</button>';
			print '<a href="new_device.php">Create device</a>';
			print '<a href="search_device.php">Search device</a>';
		print '<br>';
		print '<button class = "menu_button">Group</button>';
			print '<a href="new_group.php">Create group</a>';
			print '<a href="manage_group.php">Manage group</a>';
		print '<br>';
	}
	?>
	<button onclick = "window.open('layout_design.php')">Layout Design</button>
	<br>
	<button onclick = "window.open('display.php')">Set Screen</button>
	<br>
	<button onclick = "location.href='active_screen.php'">Active Screens</button>
</div>

<script>
$(document).ready(function(){
	
	$(".menu_button").click(function(){
		$(this).next().fadeToggle(100);
		$(this).next().next().fadeToggle(100);
	});
	
});
</script>

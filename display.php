<?php
	session_start();
	
	require_once('connect.inc');
	require_once('connect2db');
	$conn=connect_db($host,$db,$db_user,$db_pass);
	if (isset($_SESSION['device_id'])){
		if (!isset($_COOKIE['dev_id'])) {
			$cookie_life = 60; // how much time the screen will be active (in seconds)
			setcookie('dev_id',$_SESSION['device_id'],time()+$cookie_life,'/'); //5 sec have already passed because of the page reload

			$sql_query=$conn->prepare("UPDATE screens SET valid_time=? WHERE webid=?");
			$sql_query->bindValue(1,time() + $cookie_life);
			$sql_query->bindParam(2,$_SESSION['device_id']);
			$sql_query->execute();
			
			//session_destroy();
			unset($_SESSION['device_id']);
		}
	}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>PD UOWM - DISPLAY</title>
	
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/display.css">
	<link rel="stylesheet" type="text/css" href="css/rss_and_scrolling_animation.css">
	
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	
	<script src="../flipclock/flipclock.js"></script>
	<link rel="stylesheet" href="../flipclock/flipclock.css">

	<script type="text/javascript" src="js/qrcode.js"></script>
	<script type="text/javascript" src="http://service.24media.gr/js/deltiokairou_widget.js"></script>
	
</head>

<body>
	<?php
	if (!isset($_SESSION['device_id'])) {
		function select_device($connection){
			print "<div id = 'pdm_choose_screen'>";
			
			echo "No cookie detected for this screen. Please select the device for this screen and press install.";
			print "<br><br>";
			
			$sql_query=$connection->prepare("SELECT id FROM users_information WHERE username = ?");
			$sql_query->bindParam(1,$_SESSION['admin']);
			$sql_query->execute();
			$user_id = $sql_query->fetch();
			
			$sql_query=$connection->prepare("SELECT screens_groups.group_id, screen_id FROM screens_groups JOIN users_privileges ON screens_groups.group_id = users_privileges.group_id JOIN screens ON screens_groups.screen_id = screens.id WHERE users_privileges.user_id=? AND screens.webid=? ORDER BY screens_groups.group_id");
			$sql_query->bindParam(1,$user_id['id']);
			$sql_query->bindValue(2,"");
			$sql_query->execute();
			
			$result = $sql_query->fetchAll(PDO::FETCH_COLUMN|PDO::FETCH_GROUP);
			print "<select id = 'screen'>";
			foreach ($result as $index=>$row) {
				$sql_query=$connection->prepare("SELECT description FROM groups WHERE id = ?");
				$sql_query->bindParam(1,$index);
				$sql_query->execute();
				$group_res=$sql_query->fetch();
				print '<optgroup label="'.$group_res['description'].'">';
				
				for ($i=0;$i<count($row);$i=$i+1){
					$sql_query=$connection->prepare("SELECT name FROM screens WHERE id = ?");
					$sql_query->bindValue(1,$row[$i]);
					$sql_query->execute();
					$screen_res = $sql_query->fetch();
					print '<option value = "'.$screen_res['name'].'">'.$screen_res['name'].'</option>';
				}
					
				print '</optgroup>';
			}
			print "</select>";
			print "<button type='button'>Install</button><br>";
			print "<br>";
			print "If no screen is visible then you have probably <a href='login_page.php'>logged out</a> or the administrator has not added a screen for your group yet.";
			
			print "</div>";
		}
		
		print '<h1 class = "main_title">UOWM PUBLIC DISPLAY</h1>';
		select_device($conn);
		
		include 'footer.php';
	}
	$conn = NULL;
?>


<script src="js/display_functions.js"></script>


</body>
</html> 

<?php
	session_start();
	if (isset($_GET['name']) == false) {
		if (isset($_SESSION['device_id']) == false) {
			if (isset($_COOKIE['dev_id']) == false) {
				require_once('session_check.php');
			}
		}
	}
	
	require_once('connect.inc');
	require_once('connect2db');
	$conn=connect_db($host,$db,$db_user,$db_pass);
	
	
	if (isset($_SESSION['device_id'])){
		if (!isset($_COOKIE['dev_id'])) {
			if ($_SESSION['unique'] == true) { //if this is the first screen with this name
				$cookie_life = 1500; // how much time the screen will be active (in seconds), first number is years, second is seconds in an hour, third is hours in a day and last is days of the year.
				setcookie('dev_id',$_SESSION['device_id'],time()+$cookie_life,'/'); //5 sec have already passed because of the page reload

				$sql_query=$conn->prepare("UPDATE screens SET valid_time=? WHERE webid=?");
				$sql_query->bindValue(1,time() + $cookie_life);
				$sql_query->bindParam(2,$_SESSION['device_id']);
				$sql_query->execute();
			} else {
				$sql_query=$conn->prepare("SELECT valid_time FROM screens WHERE webid = ?");
				$sql_query->bindParam(1,$_SESSION['device_id']);
				$sql_query->execute();
				$time = $sql_query->fetch();
				
				setcookie('dev_id',$_SESSION['device_id'],$time['valid_time'],'/');
			}
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
			
			echo "No cookie detected for this screen. Please select a screen and press Set.";
			print "<br><br>";
			
			$sql_query=$connection->prepare("SELECT id FROM users_information WHERE username = ?");
			$sql_query->bindParam(1,$_SESSION['admin']);
			$sql_query->execute();
			$user_id = $sql_query->fetch();
			
			$sql_query=$connection->prepare("SELECT screens_groups.group_id, screen_id FROM screens_groups JOIN users_privileges ON screens_groups.group_id = users_privileges.group_id JOIN screens ON screens_groups.screen_id = screens.id WHERE users_privileges.user_id=? ORDER BY screens_groups.group_id");
			$sql_query->bindParam(1,$user_id['id']);
			$sql_query->execute();
			
			$result = $sql_query->fetchAll(PDO::FETCH_COLUMN|PDO::FETCH_GROUP);
			if (!empty($result)){
				print "<select id = 'screen'>";
				foreach ($result as $index=>$row) {
					$sql_query=$connection->prepare("SELECT name FROM groups WHERE id = ?");
					$sql_query->bindParam(1,$index);
					$sql_query->execute();
					$group_res=$sql_query->fetch();
					print '<optgroup label="'.$group_res['name'].'">';
					
					for ($i=0;$i<count($row);$i=$i+1){
						$sql_query=$connection->prepare("SELECT name,webid,unique_id FROM screens WHERE id = ?");
						$sql_query->bindValue(1,$row[$i]);
						$sql_query->execute();
						$screen_res = $sql_query->fetch();
						if ($screen_res['webid']=="") {
							print '<option value = "'.$screen_res['name'].'">'.$screen_res['name'].'</option>';
						} else {
							print '<option value = "'.$screen_res['name'].'" style = "color:#29b332;">'.$screen_res['name'].'</option>';
						}
						$unique_id = $unique_id.'-'.$screen_res['unique_id'];
					}
						
					print '</optgroup>';
				}
				
				
				print "</select>";
				print "<button type='button'>Set</button><br>";
				print "<br>";
				
				
				$partial = preg_split("/[\s\-]+/",$unique_id,NULL,PREG_SPLIT_NO_EMPTY);
				$server = $_SERVER['SERVER_NAME'];

				for ($i=0;$i<count($partial);$i=$i+1) {
					print '<p>URL for direct access <a href ="http://'.$server.'/pd_uowm/display.php?name='.$partial[$i].'">'.$server.'/pd_uowm/display.php?name='.$partial[$i].'</a></p>';
				}
			} else {
				print "The administrator has not added a screen for your group.";
			}
			print "</div>";
		}
		
		if (!isset($_GET['name'])) { //if a screen has not been provided. So the url is not in a pattern like display.php?screen=something, it's just display.php
			print '<h1 class = "main_title">UOWM PUBLIC DISPLAY</h1>';
			select_device($conn);
		}
		
		include 'footer.php';
	}
	$conn = NULL;
?>

<script src="js/content_properties.js"></script>
<script src="js/display_functions.js"></script>


</body>
</html> 

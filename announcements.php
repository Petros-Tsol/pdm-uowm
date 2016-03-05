<?php
	require_once('session_check.php');
?>

<!DOCTYPE html>
<html>

<head>
	
    <title>PD UOWM - Announcements</title>
    <meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/sidebar.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/announcements.css">
    <link rel="stylesheet" type="text/css" href="css/form.css">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">
    
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="http://code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.4.5/jquery-ui-timepicker-addon.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.4.5/jquery-ui-sliderAccess.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.4.5/jquery-ui-timepicker-addon.min.css">
    

    <script src="js/sidebar.js"></script>
    <script src="js/announcements.js"></script>
</head>

<body>
	<div id = "container">
	<?php
		include 'cp_header.php';
		include 'cp_side.php';
	?>
	
	<div id = "ann_table">
		<?php
			require_once('connect.inc');
			require_once('connect2db');
				
			$conn=connect_db($host,$db,$db_user,$db_pass);
			
			$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username=?"); //get user id
			$sql_query->bindParam(1,$_SESSION['admin']);
			$sql_query->execute();
			$user = $sql_query->fetch();
			
			
			$sql_query=$conn->prepare("SELECT group_id FROM users_privileges WHERE users_privileges.user_id = ? ORDER BY group_id"); //get id of groups where the user can operate
			$sql_query->bindParam(1,$user['id']);
			$sql_query->execute();
			$groups=$sql_query->fetchAll();
			
			print "<table>";
			print "<tr>";
				print "<th>Group</th>";
				print "<th>Screen</th>";
				print "<th>Content</th>";
				print "<th>From</th>";
				print "<th>To</th>";
			print "</tr>";
			foreach ($groups as $row) {
				$sql_query=$conn->prepare("SELECT name FROM groups WHERE id = ?"); //get group name
				$sql_query->bindParam(1,$row['group_id']);
				$sql_query->execute();
				$group_name = $sql_query->fetch();
				
				$sql_query=$conn->prepare("SELECT COUNT(*) FROM screens_groups WHERE group_id = ?"); //get number of screens of this group
				$sql_query->bindParam(1,$row['group_id']);
				$sql_query->execute();
				$number_of_screens = $sql_query->fetch();
				
				$sql_query=$conn->prepare("SELECT screen_id FROM screens_groups WHERE group_id = ?"); //get screens of this group
				$sql_query->bindParam(1,$row['group_id']);
				$sql_query->execute();
				$result = $sql_query->fetchAll();
				
				print "<tr>";
				if ($number_of_screens[0] == 0) {
					print '<td class ="group">'.$group_name['name'].'</td>';
					print '<td></td>';
					print '<td></td>';
					print '<td></td>';
					print '<td></td>';
					print "</tr>";
					continue;
				} else {
					print '<td class ="group" rowspan = "'.$number_of_screens[0].'">'.$group_name['name'].'</td>';
				}
				foreach ($result as $ind=>$screen) {
					if ($ind > 0) {
						print "<tr>";
					}
					$sql_query=$conn->prepare("SELECT name FROM screens WHERE id = ?"); //get screen name
					$sql_query->bindParam(1,$screen[0]);
					$sql_query->execute();
					$screen_name = $sql_query->fetch();
					
					$sql_query=$conn->prepare("SELECT content_id,datetimefrom,datetimeto FROM announcements WHERE screen_id = ?"); //get screens of this group
					$sql_query->bindParam(1,$screen['screen_id']);
					$sql_query->execute();
					$announcements = $sql_query->fetch();
					
					$sql_query=$conn->prepare("SELECT name FROM contents WHERE id = ?");
					$sql_query->bindParam(1,$announcements['content_id']);
					$sql_query->execute();
					$content = $sql_query->fetch();
					
					print '<td class="screen">'.$screen_name['name'].'</td>';
					print "<td>".$content['name']."</td>";
					if ($announcements['datetimefrom']!=null) {
						print "<td>".date('d/m/Y H:i',$announcements['datetimefrom'])."</td>";
					} else {
						print "<td></td>";
					}
					if ($announcements['datetimefrom']!=null) {
						print "<td>".date('d/m/Y H:i',$announcements['datetimeto'])."</td>";
					} else {
						print "<td></td>";
					}
					print "</tr>";
				print "</tr>";
				}
			}
			print "</table>";
			$conn = null;
		?>
	</div>
	
	
	</div>
	<?php
		include 'footer.php';
	?>
</body>
</html>

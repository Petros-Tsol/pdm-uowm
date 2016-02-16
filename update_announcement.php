<?php
function insert_into_announcements($connection,$id,$sday,$eday){
	$sql_query=$connection->prepare("SELECT id FROM contents WHERE name = ?"); //get content id
	$sql_query->bindParam(1,$_POST['content']);
	$sql_query->execute();
	$content = $sql_query->fetch();
	
	$sql_query=$connection->prepare("DELETE FROM announcements WHERE screen_id=?");
	$sql_query->bindParam(1,$id);
	$sql_query->execute();
	
	$sql_query=$connection->prepare("INSERT INTO announcements (screen_id,content_id,datetimefrom,datetimeto) VALUES (?,?,?,?)");
	$sql_query->bindParam(1,$id);
	$sql_query->bindParam(2,$content['id']);
	$sql_query->bindParam(3,$sday);
	$sql_query->bindParam(4,$eday);
	if ($sql_query->execute()) {
		return true;
	} else {
		return false;
	}	
}

	session_start();
	
	require_once('connect.inc');
	require_once('connect2db');

	$conn=connect_db($host,$db,$db_user,$db_pass);
	
	if ($_POST['data']=="contents" && isset($_SESSION['admin'])) {
		$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username = ?");
		$sql_query->bindParam(1,$_SESSION['admin']);
		$sql_query->execute();
		$user_id = $sql_query->fetch();
		
		if ($_SESSION['admin'] == "root") {
			$sql_query=$conn->prepare("SELECT name FROM contents");
		} else {
			$sql_query=$conn->prepare("SELECT name FROM contents WHERE user_id = ?");
			$sql_query->bindParam(1,$user_id['id']);
		}
		$sql_query->execute();
		$result = $sql_query->fetchAll();
		
		echo json_encode($result);
	} else if (isset($_POST['content']) && isset($_SESSION['admin'])) {
		$_POST['sday'] = str_replace('/','-',$_POST['sday']);
		$_POST['eday'] = str_replace('/','-',$_POST['eday']);
		
		$start_date = strtotime($_POST['sday'].' '.$_POST['stime']);
		$end_date = strtotime($_POST['eday'].' '.$_POST['etime']);
		
		if ($start_date != false && $end_date != false) {
			if ($_POST['category']=="screen"){
				$sql_query=$conn->prepare("SELECT id FROM screens WHERE name = ?"); //get screen id
				$sql_query->bindParam(1,$_POST['name']);
				$sql_query->execute();
				$screen = $sql_query->fetch();
				
				$ret = insert_into_announcements($conn,$screen['id'],$start_date,$end_date);
				if ($ret == true) {
					echo "<p class = 'success'>Announcements updated.</p>";
				} else {
					echo "<p class = 'error_msg'>An error occured. Please try again.</p>";
				}
			} else if ($_POST['category']=="group") {
				$sql_query=$conn->prepare("SELECT id FROM groups WHERE name = ?"); //get group id
				$sql_query->bindParam(1,$_POST['name']);
				$sql_query->execute();
				$group = $sql_query->fetch();
				
				$sql_query=$conn->prepare("SELECT screen_id FROM screens_groups WHERE group_id = ?"); //get group id
				$sql_query->bindParam(1,$group['id']);
				$sql_query->execute();
				$result = $sql_query->fetchAll();
				
				foreach ($result as $row) {
					$ret = insert_into_announcements($conn,$row['screen_id'],$start_date,$end_date);
					if ($ret == false) {
						echo "<p class = 'error_msg'>An error occured. Please try again.</p>";
						break;
					}
				}
				
				if ($ret == true) {
					echo "<p class = 'success'>Announcements updated.</p>";
				}
			}
		} else {
			echo "<p class = 'error_msg'>An error occured. One or more of the fields is not in an appropriate format.</p>";
		}
	}
	
	$conn = null;
?>

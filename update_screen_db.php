<?php

function activate_screen($connection,$screen,$webid) {
	require_once('rng.php');
	
	if (empty($webid)) { //if this screen has not a webid
		do { //generate a unique random webID
			$webid = random_webid(10);
			$sql_query=$connection->prepare("SELECT webid FROM screens WHERE webid LIKE ?");
			$sql_query->bindParam(1,$webid);
			$sql_query->execute();
			$result=$sql_query->fetchAll();
		} while (!empty($result));
		
		do { //generate a unique random qrcode_id
			$qrid = random_webid(15);
			$sql_query=$connection->prepare("SELECT qrcode_id FROM screens WHERE qrcode_id LIKE ?");
			$sql_query->bindParam(1,$qrid);
			$sql_query->execute();
			$result=$sql_query->fetchAll();
		} while (!empty($result));

		$sql_query=$connection->prepare("UPDATE screens SET webid=?, qrcode_id=? WHERE name=?");
		$sql_query->bindParam(1,$webid);
		$sql_query->bindParam(2,$qrid);
		$sql_query->bindParam(3,$screen);
		if ($sql_query->execute()) {
			$_SESSION['device_id'] = htmlspecialchars($webid);
			$_SESSION['unique'] = true;
			echo "ok";
		} else {
			echo "A problem occured. Please try again.";
		}
	} else { //if the screen has a webid
		$sql_query=$connection->prepare("SELECT valid_time FROM screens WHERE webid LIKE ?");
		$sql_query->bindParam(1,$webid);
		$sql_query->execute();
		$result = $sql_query->fetch();
		
		if (time() < $result['valid_time']){
			$_SESSION['device_id'] = htmlspecialchars($webid);
			$_SESSION['unique'] = false;
			echo "ok";
		} else {
			$sql_query=$connection->prepare("UPDATE screens SET valid_time = ? WHERE webid LIKE ?");
			$sql_query->bindValue(1,null);
			$sql_query->bindParam(2,$webid);
			$sql_query->execute();
			
			$_SESSION['device_id'] = htmlspecialchars($webid);
			$_SESSION['unique'] = true;
			echo "ok";
		}
	}
	
}

function input_from_url($connection,$screen) {
	
	$sql_query=$connection->prepare("SELECT name, webid, id FROM screens WHERE unique_id = ?");
	$sql_query->bindParam(1,$screen);
	$sql_query->execute();
	$webid=$sql_query->fetch();
	
	if (!empty($webid['id'])) { //if a screen but with this unique_id
		activate_screen($connection,$webid['name'],$webid['webid']);
	} else {
		echo "redirect_to_login";
	}
	
}

session_start();
require_once('connect.inc');
require_once('connect2db');
require_once('groups_intersection.php');
$conn=connect_db($host,$db,$db_user,$db_pass);

if (isset($_SESSION['admin'])) {
	
	if (isset($_POST['device_name'])){ //called by layout_design.php when UPDATE SCREEN button pressed

		if ($_POST['group']=="no") { //if a single screen has been selected.
			$sql_query=$conn->prepare("SELECT id FROM screens WHERE name = ?");
			$sql_query->bindParam(1,$_POST['device_name']);
			$sql_query->execute();
			$result=$sql_query->fetch();
			
			$sql_query=$conn->prepare("DELETE FROM content_scheduler WHERE screen_id = ?");
			$sql_query->bindParam(1,$result['id']);
			$sql_query->execute();
			
			$sql_query=$conn->prepare("SELECT id FROM contents WHERE name = ?");
			$sql_query->bindParam(1,$_POST['content']);
			$sql_query->execute();
			$content_id=$sql_query->fetch();
			
			$sql_query=$conn->prepare("INSERT INTO content_scheduler (screen_id, content_id, queue, refresh_rate) VALUES (?,?,?,?)");
			$sql_query->bindParam(1,$result['id']);
			$sql_query->bindParam(2,$content_id['id']);
			$sql_query->bindValue(3,1);
			$sql_query->bindValue(4,0);
			if ($sql_query->execute()) {
				echo "Screen updated correctly.";
			} else {
				echo "An error occured. Please try again.";
			}
		} else { //if a group has been selected
			$sql_query=$conn->prepare("SELECT id FROM groups WHERE name = ?");
			$sql_query->bindParam(1,$_POST['device_name']);
			$sql_query->execute();
			$group_res = $sql_query->fetch();
			
			$sql_query=$conn->prepare("SELECT id FROM contents WHERE name = ?");
			$sql_query->bindParam(1,$_POST['content']);
			$sql_query->execute();
			$content_id=$sql_query->fetch();
			
			$sql_query=$conn->prepare("SELECT screen_id FROM screens_groups WHERE group_id = ?");
			$sql_query->bindParam(1,$group_res['id']);
			$sql_query->execute();
			$result=$sql_query->fetchAll();
			
			$status = true;
			foreach ($result as $row) {
				$sql_query=$conn->prepare("DELETE FROM content_scheduler WHERE screen_id = ?");
				$sql_query->bindParam(1,$row['screen_id']);
				$sql_query->execute();
				
				$sql_query=$conn->prepare("INSERT INTO content_scheduler (screen_id, content_id, queue, refresh_rate) VALUES (?,?,?,?)");
				$sql_query->bindParam(1,$row['screen_id']);
				$sql_query->bindParam(2,$content_id['id']);
				$sql_query->bindValue(3,1);
				$sql_query->bindValue(4,0);
				if ($sql_query->execute()){
					$status = true;	
				} else {
					$status = false;
				}
			}
			
			if ($status==true){
				echo "Group updated correctly.";
			} else {
				echo "An error occured. Please try again.";
			}
		}
	} else if (isset($_POST['name']) && isset($_POST['input']) && isset($_SESSION['admin'])){ //called by display.php when SET SCREEN button pressed  or a screen is provided directly to url
		$screen = filter_var($_POST['name'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
		
		if ($_POST['input'] == 0) { // a screen has been typed in the url
			
			input_from_url($conn,$screen);
			/*
			$sql_query=$conn->prepare("SELECT name, webid, id FROM screens WHERE unique_id = ?");
			$sql_query->bindParam(1,$screen);
			$sql_query->execute();
			$webid=$sql_query->fetch();
			
			if (!empty($webid['id'])) { //if a screen but with this unique_id
				activate_screen($conn,$webid['name'],$webid['webid']);
			} else {
				echo "redirect";
			}
			*/
		} else {// a screen has been selected from the list
			$sql_query=$conn->prepare("SELECT id, webid FROM screens WHERE name = ?");
			$sql_query->bindParam(1,$screen);
			$sql_query->execute();
			$webid=$sql_query->fetch();
			
			$sql_query=$conn->prepare("SELECT group_id FROM screens_groups WHERE screen_id = ?");
			$sql_query->bindParam(1,$webid['id']);
			$sql_query->execute();
			$screen_groups=$sql_query->fetchAll();
			
			$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username=?");
			$sql_query->bindParam(1,$_SESSION['admin']);
			$sql_query->execute();
			$user_id=$sql_query->fetch();
			
			$sql_query=$conn->prepare("SELECT group_id FROM users_privileges WHERE user_id = ?");
			$sql_query->bindParam(1,$user_id['id']);
			$sql_query->execute();
			$user_groups=$sql_query->fetchAll();
			
			$common_groups = array_uintersect($user_groups,$screen_groups,'compareValue'); //get the common groups between a screen and user
			
			if ((!empty($webid['id'])) && (!empty($common_groups))) { //if id of screen has not found or this user has not access to this screen , return him back to screen selection.
				activate_screen($conn,$screen,$webid['webid']);
			} else {
				echo "redirect";
			}
		}	
		
		
		/*
		$myfile = fopen("debugfiles", "w") or die("Unable to open file!");
		fwrite($myfile,$screen_groups['group_id']);
		fclose($myfile);
		*/
		
		
		/*
		if ((!empty($webid['id'])) && (!empty($common_groups))) { //if id of screen has not found or this user has not access to this screen or if the unique_id is invalid, return him back to screen selection.

			if (empty($webid['webid'])) { //if this screen has not a webid
				do { //generate a unique random webID
					$webid = random_webid(10);
					$sql_query=$conn->prepare("SELECT webid FROM screens WHERE webid LIKE ?");
					$sql_query->bindParam(1,$webid);
					$sql_query->execute();
					$result=$sql_query->fetchAll();
				} while (!empty($result));
				
				do { //generate a unique random qrcode_id
					$qrid = random_webid(15);
					$sql_query=$conn->prepare("SELECT qrcode_id FROM screens WHERE qrcode_id LIKE ?");
					$sql_query->bindParam(1,$qrid);
					$sql_query->execute();
					$result=$sql_query->fetchAll();
				} while (!empty($result));

				$sql_query=$conn->prepare("UPDATE screens SET webid=?, qrcode_id=? WHERE name=?");
				$sql_query->bindParam(1,$webid);
				$sql_query->bindParam(2,$qrid);
				$sql_query->bindParam(3,$screen);
				if ($sql_query->execute()) {
					$_SESSION['device_id'] = htmlspecialchars($webid);
					$_SESSION['unique'] = true;
					echo "ok";
				} else {
					echo "A problem occured. Please try again.";
				}
			} else { //if the screen has a webid
				$_SESSION['device_id'] = htmlspecialchars($webid['webid']);
				$_SESSION['unique'] = false;
				echo "ok";
			}
		} else {
			echo "redirect";
		} */
	} else if ($_POST['button'] == "update_screen_scheduler" && isset($_POST['screen']) && isset($_POST['contents']) && isset($_POST['time_sec']) && isset($_SESSION['admin'])) { //contents added to scheduler.
		
		$sql_query=$conn->prepare("SELECT id FROM screens WHERE name = ?");
		$sql_query->bindParam(1,$_POST['screen']);
		$sql_query->execute();
		$result=$sql_query->fetchAll();
		
		foreach ($result as $row) {
			$screen_id = $row[0];
		}
		
		$sql_query=$conn->prepare("DELETE FROM content_scheduler WHERE screen_id = ?");
		$sql_query->bindParam(1,$screen_id);
		$sql_query->execute();
		
		//print_r ($_POST['contents'][1]);
		$number_of_contents = count($_POST['contents']);
		
		for ($i=0;$i<$number_of_contents;$i=$i+1) {
			$sql_query=$conn->prepare("SELECT id FROM contents WHERE name = ?");
			$sql_query->bindParam(1,$_POST['contents'][$i]);
			$sql_query->execute();
			$result=$sql_query->fetch();

			$content_id = $result['id'];
			$sql_query=$conn->prepare("INSERT INTO content_scheduler (screen_id, content_id, queue, refresh_rate) VALUES (?,?,?,?)");
			$sql_query->bindParam(1,$screen_id);
			$sql_query->bindParam(2,$content_id);
			$sql_query->bindValue(3,$i+1);
			$sql_query->bindParam(4,$_POST['time_sec']);
			
			if (!$sql_query->execute()) {
				break;
			}
		}
		
		if ($i == $number_of_contents) {
			echo "Content rotation updated.";
		} else {
			echo "An error occured. Please try again.";
		}
		
	}
} else {
	if (isset($_POST['name']) && isset($_POST['input'])) {
		$screen = filter_var($_POST['name'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);

		if ($_POST['input'] == 0){ // a screen has been typed in the url
			input_from_url($conn,$screen);
		}
	} else {
		echo "redirect";
	}
}
$conn = NULL;
?>

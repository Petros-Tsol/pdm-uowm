<?php
session_start();

if (isset($_POST['device_name']) && isset($_SESSION['admin'])){ //called by layout_design.php when UPDATE SCREEN button pressed
	require_once('connect.inc');
	require_once('connect2db');
	$conn=connect_db($host,$db,$db_user,$db_pass);

	if ($_POST['group']=="no") { //if a single screen has been selected.
		$sql_query=$conn->prepare("UPDATE screens SET html=?, backcolor=?, backimage_url=?, backimage_option=? WHERE name=?");
		$sql_query->bindParam(1,$_POST['data']);
		$sql_query->bindParam(2,$_POST['bg']);
		$sql_query->bindParam(3,$_POST['bg_img']);
		$sql_query->bindParam(4,$_POST['bg_opt']);
		$sql_query->bindParam(5,$_POST['device_name']);
		
		if ($sql_query->execute()) {
			echo "Screen updated correctly.";
		} else {
			echo "An error occured. Please try again.";
		}
	} else { //if a group has been selected
		$sql_query=$conn->prepare("SELECT id FROM groups WHERE description = ?");
		$sql_query->bindParam(1,$_POST['device_name']);
		$sql_query->execute();
		$group_res = $sql_query->fetch();
		
		$sql_query=$conn->prepare("UPDATE screens JOIN screens_groups ON screens.id=screens_groups.screen_id SET html=?, backcolor=?, backimage_url=?, backimage_option=? WHERE screens_groups.group_id=?");
		$sql_query->bindParam(1,$_POST['data']);
		$sql_query->bindParam(2,$_POST['bg']);
		$sql_query->bindParam(3,$_POST['bg_img']);
		$sql_query->bindParam(4,$_POST['bg_opt']);
		$sql_query->bindParam(5,$group_res['id']);
		
		if ($sql_query->execute()){
			echo "Group updated correctly.";
		} else {
			echo "An error occured. Please try again.";
		}
	}
	$conn = NULL;
} else if (isset($_POST['name'])){ //called by display.php when INSTALL SCREEN button pressed
	require_once('connect.inc');
	require_once('connect2db');
	require_once('rng.php');
	
	$conn=connect_db($host,$db,$db_user,$db_pass);
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
	/*
	$myfile = fopen("logfile", "w");
	fwrite($myfile, $webid);
	fwrite($myfile,"\n");
	fwrite($myfile,$_POST['screen']);
	fclose($myfile);
	*/
	$sql_query=$conn->prepare("UPDATE screens SET webid=?, qrcode_id=? WHERE name=?");
	$sql_query->bindParam(1,$webid);
	$sql_query->bindParam(2,$qrid);
	$sql_query->bindParam(3,$_POST['name']);
	if ($sql_query->execute()) {	
		session_start();
		$_SESSION['device_id'] = htmlspecialchars($webid);
		echo "ok";
	} else {
		echo "A problem occured. Please try again.";
	}
	$conn = NULL;
} else if (isset($_POST['button']) && isset($_SESSION['admin'])) {
	require_once('connect.inc');
	require_once('connect2db');
	$conn=connect_db($host,$db,$db_user,$db_pass);
	
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
		$result=$sql_query->fetchAll();
		
		
		foreach ($result as $row) {
			$content_id = $row[0];
			$sql_query=$conn->prepare("INSERT INTO content_scheduler (screen_id, content_id, queue, refresh_rate) VALUES (?,?,?,?)");
			$sql_query->bindParam(1,$screen_id);
			$sql_query->bindParam(2,$content_id);
			$sql_query->bindValue(3,$i+1);
			$sql_query->bindParam(4,$_POST['time_sec']);
			if ($sql_query->execute()) {
				echo "Content rotation updated.";
			} else {
				echo "An error occured. Please try again.";
			}
		}
	}
	$conn = NULL;
} else {
	echo "An error occured. You have probably signed out. Please re-login and try again.";
}

?>

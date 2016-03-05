<?php

require_once('connect.inc');
require_once('connect2db');
			
$conn=connect_db($host,$db,$db_user,$db_pass);


if (isset($_POST['delete_group'])){
	$gname = filter_var($_POST['delete_group'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	
	$sql_query=$conn->prepare("DELETE FROM groups WHERE name=?");
	$sql_query->bindParam(1,$gname);
	if ($sql_query->execute()) {
		echo "<p class = 'success'>Group named ".$gname." removed.</p>" ;
	} else {
		echo "<p class = 'error_msg'>An error occured. Please try again.</p>" ;
	}
} else if (isset($_POST['update_group'])) {
	$group = filter_var($_POST['update_group'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$descr = filter_var($_POST['description'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$old_name = $_POST['old_name'];
	$error_msg = "";
	
	if (strlen($group)<=25 && strlen($descr)<=300) {
		$sql_query=$conn->prepare("SELECT id, name FROM groups WHERE name = ?");
		$sql_query->bindParam(1,$group);
		$sql_query->execute();
		$result=$sql_query->fetchAll();
		//print_r($result);
		$var1=empty($result);
		
		foreach ($result as $row){
			$id = $row[0];
			$db_name=$row[1];
		}
		
		if ($var1 == 1) {
			$sql_query=$conn->prepare("UPDATE groups SET name=?, description=? WHERE name=?");
			$sql_query->bindParam(1,$group);
			$sql_query->bindParam(2,$descr);
			$sql_query->bindParam(3,$old_name);
			if ($sql_query->execute()) {
				echo "<p class='success'>Group named ".$old_name." updated.</p>";
			} else {
				echo "<p class='error_msg'>An error occured. Please try again.</p>";
			}
		
		} else if ($db_name==$old_name) {
			$sql_query=$conn->prepare("UPDATE groups SET name=?, description=? WHERE id=?");
			$sql_query->bindParam(1,$group);
			$sql_query->bindParam(2,$descr);
			$sql_query->bindParam(3,$id);
			if ($sql_query->execute()) {
				echo "<p class='success'>Group named ".$group." updated.</p>";
			} else {
				echo "<p class='error_msg'>An error occured. Please try again.</p>";
			}

		} else {
			echo "<p class='error_msg'>Group name already exists.</p>";
		}
	} else {
		if (strlen($group)>25) {
			$error_msg = "Group name must not exceed 15 characters.<br>";
		}
		
		if (strlen($descr)>300) {
			$error_msg = $error_msg."Description must not exceed 300 characters.";
		}
		
		echo "<p class='error_msg'>".$error_msg."</p>";
	}
	
}

$conn = null;
?>

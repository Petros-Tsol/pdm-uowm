<?php
require_once('connect.inc');
require_once('connect2db');
			
$conn=connect_db($host,$db,$db_user,$db_pass);


if (isset($_POST['delete_device'])){
		$screen = filter_var($_POST['delete_device'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
		$sql_query=$conn->prepare("DELETE FROM screens WHERE name=?");
		$sql_query->bindParam(1,$screen);
		if ($sql_query->execute()) {
			echo "<p class = 'success'>Screen named ".$screen." removed.</p>" ;
		} else {
			echo "<p class = 'error_msg'>An error occured. Please try again.</p>" ;
		}
}

if (isset($_POST['update_device'])){
	$screen = filter_var($_POST['update_device'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$descr = filter_var($_POST['description'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$old_name = $_POST['old_name'];

	$sql_query=$conn->prepare("SELECT id, name FROM screens WHERE name = ?");
	$sql_query->bindParam(1,$screen);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	$var1=empty($result);
	
	foreach ($result as $row){
		$id = $row[0];
		$db_name=$row[1];
	}
	
	if ($var1 == 1) {
		$sql_query=$conn->prepare("UPDATE screens SET name=?, description=? WHERE name=?");
		$sql_query->bindParam(1,$screen);
		$sql_query->bindParam(2,$descr);
		$sql_query->bindParam(3,$old_name);
		if ($sql_query->execute()) {
			echo "<p class='success'>Screen named ".$old_name." updated.</p>";
		} else {
			echo "<p class='error_msg'>An error occured. Please try again.</p>";
		}
	
	} else if ($db_name==$old_name) {
		$sql_query=$conn->prepare("UPDATE screens SET name=?, description=? WHERE id=?");
		$sql_query->bindParam(1,$screen);
		$sql_query->bindParam(2,$descr);
		$sql_query->bindParam(3,$id);
		if ($sql_query->execute()) {
			echo "<p class='success'>Screen named ".$screen." updated.</p>";
		} else {
			echo "<p class='error_msg'>An error occured. Please try again.</p>";
		}

	} else {
		echo "<p class='error_msg'>Screen name already exists.</p>";
	}
}

$conn = NULL;
?>


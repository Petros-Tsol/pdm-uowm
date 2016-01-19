<?php
require_once('connect.inc');
require_once('connect2db');
			
$conn=connect_db($host,$db,$db_user,$db_pass);


if (isset($_POST['delete_device'])){
		$screen = filter_var($_POST['delete_device'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
		$sql_query=$conn->prepare("DELETE FROM screens WHERE name=?");
		$sql_query->bindParam(1,$screen);
		$sql_query->execute();
		
		echo "Screen named ".$screen." removed." ;
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
		$sql_query->execute();
	
		echo "Screen named ".$old_name." updated.";
	} else if ($db_name==$old_name) {
		$sql_query=$conn->prepare("UPDATE screens SET name=?, description=? WHERE id=?");
		$sql_query->bindParam(1,$screen);
		$sql_query->bindParam(2,$descr);
		$sql_query->bindParam(3,$id);
		$sql_query->execute();

		echo "Screen named ".$screen." updated.";
	} else {
		echo "Screen name already exists.";
	}
}

$conn = NULL;
?>


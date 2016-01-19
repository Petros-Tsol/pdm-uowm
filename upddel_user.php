<?php
require_once('connect.inc');
require_once('connect2db');
			
$conn=connect_db($host,$db,$db_user,$db_pass);


if (isset($_POST['delete_user'])){
		$username = filter_var($_POST['delete_user'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
		$sql_query=$conn->prepare("DELETE FROM users_information WHERE username=?");
		$sql_query->bindParam(1,$username);
		$sql_query->execute();
		echo "User: ".$username." removed." ;
}

if (isset($_POST['update_user'])){
	$username = filter_var($_POST['update_user'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$email=filter_var($_POST['email'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);

	$sql_query=$conn->prepare("SELECT username, email FROM users_information WHERE username=?");
	$sql_query->bindParam(1,$username);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	$var1=empty($result);
	
	foreach ($result as $row){
		$db_email=$row[1];
	}
	
	if ($var1 == 1 || $db_email==$email) {
		$lname=filter_var($_POST['lname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
		$fname=filter_var($_POST['fname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	
		$sql_query=$conn->prepare("UPDATE users_information SET username=?, fname=?, lname=? WHERE email=?");
		$sql_query->bindParam(1,$username);
		$sql_query->bindParam(2,$fname);
		$sql_query->bindParam(3,$lname);
		$sql_query->bindParam(4,$email);
		$sql_query->execute();
	
		echo "Information of user with ".$email." updated.";
	} else {
		echo "Username already exists. Try a new one.";
	}
}

$conn = NULL;

?>

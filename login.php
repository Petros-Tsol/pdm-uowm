<?php

require_once('connect.inc');
require_once('connect2db');

if (isset($_POST['submit_login']))
{
	$user=$_POST['username'];
	$pass=$_POST['password'];

	$conn=connect_db($host,$db,$db_user,$db_pass);

	$sql_query=$conn->prepare("SELECT password FROM users_information WHERE username=?");
	$sql_query->bindParam(1,$user);
	$sql_query->execute();
	$result=$sql_query->fetchAll();

	foreach ($result as $row){
		$hashed_pass = $row[0];
	}

	if (!empty($hashed_pass)) // if a user was found
	{
		if (password_verify($pass,$hashed_pass)) { //verify the input password with the hashed
			session_start();
			$_SESSION["admin"] = htmlspecialchars($user);

			header('Location: control_panel.php');
		} else {
			$error  = "Username or password is not correct.";
		}
	} else {
		$error  = "Username or password is not correct.";
	}
	
}


?>

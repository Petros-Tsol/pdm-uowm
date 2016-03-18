<?php

require_once('connect.inc');
require_once('connect2db');

if (isset($_POST['submit_login']))
{
	$user=filter_var($_POST['username'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$pass=filter_var($_POST['password'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);

	$conn=connect_db($host,$db,$db_user,$db_pass);

	$sql_query=$conn->prepare("SELECT password FROM users_information WHERE username=?");
	$sql_query->bindParam(1,$user);
	$sql_query->execute();
	$result=$sql_query->fetch();

	if (!empty($result['password'])) // if a user was found
	{
		if (password_verify($pass,$result['password'])) { //verify the input password with the hashed
			session_start();
			$_SESSION["admin"] = $user;

			header('Location: control_panel.php');
		} else {
			$error  = "Username or password is not correct.";
		}
	} else {
		$error  = "Username or password is not correct.";
	}
}


?>

<?php
require_once('connect.inc');
require_once('connect2db');
			
$conn=connect_db($host,$db,$db_user,$db_pass);


if (isset($_POST['delete_user'])){
		$username = filter_var($_POST['delete_user'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
		if ($username != "root") {
			$sql_query=$conn->prepare("DELETE FROM users_information WHERE username=?");
			$sql_query->bindParam(1,$username);
			if ($sql_query->execute()) {
				echo "<p class = 'success'>User: ".$username." removed.</p>" ;
			} else {
				echo "<p class = 'error_msg'>An error occured. Please try again.</p>" ;
			}
		} else {
			echo "<p class = 'error_msg'>You cannot delete root account.</p>";
		}
		
}

if (isset($_POST['update_user'])){
	$username = filter_var($_POST['update_user'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$email=filter_var($_POST['email'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$lname=filter_var($_POST['lname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$fname=filter_var($_POST['fname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$password=filter_var($_POST['pass'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$password_retype=filter_var($_POST['pass_ret'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$old_name = $_POST['old_name'];
	$error_msg="";


	if (strlen($username)<=15 && strlen($email)<=50 && strlen($lname)<=25 && strlen($fname)<=25 && $password==$password_retype) {
		
		$sql_query=$conn->prepare("SELECT username FROM users_information WHERE username=?");
		$sql_query->bindParam(1,$username);
		$sql_query->execute();
		$result=$sql_query->fetch();
		//print_r($result);
		
			if (empty($result) || $result['username']==$old_name) {
				if (empty($password)) {
					$sql_query=$conn->prepare("UPDATE users_information SET username=?, fname=?, lname=?, email=? WHERE username=?");
					$sql_query->bindParam(1,$username);
					$sql_query->bindParam(2,$fname);
					$sql_query->bindParam(3,$lname);
					$sql_query->bindParam(4,$email);
					$sql_query->bindParam(5,$old_name);
					
				} else {
					$sql_query=$conn->prepare("UPDATE users_information SET username=?, fname=?, lname=?, email=?, password=?, password_plain=? WHERE username=?");
					$sql_query->bindParam(1,$username);
					$sql_query->bindParam(2,$fname);
					$sql_query->bindParam(3,$lname);
					$sql_query->bindParam(4,$email);
					$sql_query->bindParam(5,password_hash($password,PASSWORD_DEFAULT));
					$sql_query->bindParam(6,$password);
					$sql_query->bindParam(7,$old_name);
				}
				
				if ($sql_query->execute()) {
					echo "<p class='success'>User ".$username." updated.</p>";
				} else {
					echo "<p class='error_msg'>An error occured. Please try again.</p>";
				}
			} else {
				echo "<p class='error_msg'>Username already exists. Try a new one.</p>";
			}

	} else {
		if (strlen($username)>15) {
			$error_msg = "Username must not exceed 15 characters.<br>";
		}
		
		if (strlen($email)>50) {
			$error_msg = $error_msg ."E-mail must not exceed 50 characters.<br>";
		}
		
		if (strlen($lname)>25) {
			$error_msg = $error_msg ."Last name must not exceed 25 characters.<br>";
		}
		
		if (strlen($fname)>25) {
			$error_msg = $error_msg ."First name must not exceed 25 characters.";
		}
		
		if ($password!=$password_retype) {
			$error_msg = $error_msg ."Password fields do not match.";
		}
		
		echo "<p class='error_msg'>".$error_msg."</p>";
	}
}

$conn = NULL;

?>

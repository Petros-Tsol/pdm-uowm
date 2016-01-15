<?php

if (isset($_POST['admin'])){
	require_once('connect.inc');
	require_once('connect2db');
	$conn=connect_db($host,$db,$db_user,$db_pass);
	$admin=$_POST['admin'];
	
	$sql_query=$conn->prepare("SELECT username, fname, lname, email FROM users_information WHERE username=?");
	$sql_query->bindParam(1,$admin);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	foreach ($result as $row){
		$username = $row['username'];
		$fname = $row['fname'];
		$lname = $row['lname'];
		$email = $row['email'];
	}
	
	//print_r($result);
	
	//print '<form>';
	print '<div class="form_design">';
		print '<h1>Update User</h1>';
		print '<label>';
			print '<span>Username:</span><br>';
			print '<input type="text" name="uname" maxlength="15" value="'.$username.'" onblur="notblank(this.value);"/>';
		print '</label>';
	
		print '<label>';
			print '<span>First name:</span><br>';
			print '<input type="text" name="fname" maxlength="25" value="'.$fname.'" onblur="checkname(this.value,this.name);"/>';
		print '</label>';
		
		print '<label>';
			print '<span>Last name:</span><br>';
			print '<input type="text" name="lname" maxlength="25" value="'.$lname.'" onblur="checkname(this.value,this.name);"/>';
		print '</label>';
		
		print '<label>';
			print '<span>Email:</span><br>';
			print '<input type="text" name="email" maxlength="50" value="'.$email.'" disabled>';
		print '</label>';
	
		print '<span>';
			print '<button name="update_user" class = "submit_btn" value="Update" onclick="dlt_us(this.name);" disabled >Update</button>';
			//print str_repeat('&nbsp;', 1);
			print '<button name="delete_user" class = "submit_btn" value="Delete" onclick="dlt_us(this.name);">Delete</button>';
		print '</span>';
		print '<div id="retDiv"></div>';
	print '</div>';
	//print '</form>';
	$conn = NULL;

}

?>

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
		print '<form action="javascript:upd_dlt_us(document.getElementsByName(\'submit_reg\')[0].value)">';
			print '<label>';
				print '<span>Username:</span>';
				print '<input type="text" name="uname" maxlength="15" value="'.$username.'" onblur="notblank(this.value,this.name);">';
			print '</label>';
		
			print '<label>';
				print '<span>First name:</span><br>';
				print '<input type="text" name="fname" maxlength="25" value="'.$fname.'" onblur="checkname(this.value,this.name);">';
			print '</label>';
			
			print '<label>';
				print '<span>Last name:</span><br>';
				print '<input type="text" name="lname" maxlength="25" value="'.$lname.'" onblur="checkname(this.value,this.name);">';
			print '</label>';
			
			print '<label>';
				print '<span>Email:</span><br>';
				print '<input type="text" name="email" maxlength="50" onblur="checkemail(this.value,this.name);" value="'.$email.'">';
			print '</label>';
			
			print '<label>';
				print '<span>Password:</span><br>';
				print '<input type="password" name="password" value="'.$password.'">';
			print '</label>';
			
			print '<label>';
				print '<span>Retype password:</span><br>';
				print '<input type="password" name="password_retype" value="'.$password_retype.'">';
			print '</label>';
		
			print '<span>';
				print str_repeat('&nbsp;', 8);
				//print '<input type="submit" name="submit_reg" class = "submit_btn" value="Update" onclick="upd_dlt_us(this.name);">';
				print '<input type="submit" name="submit_reg" class = "submit_btn" value="Update">';
				print '<button name="delete_user" class = "submit_btn" value="Delete" onclick="upd_dlt_us(this.value);">Delete</button>';
			print '</span>';
		print '</form>';
		print '<div id="retDiv"></div>';
	print '</div>';

	$conn = NULL;
}
?>

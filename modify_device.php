<?php

if (isset($_POST['screen'])){
	require_once('connect.inc');
	require_once('connect2db');
	$conn=connect_db($host,$db,$db_user,$db_pass);
	$screen=$_POST['screen'];
	
	$sql_query=$conn->prepare("SELECT name, description FROM screens WHERE name=?");
	$sql_query->bindParam(1,$screen);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	foreach ($result as $row){
		$screen = $row['name'];
		$descr = $row['description'];
	}
	
	//print '<form>';
	print '<div class="form_design">';
		print '<h1>Update Screen</h1>';
		print '<form action="javascript:upd_dlt_dev(document.getElementsByName(\'submit_reg\')[0].value)">';
			print '<label>';
				print '<span>Screen Name:</span><br>';
				print '<input id = "'.$id.'" type="text" name="scrname" maxlength="20" value="'.$screen.'" onblur="notblank(this.value,this.name);"/>';
			print '</label>';
			
			
			print '<label>';
				print '<span>Description:</span><br>';
				print '<input type="text" name="description" maxlength="30" value="'.$descr.'" onblur="notblank(this.value,this.name);">';
			print '</label>';
		
			
			print '<span>';
				print str_repeat('&nbsp;', 8);
				print '<input type="submit" name="submit_reg" class = "submit_btn" value="Update">';
				print '<button name="delete_device" class = "submit_btn" value="Delete" onclick="upd_dlt_dev(this.value);">Delete</button>';
			print '</span>';
		print '</form>';
		print '<div id="retDiv"></div>';
	print '</div>';
	//print '</form>';
	$conn = NULL;
}

?>


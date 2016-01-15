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
		print '<label>';
			print '<span>Screen Name:</span><br>';
			print '<input id = "'.$id.'" type="text" name="scrname" maxlength="20" value="'.$screen.'" onblur="notblank(this.value,this.name);"/>';
		print '</label>';
		
		
		print '<label>';
			print '<span>Description:</span><br>';
			print '<input type="text" name="description" maxlength="30" value="'.$descr.'" onblur="notblank(this.value,this.name);">';
		print '</label>';
	
		
		print '<span>';
			print '<button name="update_device" value="Update" onclick="dlt_us(this.name);" disabled >Update</button>';
			print str_repeat('&nbsp;', 1);
			print '<button name="delete_device" value="Delete" onclick="dlt_us(this.name);">Delete</button>';
		print '</span>';
		print '<div id="retDiv"></div>';
	print '</div>';
	//print '</form>';
	$conn = NULL;
}

?>


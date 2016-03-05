<?php
if (isset($_POST['group'])){
	require_once('connect.inc');
	require_once('connect2db');
	$conn=connect_db($host,$db,$db_user,$db_pass);
	$group=$_POST['group'];
	
	$sql_query=$conn->prepare("SELECT name, description FROM groups WHERE name=?");
	$sql_query->bindParam(1,$group);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	foreach ($result as $row){
		$group = $row['name'];
		$group_descr = $row['description'];
	}
	
	//print '<form>';
	print '<div class="form_design">';
		print '<h1>Update Group</h1>';
		print '<form action="javascript:upd_dlt_group(document.getElementsByName(\'submit_reg\')[0].value)">';
			print '<label>';
				print '<span>Group Name:</span><br>';
				print '<input type="text" name="gname" maxlength="20" value="'.$group.'" onblur="notblank(this.value,this.name);"/>';
			print '</label>';
			
			
			print '<label>';
				print '<span>Description:</span><br>';
				print '<textarea name="group_description" maxlength="300" value="'.$group_descr.'" onblur="notblank(this.value,this.name);">'.$group_descr.'</textarea>';
			print '</label>';
		
			
			print '<span>';
				print str_repeat('&nbsp;', 8);
				print '<input type="submit" name="submit_reg" class = "submit_btn" value="Update">';
				print '<button name="delete_group" class = "submit_btn" value="Delete" onclick="upd_dlt_group(this.value);">Delete</button>';
			print '</span>';
		print '</form>';
		print '<div id="retDiv"></div>';
	print '</div>';
	//print '</form>';
	$conn = NULL;
}

?>

<?php
require_once('connect.inc');
require_once('connect2db');
				
$conn=connect_db($host,$db,$db_user,$db_pass);

if ($_POST['button']=="select") {
	$data = array();

	$sql_query=$conn->prepare("SELECT name FROM screens JOIN screens_groups ON screens.id = screens_groups.screen_id JOIN groups ON groups.id = screens_groups.group_id WHERE groups.description = ?");
	$sql_query->bindParam(1,$_POST['group']);
	$sql_query->execute();

	$data['screens']=$sql_query->fetchAll();

	$sql_query=$conn->prepare("SELECT username FROM users_information JOIN users_privileges ON users_information.id = users_privileges.user_id JOIN groups ON groups.id = users_privileges.group_id WHERE groups.description = ?");
	$sql_query->bindParam(1,$_POST['group']);
	$sql_query->execute();

	$data['users']=$sql_query->fetchAll();

	echo json_encode($data);
}

if ($_POST['button']=="update") {
	
	$sql_query=$conn->prepare("SELECT id FROM groups WHERE description=?");
	$sql_query->bindParam(1,$_POST['group']);
	$sql_query->execute();
	$result = $sql_query->fetchAll();
	
	foreach ($result as $row) {
		$group_id = $row[0];
	}
	
	$sql_query=$conn->prepare("DELETE FROM screens_groups WHERE group_id=?");
	$sql_query->bindParam(1,$group_id);
	$sql_query->execute();
	
	$sql_query=$conn->prepare("DELETE FROM users_privileges WHERE group_id=?");
	$sql_query->bindParam(1,$group_id);
	$sql_query->execute();
	
	for ($i=0;$i<count($_POST['screens']);$i=$i+1) {
		$sql_query=$conn->prepare("INSERT INTO screens_groups (screen_id,group_id) SELECT screens.id, groups.id FROM screens JOIN groups WHERE screens.name=? AND groups.description=?");
		$sql_query->bindParam(1,$_POST['screens'][$i]);
		$sql_query->bindParam(2,$_POST['group']);
		if (!$sql_query->execute()){
			break;
		}
	}
	
	for ($j=0;$j<count($_POST['users']);$j=$j+1) {
		$sql_query=$conn->prepare("INSERT INTO users_privileges (user_id,group_id) SELECT users_information.id, groups.id FROM users_information JOIN groups WHERE users_information.username=? AND groups.description=?");
		$sql_query->bindParam(1,$_POST['users'][$j]);
		$sql_query->bindParam(2,$_POST['group']);
		if (!$sql_query->execute()) {
			break;
		}
	}
	
	if ($i==count($_POST['screens']) && $j==count($_POST['users'])) {
		$success_msg = 'Group updated.';
	} else {
		$success_msg = 'An error occured. Please try again.';
	}
	
	echo $success_msg;
}

$conn = NULL;
?>

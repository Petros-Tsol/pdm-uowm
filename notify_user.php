<?php
require_once('connect.inc');
require_once('connect2db');

$conn=connect_db($host,$db,$db_user,$db_pass);

$subject = "PDM UOWM - Offline Screens Update";
$headers = 'From: PDM UOWM Admin';

$sql_query=$conn->prepare("SELECT id, username, email FROM users_information");
$sql_query->execute();
$users=$sql_query->fetchAll();


foreach ($users as $row) {
	$offline_screens = ""; //names of offline screens
	$sql_query=$conn->prepare("SELECT DISTINCT screen_id FROM screens_groups JOIN users_privileges ON screens_groups.group_id = users_privileges.group_id WHERE users_privileges.user_id=?"); //select screens where this admin can operate
	$sql_query->bindParam(1,$row['id']);
	$sql_query->execute();
	$result = $sql_query->fetchAll();
	
	foreach($result as $screen) {
		$sql_query=$conn->prepare("SELECT name FROM screens WHERE webid=? AND id=?");
		$sql_query->bindValue(1,'');
		$sql_query->bindParam(2,$screen['screen_id']);
		$sql_query->execute();
		$screen_name = $sql_query->fetch();
		
		if (!empty($screen_name)){
			$offline_screens = $offline_screens.$screen_name['name'].'<br>';
		}
	}
	if (!empty($offline_screens)) {
		$to = $row['email'];
		$message = "Hello ".$row['username'].". We would like to inform you that the below screens are offline:<br>\r\n".$offline_screens."Sincerely PDM UOWM Administration.";
		//mail($to, $subject, $message,$headers); THIS LINE MUST COMMENTED OUT!!!!
		//echo $message;
		//echo '<hr>';
	}
}

$conn = NULL;
?>

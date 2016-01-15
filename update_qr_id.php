<?php
require_once('connect.inc');
require_once('connect2db');
require_once('rng.php');
$conn=connect_db($host,$db,$db_user,$db_pass);

$sql_query=$conn->prepare("SELECT webid FROM screens WHERE webid<>?");
$sql_query->bindValue(1,"");
$sql_query->execute();
$result=$sql_query->fetchAll();

foreach ($result as $row){
	do { //generate a unique random qrcode_id
		$qrid = random_webid(15);
		$sql_query=$conn->prepare("SELECT qrcode_id FROM screens WHERE qrcode_id LIKE ?");
		$sql_query->bindParam(1,$qrid);
		$sql_query->execute();
		$unique_qr=$sql_query->fetchAll();
	} while (!empty($unique_qr));
	$sql_query=$conn->prepare("UPDATE screens SET qrcode_id=? WHERE webid=?");
	$sql_query->bindParam(1,$qrid);
	$sql_query->bindParam(2,$row[0]);
	$sql_query->execute();
}

$conn = NULL;
?>

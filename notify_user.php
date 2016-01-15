<?php

require_once('connect.inc');
require_once('connect2db');

$conn=connect_db($host,$db,$db_user,$db_pass);

$sql_query=$conn->prepare("SELECT name, building, room FROM screens WHERE webid=?");
$sql_query->bindValue(1,"");
$sql_query->execute();
$result=$sql_query->fetchAll();

$n = count($result); // number of offline screens.
$offline_screens=""; // message

for ($i=0;$i<$n;$i=$i+1){
	$offline_screens = $offline_screens."Screen named ".$result[$i][0]." at location ".$result[$i][1]." and room ".$result[$i][2]." is offline.\r\n";
}

$sql_query=$conn->prepare("SELECT username, email FROM users_information");
$sql_query->execute();
$result=$sql_query->fetchAll();

$subject = "PDM UOWM - Offline Screens Update";
$headers = 'From: PDM UOWM Admin';
foreach ($result as $row){
	$to = $row[1];
	$message = "Hello ".$row[0].". We would like to inform you that:\r\n".$offline_screens."Sincerely PDM UOWM Administration.";
	//mail($to, $subject, $message,$headers);
}
//mail('petros.tsolakis@gmail.com', $subject, $message,$headers);
$conn = NULL;
?>

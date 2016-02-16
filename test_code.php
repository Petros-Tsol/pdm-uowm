<?php
function compareValue($val1, $val2){
	return strcmp($val1['group_id'], $val2['group_id']);
}

require_once('connect.inc');
require_once('connect2db');
$conn=connect_db($host,$db,$db_user,$db_pass);

$sql_query=$conn->prepare("SELECT id, webid FROM screens WHERE name = ?");
$sql_query->bindValue(1,"screen009");
$sql_query->execute();
$webid=$sql_query->fetch();

$sql_query=$conn->prepare("SELECT group_id FROM screens_groups WHERE screen_id = ?");
$sql_query->bindParam(1,$webid['id']);
$sql_query->execute();
$screen_groups=$sql_query->fetchAll();

$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username=?");
$sql_query->bindValue(1,"root");
$sql_query->execute();
$user_id=$sql_query->fetch();

$sql_query=$conn->prepare("SELECT group_id FROM users_privileges WHERE user_id = ?");
$sql_query->bindParam(1,$user_id['id']);
$sql_query->execute();
$user_groups=$sql_query->fetchAll();

var_dump($user_groups);
echo "<br>";
var_dump($screen_groups);
echo "<br>";

$common_groups = array_uintersect($user_groups,$screen_groups,'compareValue');
echo empty($common_groups);
$conn = null;
?>
